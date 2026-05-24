import { NextRequest, NextResponse } from 'next/server';
import { estimateBandFromText } from '@/data/ielts-test';

const MODEL = 'claude-sonnet-4-5';

const TASK1_PROMPT = `You are an expert IELTS Academic Writing examiner.

TASK 1: The bar chart shows the number of Indian students (in thousands) studying in five countries (Canada, USA, UK, Australia, Germany) from 2018 to 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.

STUDENT RESPONSE:
"STUDENT_RESPONSE"

Evaluate against all four IELTS criteria: Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.

Respond with ONLY valid JSON, no markdown fences:
{"band": 6.5, "feedback": "2-3 specific, actionable sentences of feedback."}`;

const TASK2_PROMPT = `You are an expert IELTS Academic Writing examiner.

TASK 2: "Some people believe that universities should focus primarily on developing students' employability skills rather than academic knowledge. To what extent do you agree or disagree?" Write at least 250 words.

STUDENT RESPONSE:
"STUDENT_RESPONSE"

Evaluate against all four IELTS criteria: Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.

Respond with ONLY valid JSON, no markdown fences:
{"band": 6.5, "feedback": "2-3 specific, actionable sentences of feedback."}`;

function parseScore(text: string): { band: number; feedback: string } {
  try {
    const match = text.match(/\{[\s\S]*?\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      const band = Math.min(9, Math.max(1, Number(parsed.band) || 6));
      return { band: Math.round(band * 2) / 2, feedback: String(parsed.feedback || '') };
    }
  } catch { /* fall through */ }
  return { band: 6.0, feedback: 'Your response has been received. Contact us for detailed feedback.' };
}

export async function POST(request: NextRequest) {
  try {
    const { task1Text, task2Text } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        task1Band: estimateBandFromText(String(task1Text), 150),
        task2Band: estimateBandFromText(String(task2Text), 250),
        task1Feedback: 'AI scoring unavailable. Add ANTHROPIC_API_KEY in Vercel environment variables to enable detailed feedback.',
        task2Feedback: 'AI scoring unavailable. Add ANTHROPIC_API_KEY in Vercel environment variables to enable detailed feedback.',
      });
    }

    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const [t1Res, t2Res] = await Promise.all([
      client.messages.create({
        model: MODEL,
        max_tokens: 400,
        messages: [{ role: 'user', content: TASK1_PROMPT.replace('STUDENT_RESPONSE', String(task1Text).slice(0, 2000)) }],
      }),
      client.messages.create({
        model: MODEL,
        max_tokens: 400,
        messages: [{ role: 'user', content: TASK2_PROMPT.replace('STUDENT_RESPONSE', String(task2Text).slice(0, 3000)) }],
      }),
    ]);

    const t1Text = t1Res.content[0].type === 'text' ? t1Res.content[0].text : '';
    const t2Text = t2Res.content[0].type === 'text' ? t2Res.content[0].text : '';

    const t1 = parseScore(t1Text);
    const t2 = parseScore(t2Text);

    return NextResponse.json({ task1Band: t1.band, task2Band: t2.band, task1Feedback: t1.feedback, task2Feedback: t2.feedback });
  } catch (err) {
    console.error('IELTS score error:', err);
    return NextResponse.json({ error: 'Scoring failed', task1Band: 6.0, task2Band: 6.0, task1Feedback: 'Scoring unavailable.', task2Feedback: 'Scoring unavailable.' }, { status: 200 });
  }
}
