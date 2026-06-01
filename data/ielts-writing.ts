export interface WritingTask {
  taskNumber: 1 | 2;
  title: string;
  prompt: string;
  minWords: number;
  timeMinutes: number;
  graphDescription?: string; // For Task 1
  sampleAnswer: string;
  bandTips: string[];
  keyVocabulary?: string[];
}

export interface WritingTest {
  level: string;
  bandTarget: string;
  tasks: [WritingTask, WritingTask];
}

// ─── BEGINNER ────────────────────────────────────────────────────────────────
const beginnerWriting: WritingTest = {
  level: 'beginner',
  bandTarget: '4.0 – 5.5',
  tasks: [
    {
      taskNumber: 1,
      title: 'Bar Chart – Library Visits',
      prompt: 'The bar chart below shows the number of people who visited a public library each month from January to June. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
      graphDescription: 'Bar chart showing monthly library visits: Jan: 1,200 | Feb: 950 | Mar: 1,400 | Apr: 1,800 | May: 2,100 | Jun: 1,600',
      minWords: 150,
      timeMinutes: 20,
      sampleAnswer: `The bar chart illustrates the number of visitors to a public library over a six-month period from January to June.

Overall, library visits showed an upward trend from January to May, before declining slightly in June.

In January, the library received 1,200 visitors. This figure dropped to its lowest point in February at 950 visitors. However, numbers began to recover in March, rising to 1,400.

The most significant growth occurred between March and May. Visits increased from 1,400 in March to 1,800 in April, and then reached the peak of 2,100 in May. This represents an increase of nearly 150% compared to the February low.

In June, visitor numbers fell back to 1,600, which was still higher than any month in the January-March period.

In conclusion, while there was some fluctuation, the overall pattern shows a general increase in library usage during spring, with May being the busiest month of the period shown.`,
      bandTips: [
        'Start with an overview sentence that describes the main trend',
        'Describe the highest and lowest points with specific numbers',
        'Use sequencing words: first, then, after that, finally',
        'Avoid personal opinions — just describe what you see',
        'Compare months using words like "higher than," "lower than," "similar to"',
      ],
      keyVocabulary: ['illustrates', 'upward trend', 'declined', 'peak', 'fluctuation', 'overall pattern', 'significant growth'],
    },
    {
      taskNumber: 2,
      title: 'Essay – Technology and Learning',
      prompt: 'Some people think that children should learn to use computers from a very young age. Others believe this can have negative effects. Discuss both views and give your own opinion. Write at least 250 words.',
      minWords: 250,
      timeMinutes: 40,
      sampleAnswer: `In today's digital world, there is a growing debate about whether young children should learn to use computers from an early age. While some people support early computer education, others worry about its potential drawbacks. This essay will discuss both perspectives before giving my own view.

Those who support early computer use argue that technology is an essential skill in modern life. Children who learn to use computers early can develop important digital skills that will help them in school and in their future careers. Additionally, there are many educational programmes and games designed specifically for children that can help them learn maths, reading, and science in an engaging way.

On the other hand, critics of early technology use point out several concerns. First, spending too much time on screens can harm children's eyesight and physical health, as they may spend less time doing outdoor activities. Second, young children who use computers too much may develop poor social skills because they spend less time talking and playing with other children. Finally, some parents worry that children may access inappropriate content online.

In my opinion, a balanced approach is the most sensible solution. Children can benefit from learning basic computer skills, but this should be done with time limits and parental supervision. Schools and parents should ensure that technology use is balanced with physical play, reading, and social interaction.

In conclusion, while computers can be a valuable learning tool for children, it is important to manage their use carefully to avoid negative consequences.`,
      bandTips: [
        'Write a clear introduction that states the topic and your approach',
        'Discuss BOTH sides — one paragraph for each view',
        'Give your opinion clearly in the conclusion',
        'Use linking words: however, on the other hand, in addition, therefore',
        'Aim for at least 3 sentences per paragraph',
      ],
      keyVocabulary: ['debate', 'essential skill', 'digital skills', 'engaging', 'inappropriate content', 'balanced approach', 'parental supervision'],
    },
  ],
};

// ─── INTERMEDIATE ─────────────────────────────────────────────────────────────
const intermediateWriting: WritingTest = {
  level: 'intermediate',
  bandTarget: '5.5 – 7.0',
  tasks: [
    {
      taskNumber: 1,
      title: 'Line Graph – Renewable Energy Production',
      prompt: 'The line graph below shows the percentage of electricity generated from renewable sources in four countries between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
      graphDescription: 'Line graph: Germany: 5%→45% (steady rise) | UK: 2%→38% (sharp rise after 2010) | India: 1%→22% (gradual rise) | Brazil: 60%→72% (relatively stable, slight increase)',
      minWords: 150,
      timeMinutes: 20,
      sampleAnswer: `The line graph compares the proportion of electricity produced from renewable sources in Germany, the UK, India, and Brazil over a twenty-year period from 2000 to 2020.

Overall, all four countries showed an increase in renewable energy generation, though the patterns and starting points varied considerably. Brazil maintained the highest share throughout the period, while Germany and the UK showed the most dramatic improvements.

In 2000, Brazil already generated 60% of its electricity from renewables — predominantly hydropower — and this figure rose modestly to 72% by 2020. Germany began the period at just 5% but experienced a consistent upward trajectory, reaching 45% in 2020, largely driven by wind and solar expansion.

The UK showed a particularly sharp increase after 2010, rising from approximately 8% to 38% by 2020 — the steepest rate of growth among the four countries. India, starting from the lowest base of just 1%, reached 22% by 2020, representing significant progress despite beginning from a lower level.

In conclusion, while Brazil led in absolute terms, the European nations demonstrated the most remarkable transformations in their energy profiles over this period.`,
      bandTips: [
        'Write a clear overview highlighting the most significant trends',
        'Group countries by similarity or contrast for clear comparisons',
        'Use phrases like "rose steadily," "increased sharply," "remained relatively stable"',
        'Include specific data points but don\'t list every single one',
        'Distinguish between overall trend and specific features (peaks, troughs, crossovers)',
      ],
      keyVocabulary: ['proportion', 'predominantly', 'trajectory', 'steepest rate of growth', 'absolute terms', 'remarkable transformations', 'fluctuated'],
    },
    {
      taskNumber: 2,
      title: 'Essay – Remote Work and Society',
      prompt: 'The increase in remote working has changed the way people live and work. What are the advantages and disadvantages of this development? Give reasons for your answer and include any relevant examples or experience. Write at least 250 words.',
      minWords: 250,
      timeMinutes: 40,
      sampleAnswer: `The shift towards remote working, dramatically accelerated by the COVID-19 pandemic, has fundamentally transformed working patterns for millions of people worldwide. While this development offers significant benefits, it also brings a number of challenges that deserve careful consideration.

The most widely cited advantage of remote work is the flexibility it provides. Employees can eliminate lengthy commutes, saving both time and money, while gaining greater control over their schedules. For many workers, particularly parents and those with disabilities, this flexibility enables a work-life balance that was previously unattainable. From an employer's perspective, remote working expands the talent pool considerably, as companies are no longer restricted to hiring within a commutable radius. Research also suggests that remote workers can be more productive due to fewer office distractions.

However, remote working also presents notable disadvantages. Many employees report feelings of isolation and a weakened sense of connection to their colleagues and company culture. Collaboration and spontaneous creativity — often sparked by informal conversations — can suffer when teams are dispersed. Furthermore, for those without adequate home office space or reliable internet connections, working from home can be more stressful than working in a traditional office. There is also growing concern about the blurring of boundaries between professional and personal life, potentially leading to longer working hours and burnout.

In conclusion, remote working represents a genuinely mixed development. While the benefits of flexibility and productivity are real, they must be weighed against the social and practical challenges. The ideal approach for most organisations is likely a hybrid model that combines the best elements of both environments.`,
      bandTips: [
        'Organise clearly: introduction → advantages → disadvantages → conclusion',
        'Support each point with a specific reason or example',
        'Use complex sentence structures with subordinate clauses',
        'Demonstrate a range of vocabulary — avoid repeating the same words',
        'Conclude with a balanced, nuanced perspective',
      ],
      keyVocabulary: ['fundamentally transformed', 'work-life balance', 'talent pool', 'spontaneous creativity', 'dispersed', 'blurring of boundaries', 'burnout', 'hybrid model'],
    },
  ],
};

// ─── ADVANCED ─────────────────────────────────────────────────────────────────
const advancedWriting: WritingTest = {
  level: 'advanced',
  bandTarget: '7.0 – 9.0',
  tasks: [
    {
      taskNumber: 1,
      title: 'Mixed Chart – Urban Population and Infrastructure Spending',
      prompt: 'The chart below shows the urban population growth and government infrastructure spending in three Asian cities between 2005 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
      graphDescription: 'Combined bar (infrastructure spending $bn) and line (population millions) chart. Singapore: population stable ~5.5-5.9M, spending rose from $8bn to $22bn. Mumbai: population 18M→22M, spending from $3bn to $9bn. Bangkok: population 10M→12M, spending from $2bn to $7bn.',
      minWords: 150,
      timeMinutes: 20,
      sampleAnswer: `The combined chart presents data on urban population growth and infrastructure investment across three Asian cities — Singapore, Mumbai, and Bangkok — over a twenty-year period from 2005 to 2025.

The most striking feature is the divergence between population size and infrastructure spending in Singapore compared to the other two cities. Despite having the smallest population of the three (approximately 5.5 million in 2005, rising marginally to 5.9 million by 2025), Singapore's infrastructure spending increased most dramatically, from $8 billion to $22 billion — a near three-fold increase. This suggests a deliberate policy of intensive capital investment in infrastructure per capita.

Mumbai, by contrast, experienced the most significant population growth, expanding from 18 million to 22 million residents, while infrastructure spending grew from $3 billion to $9 billion. Although this tripling in spending is proportionally comparable to Singapore's growth, the per-capita investment gap between the two cities widened considerably.

Bangkok's trajectory was more modest on both measures: population grew from 10 to 12 million, while spending increased from $2 to $7 billion.

Overall, Singapore's data reveals a city prioritising infrastructure quality over quantity, while Mumbai's growing population appears to have outpaced its infrastructure investment, potentially creating strain on urban services.`,
      bandTips: [
        'Identify the key relationship or trend across the data sets, not just each one separately',
        'Use hedging language where appropriate: "suggests," "appears to," "may indicate"',
        'Demonstrate analytical vocabulary beyond simple description',
        'Make comparisons between data types (population vs spending) — this is the key skill at Band 7+',
        'Avoid unsupported speculation; frame inferences clearly as interpretations',
      ],
      keyVocabulary: ['divergence', 'marginally', 'near three-fold increase', 'deliberate policy', 'per capita', 'proportionally comparable', 'widened considerably', 'outpaced', 'potential strain'],
    },
    {
      taskNumber: 2,
      title: 'Essay – Artificial Intelligence in Criminal Justice',
      prompt: 'Artificial intelligence is increasingly being used in criminal justice systems — for example, in predicting recidivism, facial recognition, and sentencing recommendations. To what extent do you think this development is positive? Give reasons for your answer and include any relevant examples from your knowledge or experience. Write at least 250 words.',
      minWords: 250,
      timeMinutes: 40,
      sampleAnswer: `The deployment of artificial intelligence in criminal justice represents one of the most contentious intersections of technology and governance in contemporary society. While proponents argue that AI can introduce objectivity and efficiency into a system historically plagued by human bias, a critical examination reveals significant risks that outweigh the purported benefits.

Those who advocate for AI in this domain point to the promise of consistency. Algorithms, in theory, apply the same criteria uniformly to every case, eliminating the individual prejudices that have historically disadvantaged racial minorities and those from lower socioeconomic backgrounds. The COMPAS recidivism prediction tool used in parts of the United States, for instance, was designed to standardise risk assessment for parole decisions.

However, empirical analysis — most notably by ProPublica in 2016 — demonstrated that COMPAS produced racially biased outcomes, incorrectly flagging Black defendants as high-risk at nearly twice the rate of white defendants. This example illustrates a fundamental flaw in AI-based justice systems: algorithms trained on historical data reproduce and potentially amplify existing systemic biases rather than correcting them.

There are also profound concerns about transparency and accountability. Criminal defendants have a right to understand the basis on which they are judged; yet many AI systems are proprietary "black boxes" whose reasoning cannot be scrutinised even by the courts. This opacity is fundamentally incompatible with principles of due process and judicial fairness.

Furthermore, facial recognition technology — used in several jurisdictions for suspect identification — has demonstrated significantly higher error rates for darker-skinned individuals, raising serious concerns about wrongful prosecution.

In conclusion, while AI may offer marginal efficiencies, its current deployment in criminal justice systems risks entrenching rather than rectifying systemic injustice. I would argue that until these tools can be made fully transparent, auditable, and demonstrably free from discriminatory impact, their use in consequential judicial decisions should be suspended.`,
      bandTips: [
        'Develop a clear, consistent position rather than presenting equal sides without commitment',
        'Use specific, named examples to support arguments (COMPAS, ProPublica study)',
        'Employ sophisticated cohesion: not just linking words, but logical connections between ideas',
        'Vary sentence structure — short emphatic sentences alongside complex ones for rhetorical effect',
        'Conclude with a position that goes beyond "it depends" — show intellectual confidence',
        'Engage critically with the counterargument rather than simply presenting it',
      ],
      keyVocabulary: ['contentious intersection', 'purported benefits', 'uniformly', 'recidivism', 'systemic biases', 'proprietary black box', 'opacity', 'due process', 'entrenching injustice', 'discriminatory impact'],
    },
  ],
};

export const writingTests: Record<string, WritingTest> = {
  beginner: beginnerWriting,
  intermediate: intermediateWriting,
  advanced: advancedWriting,
};
