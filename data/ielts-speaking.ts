export interface SpeakingQuestion {
  id: number;
  question: string;
  sampleAnswer: string;
  keyPhrases?: string[];
}

export interface CueCard {
  topic: string;
  points: string[];
  followUp: string;
  sampleAnswer: string;
  bandTips: string[];
}

export interface SpeakingPart {
  partNumber: 1 | 2 | 3;
  title: string;
  description: string;
  timeMinutes: string;
  questions?: SpeakingQuestion[];
  cueCard?: CueCard;
  discussionQuestions?: SpeakingQuestion[];
}

export interface SpeakingTest {
  level: string;
  bandTarget: string;
  totalTime: string;
  parts: [SpeakingPart, SpeakingPart, SpeakingPart];
}

// ─── BEGINNER ────────────────────────────────────────────────────────────────
const beginnerSpeaking: SpeakingTest = {
  level: 'beginner',
  bandTarget: '4.0 – 5.5',
  totalTime: '11–14 minutes',
  parts: [
    {
      partNumber: 1,
      title: 'Introduction & Interview',
      description: 'The examiner asks you personal questions about familiar topics.',
      timeMinutes: '4–5',
      questions: [
        {
          id: 1,
          question: 'Can you tell me your name and where you are from?',
          sampleAnswer: 'My name is Priya and I come from Mumbai, which is a big city in India. I have lived there all my life.',
          keyPhrases: ['My name is...', 'I come from...', 'I have lived there...'],
        },
        {
          id: 2,
          question: 'Do you work or are you a student?',
          sampleAnswer: 'I am currently a student. I am studying commerce at my local college, and I hope to work in a bank when I graduate.',
          keyPhrases: ['I am currently...', 'I am studying...', 'I hope to...'],
        },
        {
          id: 3,
          question: 'What do you like to do in your free time?',
          sampleAnswer: 'In my free time, I enjoy listening to music and reading novels. I also like to go for walks in the park near my house, especially in the evenings.',
          keyPhrases: ['I enjoy...', 'I also like to...', 'especially...'],
        },
        {
          id: 4,
          question: 'Do you use public transport? Why or why not?',
          sampleAnswer: 'Yes, I use public transport every day. I take the bus to college because it is cheaper than a taxi and easier than driving in the traffic. Sometimes I also take the train for longer journeys.',
          keyPhrases: ['I use...', 'because it is...', 'sometimes...'],
        },
        {
          id: 5,
          question: 'What kind of food do you like?',
          sampleAnswer: 'I love Indian food, especially my mother\'s cooking. My favourite dish is biryani. I also enjoy trying different types of food — I like Chinese food and pizza as well.',
          keyPhrases: ['I love...', 'My favourite...', 'I also enjoy...'],
        },
      ],
    },
    {
      partNumber: 2,
      title: 'Individual Long Turn',
      description: 'You have 1 minute to prepare, then speak for 1–2 minutes on the cue card topic.',
      timeMinutes: '3–4',
      cueCard: {
        topic: 'Describe a place you enjoy visiting.',
        points: [
          'Where the place is',
          'How often you go there',
          'What you do there',
          'Why you enjoy it',
        ],
        followUp: 'Do you prefer to visit places alone or with others?',
        sampleAnswer: `I would like to talk about a park near my home called Shivaji Park. It is a large green park in my neighbourhood, and I have visited it since I was a child.

I go there almost every evening, usually after dinner. Sometimes I go with my family, and sometimes I go alone for some peace and quiet.

When I am there, I usually walk around the paths or sit on a bench and watch the sunset. Sometimes I meet friends there, and we sit and talk for a while. There is also a small tea stall at the entrance where I often buy a cup of chai.

I enjoy visiting this park because it helps me relax and forget about my studies. It is a very calm place, and the fresh air makes me feel much better after a stressful day. I also like the fact that it is close to my home, so I can go there whenever I want.`,
        bandTips: [
          'Use your 1 minute preparation time to make brief notes under each bullet point',
          'Speak continuously — don\'t pause for long or stop mid-sentence',
          'Use past tense to describe past visits, present tense for general descriptions',
          'Add personal details and feelings to make your answer more interesting',
        ],
      },
    },
    {
      partNumber: 3,
      title: 'Two-Way Discussion',
      description: 'The examiner asks more abstract questions related to the Part 2 topic.',
      timeMinutes: '4–5',
      discussionQuestions: [
        {
          id: 1,
          question: 'Why are parks and green spaces important for cities?',
          sampleAnswer: 'I think parks are very important for cities because they give people a place to relax away from the noise and pollution. City life can be very stressful, and having green spaces helps people to calm down. Parks are also good for children who need space to play and exercise.',
          keyPhrases: ['I think...', 'because they...', 'also good for...'],
        },
        {
          id: 2,
          question: 'Do you think young people today spend enough time outdoors?',
          sampleAnswer: 'Honestly, I don\'t think young people go outside enough these days. Many young people spend most of their time on their phones or playing video games indoors. This is not good for their health or their social skills. I believe parents and schools should encourage young people to go outside more.',
          keyPhrases: ['Honestly, I don\'t think...', 'Many young people...', 'I believe...'],
        },
        {
          id: 3,
          question: 'How have cities changed in recent years in terms of public spaces?',
          sampleAnswer: 'From what I have seen in my city, there are more shopping malls and buildings now, and fewer open spaces than before. However, the government has also been building some new parks and playgrounds. I think there is still not enough green space compared to the size of the population.',
          keyPhrases: ['From what I have seen...', 'However...', 'I think there is still...'],
        },
      ],
    },
  ],
};

// ─── INTERMEDIATE ─────────────────────────────────────────────────────────────
const intermediateSpeaking: SpeakingTest = {
  level: 'intermediate',
  bandTarget: '5.5 – 7.0',
  totalTime: '11–14 minutes',
  parts: [
    {
      partNumber: 1,
      title: 'Introduction & Interview',
      description: 'The examiner asks you questions about yourself and familiar topics.',
      timeMinutes: '4–5',
      questions: [
        {
          id: 1,
          question: 'What do you do — are you working or studying?',
          sampleAnswer: 'I\'m currently working as a junior accountant for a mid-sized company in Pune. I\'ve been in this role for about two years, and I\'m also studying part-time for a professional qualification. It can be quite demanding, but I find the work genuinely interesting.',
          keyPhrases: ['I\'m currently...', 'I\'ve been in this role for...', 'I find it...'],
        },
        {
          id: 2,
          question: 'How important is technology in your daily life?',
          sampleAnswer: 'It\'s become absolutely essential, to be honest. I use my phone and laptop for almost everything — work communications, navigation, keeping up with news, staying in touch with family abroad. I don\'t think I could function as efficiently without it, though I do try to set limits on screen time in the evenings.',
          keyPhrases: ['It\'s become...', 'I use... for...', 'I do try to...'],
        },
        {
          id: 3,
          question: 'Do you prefer living in a city or a quieter area?',
          sampleAnswer: 'At the moment I prefer city life, mainly because of the convenience — everything is accessible, public transport is good, and there\'s always something to do. But honestly, as I get older, I think I\'d enjoy a slower pace. I have relatives in the countryside and visiting them always feels refreshing.',
          keyPhrases: ['At the moment...', 'mainly because of...', 'as I get older, I think...'],
        },
        {
          id: 4,
          question: 'How do you usually spend your weekends?',
          sampleAnswer: 'Weekends vary quite a bit for me. Saturdays are often spent catching up on errands and spending time with family. On Sundays I tend to be more active — I play badminton with a group of friends or go for a cycle ride. I also enjoy cooking something more elaborate on Sunday evenings, which I find quite relaxing.',
          keyPhrases: ['vary quite a bit', 'I tend to...', 'I also enjoy...', 'which I find...'],
        },
      ],
    },
    {
      partNumber: 2,
      title: 'Individual Long Turn',
      description: 'You have 1 minute to prepare, then speak for 1–2 minutes on the cue card topic.',
      timeMinutes: '3–4',
      cueCard: {
        topic: 'Describe a skill you would like to learn in the future.',
        points: [
          'What the skill is',
          'How you would learn it',
          'Why you want to learn it',
          'How it would benefit you',
        ],
        followUp: 'Is it important for adults to keep learning new skills?',
        sampleAnswer: `One skill I've always wanted to learn is photography — specifically portrait and street photography. I've admired the work of professional photographers for a long time, and I feel like it's a skill that combines technical knowledge with real creativity.

If I were to pursue it seriously, I'd probably start by taking an online course to understand the basics of aperture, shutter speed, and composition. I'd then practise regularly by walking around the city with a camera and taking photos of everyday scenes and people.

The reason I want to learn this skill is partly personal and partly professional. On a personal level, I love travelling and would love to document my experiences in a more artistic way rather than just taking phone snapshots. Professionally, I think having photography skills could be useful for my company's social media content.

I genuinely believe it would enrich my life — it would force me to slow down and notice things I normally walk past, which feels valuable in a world where everyone's rushing.`,
        bandTips: [
          'Link the four bullet points naturally — avoid treating them as a checklist',
          'Include both practical details and reflective commentary on why it matters to you',
          'Use a variety of tenses: conditional (would), present perfect (I\'ve always wanted), and simple present',
          'Aim for 1.5 to 2 minutes — don\'t rush or pad unnecessarily',
        ],
      },
    },
    {
      partNumber: 3,
      title: 'Two-Way Discussion',
      description: 'The examiner asks abstract questions related to skills and learning.',
      timeMinutes: '4–5',
      discussionQuestions: [
        {
          id: 1,
          question: 'Do you think formal education adequately prepares people for the skills needed in modern workplaces?',
          sampleAnswer: 'In some respects, yes, but I think there are clear gaps. Formal education generally does a good job of providing theoretical knowledge, but things like communication skills, financial literacy, and adaptability to change are often underdeveloped. Many employers I know say that graduates need considerable on-the-job training before they\'re truly ready for professional environments.',
          keyPhrases: ['In some respects...', 'there are clear gaps', 'considerable on-the-job training'],
        },
        {
          id: 2,
          question: 'How has technology changed the way people learn new skills?',
          sampleAnswer: 'Enormously, I think. Ten years ago, if you wanted to learn something like graphic design or a new language, you\'d need to enrol in a class or find a tutor. Now, there are high-quality courses online — often free or very affordable — that allow people to learn at their own pace from anywhere in the world. That democratisation of learning is genuinely transformative, though it also requires a lot of self-discipline.',
          keyPhrases: ['Enormously...', 'Ten years ago...', 'Now, there are...', 'democratisation of learning'],
        },
        {
          id: 3,
          question: 'Some people argue that employers should invest more in employee training. Do you agree?',
          sampleAnswer: 'I\'d strongly agree with that. There\'s a tendency for companies to treat training as a cost rather than an investment, but the evidence suggests that employees who receive regular training are more engaged, more productive, and less likely to leave. In a competitive labour market, upskilling your existing workforce is often more cost-effective than constantly recruiting externally. Of course, it requires a long-term perspective that not all businesses are willing to adopt.',
          keyPhrases: ['I\'d strongly agree...', 'there\'s a tendency to...', 'the evidence suggests...', 'long-term perspective'],
        },
      ],
    },
  ],
};

// ─── ADVANCED ─────────────────────────────────────────────────────────────────
const advancedSpeaking: SpeakingTest = {
  level: 'advanced',
  bandTarget: '7.0 – 9.0',
  totalTime: '11–14 minutes',
  parts: [
    {
      partNumber: 1,
      title: 'Introduction & Interview',
      description: 'The examiner asks questions about yourself and familiar topics.',
      timeMinutes: '4–5',
      questions: [
        {
          id: 1,
          question: 'Tell me about the kind of work or study that you do.',
          sampleAnswer: 'I work as a product manager for a fintech startup based in Bangalore. The role sits at the intersection of technology, user experience, and business strategy, which I find stimulating — no two days are particularly alike. I\'m currently overseeing the launch of a credit scoring feature that uses alternative data points, which has been both technically challenging and commercially exciting.',
          keyPhrases: ['sits at the intersection of...', 'no two days are alike', 'currently overseeing...'],
        },
        {
          id: 2,
          question: 'How has your city or region changed over the past decade?',
          sampleAnswer: 'Dramatically, in many respects. Bangalore has undergone a kind of dual transformation — on one hand there\'s been extraordinary growth in the tech and startup ecosystem, which has brought wealth and infrastructure investment. On the other, that growth has exacerbated inequalities and put enormous strain on public services and transport. Whether the net effect has been positive is genuinely contested among residents.',
          keyPhrases: ['dual transformation', 'exacerbated inequalities', 'genuinely contested'],
        },
        {
          id: 3,
          question: 'Do you think the way people consume news has changed? How?',
          sampleAnswer: 'Profoundly so. There\'s been a migration from traditional broadcast and print media towards social media and algorithm-curated feeds, which has had ambiguous consequences. On one hand, information is more accessible and immediate than ever. On the other, the business model of social media platforms incentivises engagement over accuracy, which has contributed to the proliferation of misinformation and the fragmentation of shared public discourse.',
          keyPhrases: ['migration towards...', 'ambiguous consequences', 'incentivises engagement over accuracy', 'fragmentation of shared discourse'],
        },
        {
          id: 4,
          question: 'How important is it to maintain connections with people from your past?',
          sampleAnswer: 'I think it varies enormously depending on the nature of those relationships and how much they\'ve shaped who you are. Some connections from my past — former mentors, childhood friends who knew me before my professional identity solidified — feel genuinely sustaining. But I\'m wary of nostalgia driving the impulse; sometimes relationships run their natural course and there\'s little authentic basis to maintain them.',
          keyPhrases: ['varies enormously depending on...', 'genuinely sustaining', 'wary of nostalgia', 'authentic basis'],
        },
      ],
    },
    {
      partNumber: 2,
      title: 'Individual Long Turn',
      description: 'You have 1 minute to prepare, then speak for 1–2 minutes on the cue card topic.',
      timeMinutes: '3–4',
      cueCard: {
        topic: 'Describe a time when you had to make a difficult decision.',
        points: [
          'What the decision was',
          'What the options were',
          'How you went about deciding',
          'What the outcome was and how you felt about it',
        ],
        followUp: 'Do you think people today have to make more complex decisions than previous generations?',
        sampleAnswer: `The decision I want to describe was whether to leave a well-paying corporate job to join an early-stage startup about three years ago. On the surface it might sound like an obvious choice for someone with entrepreneurial ambitions, but the reality was considerably more nuanced.

The options, broadly speaking, were to stay in a stable role with strong compensation and a clear career ladder, or to join a company with genuine upside but significant uncertainty — the startup had been operating for less than a year and was pre-revenue at that point.

In terms of how I decided, I took a fairly structured approach. I spoke with the founders extensively to assess their calibre and their vision. I stress-tested my own financial position — how long could I sustain myself if the company failed within 12 months? I also sought the perspective of two people whose judgement I trusted deeply: a former manager and a friend who had made a similar transition.

Ultimately, I decided to make the move, and it turned out to be one of the better decisions of my professional life — not only because the company has grown significantly, but because the learning curve has been extraordinary. I'm not entirely sure I'd have been comfortable with the opposite decision.`,
        bandTips: [
          'At Band 7+ the examiner is looking for analytical depth, not just narrative — explain your reasoning, not just what happened',
          'Use sophisticated hedging: "arguably," "to some extent," "with the benefit of hindsight"',
          'Demonstrate awareness of complexity — acknowledge what made the decision genuinely hard',
          'Vary your pace and emphasis — strategic pauses can be as effective as content',
        ],
      },
    },
    {
      partNumber: 3,
      title: 'Two-Way Discussion',
      description: 'The examiner asks abstract questions related to decisions and broader societal issues.',
      timeMinutes: '4–5',
      discussionQuestions: [
        {
          id: 1,
          question: 'Do you think individuals or institutions are better placed to make decisions that affect large numbers of people?',
          sampleAnswer: 'That\'s a tension that runs through political philosophy from Plato to the present. I think the honest answer is that it depends on the type of decision and the quality of the institutional design. Well-designed institutions — with diverse representation, transparency, and accountability mechanisms — can aggregate information and balance competing interests in ways that individuals cannot. But institutions can also calcify, capture vested interests, and lose responsiveness to change. There\'s no universal answer; the question is what safeguards are in place.',
          keyPhrases: ['tension that runs through...', 'aggregate information', 'calcify', 'vested interests', 'safeguards'],
        },
        {
          id: 2,
          question: 'Some argue that big data and AI should play a greater role in important societal decisions. What\'s your view?',
          sampleAnswer: 'It\'s an area I find both compelling and concerning. There\'s a persuasive case that data-driven decision-making can reduce the role of prejudice and personal interest in outcomes that should be impartial — in healthcare prioritisation or resource allocation, for instance. But the notion that algorithms are neutral is demonstrably false; they encode the values and biases of their designers and the data they\'re trained on. Without robust mechanisms for transparency and contestability, deferring consequential decisions to AI systems is, at best, premature and, at worst, a way of laundering accountability.',
          keyPhrases: ['compelling and concerning', 'demonstrably false', 'encode values', 'laundering accountability', 'contestability'],
        },
        {
          id: 3,
          question: 'How do you think the increasing volume of choices available to people today affects their wellbeing?',
          sampleAnswer: 'The psychologist Barry Schwartz made a compelling case for what he calls the "paradox of choice" — that beyond a certain threshold, more options correlate not with greater satisfaction but with greater anxiety, regret, and decision fatigue. I think there\'s real merit to that argument. We\'re arguably living in a period of historically unprecedented optionality — in relationships, careers, identities, consumption — and the cognitive and emotional burden of navigating that is not trivial. That said, restricted choice has its own profound costs; the freedom to choose is fundamental to dignity. The challenge is building personal and institutional structures that help filter intelligently without constraining meaningfully.',
          keyPhrases: ['paradox of choice', 'decision fatigue', 'unprecedented optionality', 'cognitive burden', 'filter intelligently'],
        },
      ],
    },
  ],
};

export const speakingTests: Record<string, SpeakingTest> = {
  beginner: beginnerSpeaking,
  intermediate: intermediateSpeaking,
  advanced: advancedSpeaking,
};
