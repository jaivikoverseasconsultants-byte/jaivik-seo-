export interface MCQQuestion {
  id: number; type: 'mcq';
  text: string;
  options: { key: string; label: string }[];
  answer: string;
}
export interface TFNGQuestion {
  id: number; type: 'tfng';
  statement: string;
  answer: 'TRUE' | 'FALSE' | 'NOT GIVEN';
}
export interface FillQuestion {
  id: number; type: 'fill';
  prompt: string; // sentence with ___ for the blank
  answer: string; // lowercase expected answer
}
export type Question = MCQQuestion | TFNGQuestion | FillQuestion;

export interface Passage {
  id: number;
  title: string;
  paragraphs: string[];
  questions: Question[];
}

export const passages: Passage[] = [
  // ────────────────────────────────────────────────────────────────
  // PASSAGE 1: The Science of Sleep  (Q 1–13)
  // ────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'The Science of Sleep',
    paragraphs: [
      'Sleep is one of the most fundamental biological processes, yet scientists are still uncovering the complex mechanisms that govern it. The human body operates on a roughly 24-hour cycle known as the circadian rhythm, which is regulated by an internal clock located in the suprachiasmatic nucleus (SCN) of the hypothalamus. This biological timepiece responds primarily to light and darkness, signalling the brain to release melatonin—a hormone that induces drowsiness—as evening approaches.',
      'During sleep, the brain cycles through two main phases: rapid eye movement (REM) sleep and non-REM sleep. Non-REM sleep itself consists of three stages, ranging from light sleep to deep, slow-wave sleep. A complete sleep cycle typically lasts about 90 minutes, and adults generally experience four to six such cycles per night. The first half of the night is dominated by deep non-REM sleep, while REM sleep becomes more prominent in the latter half.',
      'REM sleep is particularly significant for cognitive functions. Research conducted at Harvard Medical School demonstrated that REM sleep plays a crucial role in memory consolidation—the process by which short-term memories are transferred to long-term storage. During this phase, the brain replays experiences from the day, strengthening neural connections associated with learning.',
      'Chronic sleep deprivation has far-reaching consequences. Studies have shown that sleeping fewer than six hours per night increases the risk of obesity by 23%, hypertension by 48%, and heart disease by 67%. Furthermore, cognitive performance deteriorates rapidly: after 17 hours without sleep, reaction times are comparable to those of someone with a blood alcohol level of 0.05%.',
      'Interestingly, the amount of sleep required varies by age. Newborns need 14–17 hours daily, teenagers require 8–10 hours, while adults typically function optimally on 7–9 hours. However, a small percentage of the population—estimated at less than 3%—carry a genetic variant that allows them to function normally on just six hours of sleep.',
      'Despite its critical importance, more than one-third of adults in developed nations regularly fail to obtain sufficient sleep, a trend that has worsened significantly since the proliferation of smartphones and artificial lighting.',
    ],
    questions: [
      // MCQ 1-4
      { id: 1, type: 'mcq', text: 'According to the passage, what primarily regulates the human circadian rhythm?',
        options: [{ key: 'A', label: 'Exercise patterns' }, { key: 'B', label: 'Light and darkness' }, { key: 'C', label: 'Melatonin levels in the bloodstream' }, { key: 'D', label: 'Core body temperature' }], answer: 'B' },
      { id: 2, type: 'mcq', text: 'How long does a complete sleep cycle typically last?',
        options: [{ key: 'A', label: '60 minutes' }, { key: 'B', label: '75 minutes' }, { key: 'C', label: '90 minutes' }, { key: 'D', label: '120 minutes' }], answer: 'C' },
      { id: 3, type: 'mcq', text: 'What did research at Harvard Medical School show about REM sleep?',
        options: [{ key: 'A', label: 'It improves physical recovery after exercise' }, { key: 'B', label: 'It plays a crucial role in memory consolidation' }, { key: 'C', label: 'It reduces the need for deep non-REM sleep' }, { key: 'D', label: 'It increases melatonin production' }], answer: 'B' },
      { id: 4, type: 'mcq', text: 'What fraction of adults in developed nations regularly fail to get sufficient sleep?',
        options: [{ key: 'A', label: 'More than one-quarter' }, { key: 'B', label: 'More than one-third' }, { key: 'C', label: 'Almost half' }, { key: 'D', label: 'More than two-thirds' }], answer: 'B' },
      // True/False/Not Given 5-9
      { id: 5, type: 'tfng', statement: 'The suprachiasmatic nucleus is located in the prefrontal cortex.', answer: 'FALSE' },
      { id: 6, type: 'tfng', statement: 'Deep non-REM sleep is more common in the first half of the night.', answer: 'TRUE' },
      { id: 7, type: 'tfng', statement: 'REM sleep during childhood is more beneficial than REM sleep during adulthood.', answer: 'NOT GIVEN' },
      { id: 8, type: 'tfng', statement: 'Sleeping fewer than six hours per night increases the risk of heart disease by 67%.', answer: 'TRUE' },
      { id: 9, type: 'tfng', statement: 'Less than 3% of people carry a genetic variant allowing them to function on six hours of sleep.', answer: 'TRUE' },
      // Fill in blank 10-13
      { id: 10, type: 'fill', prompt: 'The human body runs on a 24-hour cycle called the ___ rhythm.', answer: 'circadian' },
      { id: 11, type: 'fill', prompt: 'During sleep, the brain alternates between REM and ___ sleep.', answer: 'non-rem' },
      { id: 12, type: 'fill', prompt: 'Research shows REM sleep plays a crucial role in ___ consolidation.', answer: 'memory' },
      { id: 13, type: 'fill', prompt: 'After 17 hours without sleep, reaction times match someone with a blood alcohol level of ___.', answer: '0.05%' },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // PASSAGE 2: The E-Learning Revolution  (Q 14–27)
  // ────────────────────────────────────────────────────────────────
  {
    id: 2,
    title: 'The E-Learning Revolution',
    paragraphs: [
      'The COVID-19 pandemic accelerated a transformation that was already underway in global education: the shift from traditional classroom-based learning to digital, online instruction. Between 2019 and 2021, global e-learning market revenue grew from $101 billion to an estimated $198 billion—nearly doubling in just two years. Analysts at Global Market Insights project that this sector will reach $1 trillion by 2028.',
      'The advantages of e-learning are numerous and compelling. Geographical barriers that once prevented students in rural or developing regions from accessing quality education have been largely dismantled. A student in a remote village in India can now attend lectures delivered by professors at Stanford or Oxford, provided they have internet connectivity. This democratisation of knowledge represents perhaps the most significant educational shift since the invention of the printing press.',
      'Cost reduction is another significant benefit. Traditional universities carry enormous overhead costs—physical infrastructure, administrative staff, utilities—which are passed on to students in the form of tuition fees. Online institutions and courses can operate at a fraction of the cost, making higher education accessible to students from lower-income backgrounds. Platforms like Coursera and edX partner with leading universities to offer verified certificates for as little as $50, compared to thousands of dollars for traditional equivalents.',
      'However, e-learning is not without its challenges. Research from the Stanford Centre for Education Policy Analysis found that students in online courses were 11% more likely to drop out than their peers in traditional settings. The absence of face-to-face interaction, peer accountability, and structured scheduling can be significant hurdles for students who lack strong self-motivation.',
      'Digital equity remains a pressing concern. Approximately 2.9 billion people worldwide still lack reliable internet access, and many who do have access are limited to slow mobile connections inadequate for video streaming. The pandemic starkly illustrated this divide: while students in wealthier households transitioned seamlessly to online learning, those in lower-income families struggled with inadequate devices and connectivity.',
      'Despite these challenges, hybrid models that combine online and in-person instruction are increasingly recognised as the most effective approach. Studies indicate that hybrid learning can improve student performance by up to 20% compared to purely traditional instruction, while retaining the flexibility that modern students increasingly demand.',
    ],
    questions: [
      // MCQ 14-17
      { id: 14, type: 'mcq', text: 'What happened to the global e-learning market between 2019 and 2021?',
        options: [{ key: 'A', label: 'It grew by 25%' }, { key: 'B', label: 'It tripled in size' }, { key: 'C', label: 'It nearly doubled' }, { key: 'D', label: 'It grew by exactly $50 billion' }], answer: 'C' },
      { id: 15, type: 'mcq', text: 'Which advantage of e-learning is highlighted in the second paragraph?',
        options: [{ key: 'A', label: 'Higher graduation rates than traditional universities' }, { key: 'B', label: 'Elimination of internet dependency' }, { key: 'C', label: 'Reduction of geographical barriers to education' }, { key: 'D', label: 'Increased student motivation' }], answer: 'C' },
      { id: 16, type: 'mcq', text: 'What did Stanford research find about online course dropout rates?',
        options: [{ key: 'A', label: 'Students were 5% more likely to drop out' }, { key: 'B', label: 'Students were 11% more likely to drop out' }, { key: 'C', label: 'Students were 20% more likely to drop out' }, { key: 'D', label: 'No significant difference was found' }], answer: 'B' },
      { id: 17, type: 'mcq', text: 'How much can verified certificates from platforms like Coursera cost?',
        options: [{ key: 'A', label: 'Free of charge' }, { key: 'B', label: 'Around $25' }, { key: 'C', label: 'As little as $50' }, { key: 'D', label: 'Approximately $200' }], answer: 'C' },
      // True/False/Not Given 18-22
      { id: 18, type: 'tfng', statement: 'The global e-learning market is projected to reach $1 trillion by 2028.', answer: 'TRUE' },
      { id: 19, type: 'tfng', statement: 'E-learning is compared to the invention of the printing press in its educational significance.', answer: 'TRUE' },
      { id: 20, type: 'tfng', statement: 'Students who study online are more likely to secure employment than those who study in traditional settings.', answer: 'NOT GIVEN' },
      { id: 21, type: 'tfng', statement: 'Approximately 2.9 billion people worldwide lack reliable internet access.', answer: 'TRUE' },
      { id: 22, type: 'tfng', statement: 'Hybrid learning can improve student performance by up to 30% compared to traditional instruction.', answer: 'FALSE' },
      // Fill in blank 23-27
      { id: 23, type: 'fill', prompt: 'By 2021, the global e-learning market had grown to $___ billion.', answer: '198' },
      { id: 24, type: 'fill', prompt: '___ barriers that prevented access to quality education have been largely dismantled by e-learning.', answer: 'geographical' },
      { id: 25, type: 'fill', prompt: 'Online learners were found to be ___% more likely to drop out than traditional students.', answer: '11' },
      { id: 26, type: 'fill', prompt: 'Key challenges include the absence of face-to-face ___ and peer accountability.', answer: 'interaction' },
      { id: 27, type: 'fill', prompt: 'Studies increasingly support ___ learning as the most effective modern instructional model.', answer: 'hybrid' },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // PASSAGE 3: The Renewable Energy Transition  (Q 28–40)
  // ────────────────────────────────────────────────────────────────
  {
    id: 3,
    title: 'The Renewable Energy Transition',
    paragraphs: [
      'The global transition from fossil fuels to renewable energy sources represents one of the most complex and consequential economic shifts in human history. Solar photovoltaic (PV) technology, once prohibitively expensive, has experienced a cost reduction of 89% between 2010 and 2020, according to the International Renewable Energy Agency (IRENA). Wind energy costs fell by 70% over the same period, making both technologies now cheaper than new coal or gas-fired power plants in most regions of the world.',
      'The economic implications are profound. The renewable energy sector employed 11.5 million people globally in 2019, a figure projected to reach 42 million by 2050 if climate targets are met. However, this transition necessarily involves the decline of the fossil fuel industry, which currently employs millions of workers in coal mines, oil refineries, and gas processing facilities. Managing this "just transition"—ensuring that affected communities are supported rather than abandoned—has become a central challenge for policymakers.',
      'Government policy has played an instrumental role in accelerating the renewable transition. Germany\'s Energiewende policy, launched in 2000, set ambitious targets for reducing greenhouse gas emissions and expanding renewable capacity. By 2020, renewables accounted for 45% of Germany\'s electricity generation, up from just 6% in 2000. Similarly, China has become the world\'s largest producer of both solar panels and wind turbines, driven by strategic government investment and export incentives.',
      'Despite impressive progress, significant obstacles remain. The intermittency of solar and wind power—the fact that the sun does not always shine and the wind does not always blow—creates challenges for grid stability. Current battery storage technologies, while improving rapidly, cannot yet provide cost-effective solutions for storing energy over periods of weeks or months. This limitation is particularly significant for regions with distinct seasonal weather patterns.',
      'The mineral supply chain presents another complication. Lithium, cobalt, and rare earth elements essential for batteries and wind turbines are concentrated in a small number of countries. The Democratic Republic of Congo produces approximately 70% of the world\'s cobalt, while China controls 60% of rare earth element processing. This concentration creates potential supply chain vulnerabilities and raises ethical concerns regarding mining conditions in some producing regions.',
      'Investment trends, however, suggest that momentum is firmly on the side of renewable energy. Global investment in clean energy reached $500 billion in 2020, compared to $350 billion for fossil fuels—marking the first time in history that clean energy investment exceeded fossil fuel investment in a single year.',
    ],
    questions: [
      // MCQ 28-31
      { id: 28, type: 'mcq', text: 'By how much did solar PV technology costs fall between 2010 and 2020?',
        options: [{ key: 'A', label: '70%' }, { key: 'B', label: '79%' }, { key: 'C', label: '89%' }, { key: 'D', label: '99%' }], answer: 'C' },
      { id: 29, type: 'mcq', text: 'How many people did the renewable energy sector employ globally in 2019?',
        options: [{ key: 'A', label: '5.5 million' }, { key: 'B', label: '8.3 million' }, { key: 'C', label: '11.5 million' }, { key: 'D', label: '42 million' }], answer: 'C' },
      { id: 30, type: 'mcq', text: 'What percentage of Germany\'s electricity came from renewables by 2020?',
        options: [{ key: 'A', label: '6%' }, { key: 'B', label: '25%' }, { key: 'C', label: '35%' }, { key: 'D', label: '45%' }], answer: 'D' },
      { id: 31, type: 'mcq', text: 'What major challenge for grid stability is mentioned in the passage?',
        options: [{ key: 'A', label: 'High installation costs' }, { key: 'B', label: 'Lack of government support' }, { key: 'C', label: 'Intermittency of solar and wind power' }, { key: 'D', label: 'Shortage of skilled workers' }], answer: 'C' },
      // True/False/Not Given 32-36
      { id: 32, type: 'tfng', statement: 'Wind energy costs fell by 70% between 2010 and 2020.', answer: 'TRUE' },
      { id: 33, type: 'tfng', statement: 'Germany\'s Energiewende policy was launched in 2000.', answer: 'TRUE' },
      { id: 34, type: 'tfng', statement: 'Current battery storage technologies can store energy cost-effectively for several months.', answer: 'FALSE' },
      { id: 35, type: 'tfng', statement: 'The Democratic Republic of Congo produces approximately 70% of the world\'s cobalt.', answer: 'TRUE' },
      { id: 36, type: 'tfng', statement: 'Global clean energy investment exceeded fossil fuel investment for the first time in 2020.', answer: 'TRUE' },
      // Fill in blank 37-40
      { id: 37, type: 'fill', prompt: 'The renewable energy sector is projected to employ ___ million people by 2050 if climate targets are met.', answer: '42' },
      { id: 38, type: 'fill', prompt: 'Ensuring affected workers are supported through the shift away from fossil fuels is called the "___ transition".', answer: 'just' },
      { id: 39, type: 'fill', prompt: 'China controls 60% of ___ element processing, creating supply chain concerns.', answer: 'rare earth' },
      { id: 40, type: 'fill', prompt: 'In 2020, global investment in clean energy reached $___ billion, exceeding fossil fuel investment for the first time.', answer: '500' },
    ],
  },
];

// Band score conversion table (reading raw → band)
export function rawToReadingBand(raw: number): number {
  if (raw >= 39) return 9.0;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8.0;
  if (raw >= 33) return 7.5;
  if (raw >= 30) return 7.0;
  if (raw >= 27) return 6.5;
  if (raw >= 23) return 6.0;
  if (raw >= 19) return 5.5;
  if (raw >= 15) return 5.0;
  if (raw >= 13) return 4.5;
  if (raw >= 10) return 4.0;
  if (raw >= 6)  return 3.5;
  return 3.0;
}

export function calcWritingBand(t1: number, t2: number): number {
  // Task 2 is weighted double
  const raw = (t1 + t2 * 2) / 3;
  return Math.round(raw * 2) / 2; // round to nearest 0.5
}

export function calcOverallBand(reading: number, writing: number): number {
  const avg = (reading + writing) / 2;
  return Math.round(avg * 2) / 2;
}

export function estimateBandFromText(text: string, minWords: number): number {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (words < 50) return 3.0;
  if (words < 100) return 4.0;
  if (words < minWords * 0.7) return 5.0;
  if (words < minWords) return 5.5;
  if (words < minWords * 1.3) return 6.0;
  if (words < minWords * 1.8) return 6.5;
  return 7.0;
}
