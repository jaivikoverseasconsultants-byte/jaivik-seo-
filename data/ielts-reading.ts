export type QuestionType = 'mcq' | 'tfng' | 'fill';

export interface IELTSQuestion {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  answer: string;
  alternatives?: string[];
  explanation?: string;
}

export interface ReadingPassage {
  id: number;
  title: string;
  text: string;
  questions: IELTSQuestion[];
}

export interface ReadingTest {
  level: string;
  timeMinutes: number;
  bandTarget: string;
  passages: ReadingPassage[];
}

// ─── BAND CALCULATOR ─────────────────────────────────────────────────────────
export function calcReadingBand(score: number): string {
  if (score >= 39) return '9.0';
  if (score >= 37) return '8.5';
  if (score >= 35) return '8.0';
  if (score >= 33) return '7.5';
  if (score >= 30) return '7.0';
  if (score >= 27) return '6.5';
  if (score >= 23) return '6.0';
  if (score >= 19) return '5.5';
  if (score >= 15) return '5.0';
  if (score >= 13) return '4.5';
  if (score >= 10) return '4.0';
  if (score >= 8)  return '3.5';
  return '3.0';
}

// ─── BEGINNER ─────────────────────────────────────────────────────────────────
export const beginnerReading: ReadingTest = {
  level: 'beginner',
  timeMinutes: 60,
  bandTarget: '4.0 – 5.5',
  passages: [
    {
      id: 1,
      title: 'Passage 1 – Community Libraries',
      text: `Public libraries have been serving communities since the 19th century, when they were first established to help educate ordinary people. In those early days, access to books was limited to the wealthy, but libraries made reading available to everyone.

Today, public libraries offer far more than books. Most provide free internet access and computers, helping people who do not own these devices at home. Many libraries also run children's story sessions, adult learning classes, and talks by local authors.

Membership is completely free. Any resident of the local area can register by presenting proof of their home address. Once registered, members may borrow up to eight items at a time, including books, magazines, and DVDs. The standard loan period is three weeks, but items can be renewed if no other member has requested them.

Despite their popularity, libraries face serious financial pressure. Many local councils have reduced library budgets, leading to shorter opening hours. Some smaller libraries, especially in villages, have closed entirely. Library supporters argue that these closures harm the communities most in need of services.

Qualified librarians help visitors search for information, find relevant books, and use online databases. Many also run one-to-one sessions to help elderly visitors use computers. In recent years, libraries have started offering e-books and digital audiobooks, which members can borrow remotely using a smartphone app.`,
      questions: [
        { id: 1,  type: 'tfng', question: 'Public libraries first appeared in the 19th century.', answer: 'True' },
        { id: 2,  type: 'tfng', question: 'Early libraries were freely available to all members of society.', answer: 'False', explanation: 'Access was limited to the wealthy.' },
        { id: 3,  type: 'tfng', question: 'Libraries charge a small fee for internet use.', answer: 'False', explanation: 'Internet access is free.' },
        { id: 4,  type: 'tfng', question: 'Members must pay to borrow DVDs.', answer: 'False' },
        { id: 5,  type: 'tfng', question: 'All citizens of a country can join any library branch.', answer: 'Not Given', explanation: 'Text only mentions local area residents.' },
        { id: 6,  type: 'tfng', question: 'The standard loan period is three weeks.', answer: 'True' },
        { id: 7,  type: 'tfng', question: 'Members can renew items if no one else has reserved them.', answer: 'True' },
        { id: 8,  type: 'tfng', question: 'Library budgets have been increased by local councils.', answer: 'False' },
        { id: 9,  type: 'tfng', question: 'All village libraries have been closed due to budget cuts.', answer: 'False', explanation: 'Text says "some smaller libraries."' },
        { id: 10, type: 'tfng', question: 'Librarians help elderly visitors use computers.', answer: 'True' },
        { id: 11, type: 'tfng', question: 'Libraries now offer e-books and digital audiobooks.', answer: 'True' },
        { id: 12, type: 'tfng', question: 'E-books can be borrowed using a smartphone app.', answer: 'True' },
        { id: 13, type: 'tfng', question: 'Libraries also lend musical instruments.', answer: 'Not Given' },
      ],
    },
    {
      id: 2,
      title: 'Passage 2 – Sleep and Health',
      text: `Sleep is essential for good health. During sleep, the body repairs damaged cells, strengthens the immune system, and processes information gathered during the day. Most adults need between seven and nine hours of sleep each night to function properly.

However, many people in modern societies do not get enough sleep. Studies suggest that around one third of adults regularly experience poor sleep quality. The reasons include long working hours, excessive screen time before bed, stress, and irregular sleep schedules. These factors disrupt the body's natural sleep rhythms.

Lack of sleep has serious consequences for health and performance. People who are sleep-deprived are more likely to make mistakes at work, have accidents while driving, and suffer from low mood. Chronic sleep deprivation has also been linked to an increased risk of obesity, diabetes, heart disease, and depression.

Sleep experts recommend several strategies to improve sleep quality. These include going to bed at the same time every night, avoiding caffeine after midday, keeping the bedroom dark and cool, and reducing screen time in the hour before sleep. Exercise also improves sleep quality, though vigorous activity immediately before bedtime may have the opposite effect.

Children and teenagers need more sleep than adults. Teenagers require approximately nine hours of sleep per night to support their growing bodies and developing brains. Schools that have introduced later start times have reported improvements in student concentration and academic performance.`,
      questions: [
        { id: 14, type: 'mcq', question: 'According to the passage, during sleep the body:', options: ['Produces new bone tissue', 'Repairs damaged cells', 'Increases blood pressure', 'Reduces heart rate'], answer: 'Repairs damaged cells' },
        { id: 15, type: 'mcq', question: 'What proportion of adults regularly experience poor sleep?', options: ['Around half', 'More than half', 'Around one third', 'Around one quarter'], answer: 'Around one third' },
        { id: 16, type: 'mcq', question: 'Which of the following is NOT mentioned as a cause of poor sleep?', options: ['Long working hours', 'Stress', 'Eating late at night', 'Excessive screen time'], answer: 'Eating late at night' },
        { id: 17, type: 'mcq', question: 'What does the passage say about sleep deprivation and driving?', options: ['Sleep-deprived people drive more slowly', 'Sleep-deprived people are more likely to have accidents', 'Sleep deprivation improves reaction times', 'Most road accidents are caused by tired drivers'], answer: 'Sleep-deprived people are more likely to have accidents' },
        { id: 18, type: 'mcq', question: 'Which health condition is NOT mentioned as a risk of chronic sleep deprivation?', options: ['Obesity', 'Heart disease', 'Arthritis', 'Depression'], answer: 'Arthritis' },
        { id: 19, type: 'mcq', question: 'What do sleep experts recommend about caffeine?', options: ['Avoid it completely', 'Avoid it after midday', 'Replace it with herbal tea', 'Limit it to two cups daily'], answer: 'Avoid it after midday' },
        { id: 20, type: 'mcq', question: 'According to the passage, what effect does vigorous exercise before bed have?', options: ['Always improves sleep', 'Has no effect on sleep', 'May worsen sleep quality', 'Reduces stress only'], answer: 'May worsen sleep quality' },
        { id: 21, type: 'mcq', question: 'How many hours of sleep do teenagers need per night?', options: ['Seven hours', 'Eight hours', 'Nine hours', 'Ten hours'], answer: 'Nine hours' },
        { id: 22, type: 'mcq', question: 'What happened in schools that introduced later start times?', options: ['Students arrived late more often', 'Academic performance improved', 'Teachers reported more absences', 'Sleep problems increased'], answer: 'Academic performance improved' },
        { id: 23, type: 'mcq', question: 'What is the recommended bedroom environment for good sleep?', options: ['Warm and bright', 'Cool and quiet', 'Dark and cool', 'Warm and dark'], answer: 'Dark and cool' },
        { id: 24, type: 'mcq', question: 'Most adults need how many hours of sleep?', options: ['Six to eight hours', 'Seven to nine hours', 'Eight to ten hours', 'Seven to eight hours'], answer: 'Seven to nine hours' },
        { id: 25, type: 'mcq', question: 'What is the main idea of this passage?', options: ['Teenagers are most affected by sleep problems', 'Sleep deprivation is a serious health issue', 'Exercise is the best way to improve sleep', 'Work stress is the biggest cause of sleep problems'], answer: 'Sleep deprivation is a serious health issue' },
        { id: 26, type: 'mcq', question: 'Which group needs the most sleep according to the passage?', options: ['Adults', 'Elderly people', 'Children and teenagers', 'People who exercise'], answer: 'Children and teenagers' },
      ],
    },
    {
      id: 3,
      title: 'Passage 3 – Cycling in Cities',
      text: `In recent years, many cities around the world have invested heavily in cycling infrastructure to reduce traffic congestion and carbon emissions. Cities such as Amsterdam, Copenhagen, and Bogotá have become models for successful cycling integration, demonstrating that bicycles can serve as a primary mode of urban transport.

Dedicated cycle lanes separated from car traffic are considered the most effective way to encourage cycling. Research shows that people are far more likely to cycle when they feel safe from motorised vehicles. In contrast, painted cycle lanes on busy roads offer little protection and have minimal effect on cycling rates.

The environmental benefits of cycling are significant. Bicycles produce zero direct carbon emissions and require far less energy to manufacture than cars. If just ten percent of car journeys in a city were replaced by cycling, it is estimated that carbon dioxide emissions could be reduced by eleven percent.

Cycling also offers important health benefits. Regular cyclists have lower rates of heart disease, obesity, and some types of cancer compared to non-cyclists. One study found that people who cycle to work are 45 percent less likely to develop cancer than those who drive. Additionally, cycling reduces stress and improves mental health.

Despite these advantages, many cities face barriers to increasing cycling rates. These include a lack of safe infrastructure, concerns about weather, fear of theft, and cultural attitudes that associate cycling with low social status. Governments can address these barriers by investing in secure bicycle parking, providing subsidies for bicycle purchases, and running public awareness campaigns.

Some cities have introduced public bicycle hire schemes, allowing residents and visitors to rent bicycles cheaply for short journeys. These schemes have proved popular in cities such as London, Paris, and New York. However, critics argue that public bikes are often left in poor condition and that not enough docking stations are available.`,
      questions: [
        { id: 27, type: 'mcq', question: 'Which cities are described as successful models for cycling?', options: ['London, Paris, and New York', 'Amsterdam, Copenhagen, and Bogotá', 'Tokyo, Beijing, and Seoul', 'Berlin, Vienna, and Stockholm'], answer: 'Amsterdam, Copenhagen, and Bogotá' },
        { id: 28, type: 'mcq', question: 'What is the most effective way to encourage cycling?', options: ['Painted cycle lanes on roads', 'Bicycle subsidies', 'Dedicated lanes separated from car traffic', 'Public hire schemes'], answer: 'Dedicated lanes separated from car traffic' },
        { id: 29, type: 'mcq', question: 'By what percentage could CO₂ emissions fall if 10% of car journeys became cycling trips?', options: ['10%', '11%', '45%', '15%'], answer: '11%' },
        { id: 30, type: 'mcq', question: 'How much less likely are regular cyclists to develop cancer than drivers?', options: ['25% less likely', '35% less likely', '45% less likely', '55% less likely'], answer: '45% less likely' },
        { id: 31, type: 'mcq', question: 'Which is NOT mentioned as a barrier to cycling?', options: ['Lack of safe infrastructure', 'Fear of theft', 'High cost of bicycles', 'Cultural attitudes'], answer: 'High cost of bicycles' },
        { id: 32, type: 'mcq', question: 'What criticism of public bicycle hire schemes is mentioned?', options: ['They are too expensive', 'Not enough docking stations are available', 'They are only used by tourists', 'They increase traffic congestion'], answer: 'Not enough docking stations are available' },
        { id: 33, type: 'mcq', question: 'What is the main purpose of this passage?', options: ['To argue that cars should be banned', 'To explain the benefits and challenges of city cycling', 'To compare European and South American cities', 'To promote public bicycle hire schemes'], answer: 'To explain the benefits and challenges of city cycling' },
        { id: 34, type: 'fill', question: 'Cycling produces _______ direct carbon emissions.', answer: 'zero' },
        { id: 35, type: 'fill', question: 'If 10% of car journeys became cycling trips, CO₂ emissions could fall by _______ percent.', answer: 'eleven', alternatives: ['11'] },
        { id: 36, type: 'fill', question: 'Regular cyclists have lower rates of _______ disease compared to non-cyclists.', answer: 'heart' },
        { id: 37, type: 'fill', question: 'Cycling also lowers rates of _______ and some types of cancer.', answer: 'obesity' },
        { id: 38, type: 'fill', question: 'The most effective cycling infrastructure is _______ cycle lanes separated from traffic.', answer: 'dedicated' },
        { id: 39, type: 'fill', question: 'Cities can encourage cycling by investing in secure _______ parking.', answer: 'bicycle' },
        { id: 40, type: 'fill', question: 'Governments can run public _______ campaigns to boost cycling.', answer: 'awareness' },
      ],
    },
  ],
};

// ─── INTERMEDIATE ─────────────────────────────────────────────────────────────
export const intermediateReading: ReadingTest = {
  level: 'intermediate',
  timeMinutes: 60,
  bandTarget: '5.5 – 7.0',
  passages: [
    {
      id: 1,
      title: 'Passage 1 – The Digital Divide',
      text: `The digital divide refers to the gap between individuals and communities that have access to modern information and communication technologies, and those that do not. As digital tools become increasingly central to education, employment, and civic participation, this divide has emerged as a significant social issue.

Access to the internet varies dramatically between and within countries. In high-income nations, internet penetration typically exceeds 90%, while in many lower-income countries, fewer than 30% of the population has reliable connectivity. Within developed countries, disparities also exist along lines of age, income, education level, and geography. Rural communities and elderly populations are consistently identified as being most disadvantaged.

The consequences of the digital divide extend beyond mere inconvenience. Children without home internet access are at a significant educational disadvantage, unable to complete online homework assignments or access educational resources outside school hours. Adults who lack digital skills face growing barriers to employment, as an increasing proportion of jobs require basic computing competencies. Government services, too, are increasingly delivered online, making it harder for digitally excluded citizens to access welfare payments, healthcare information, and voting registration.

Various initiatives have been proposed to bridge the digital divide. Governments in several countries have subsidised broadband connections for low-income households and distributed refurbished computers to schools in underserved areas. Non-profit organisations run digital literacy programmes targeted at the elderly and unemployed. Some technology companies have committed to providing free internet access in developing regions through satellite technology.

However, access alone does not resolve digital inequality. Research shows that even when devices and connectivity are available, disparities in digital literacy persist. People with lower education levels may have the physical tools but lack the skills to use them productively. This has led some researchers to argue that investment in digital education is as important as investment in infrastructure.

Critics of existing initiatives argue that efforts tend to be fragmented and underfunded. A comprehensive approach to digital inclusion would require coordinated policy across education, telecommunications, and social welfare sectors. Without such coordination, the digital divide is likely to widen further as technology continues to advance.`,
      questions: [
        { id: 1,  type: 'tfng', question: 'Internet penetration in high-income countries typically exceeds 90%.', answer: 'True' },
        { id: 2,  type: 'tfng', question: 'In lower-income countries, fewer than 30% have reliable internet connectivity.', answer: 'True' },
        { id: 3,  type: 'tfng', question: 'Young people in rural areas are the most disadvantaged group.', answer: 'False', explanation: 'Rural communities and elderly populations are identified.' },
        { id: 4,  type: 'tfng', question: 'Children without home internet cannot complete online homework.', answer: 'True' },
        { id: 5,  type: 'tfng', question: 'The majority of new jobs now require advanced coding skills.', answer: 'Not Given', explanation: 'Text mentions basic computing competencies, not advanced coding.' },
        { id: 6,  type: 'tfng', question: 'Government services are increasingly delivered online.', answer: 'True' },
        { id: 7,  type: 'tfng', question: 'Some governments have subsidised broadband for low-income households.', answer: 'True' },
        { id: 8,  type: 'tfng', question: 'All major technology companies have committed to providing free internet in developing regions.', answer: 'False', explanation: 'Text says "some technology companies."' },
        { id: 9,  type: 'tfng', question: 'Digital literacy means the ability to use technology effectively and critically.', answer: 'True' },
        { id: 10, type: 'tfng', question: 'People with lower education levels always lack access to devices.', answer: 'False', explanation: 'They may have the physical tools but lack skills.' },
        { id: 11, type: 'tfng', question: 'Critics believe current initiatives are well-funded but poorly organised.', answer: 'False', explanation: 'The text says fragmented AND underfunded.' },
        { id: 12, type: 'tfng', question: 'Without policy coordination, the digital divide is likely to narrow.', answer: 'False', explanation: 'Text says it is likely to widen.' },
        { id: 13, type: 'tfng', question: 'The passage argues that infrastructure investment is more important than digital education.', answer: 'False', explanation: 'Text says they are equally important.' },
      ],
    },
    {
      id: 2,
      title: 'Passage 2 – The Circular Economy',
      text: `The circular economy is an alternative economic model to the traditional linear system of "take, make, dispose". In a linear economy, raw materials are extracted, used to manufacture products, and then discarded as waste. By contrast, a circular economy aims to keep resources in use for as long as possible, extracting maximum value before recovering and regenerating materials at the end of their service life.

The concept is inspired partly by natural systems, where waste from one organism becomes input for another. Proponents argue that shifting to circular principles could deliver significant economic benefits in addition to environmental ones. A report by the Ellen MacArthur Foundation estimated that the European Union alone could generate €1.8 trillion in economic benefits by 2030 through the adoption of circular economy principles.

Several strategies are central to the circular economy model. Product design plays a crucial role: goods should be designed to be durable, repairable, and ultimately recyclable. This contrasts with "planned obsolescence" practised by many manufacturers, who deliberately design products to become outdated or fail within a set period. Leasing and product-as-a-service models are another key strategy, in which customers pay for the use of products rather than owning them outright, giving companies an incentive to maintain and recover products.

Industrial symbiosis—where waste from one company becomes a resource for another—provides another dimension of circularity. The Kalundborg industrial park in Denmark is often cited as a pioneering example, where companies exchange steam, fly ash, and other by-products in a network that reduces waste and energy consumption.

Critics argue that the circular economy model faces significant obstacles in practice. Many products are designed in ways that make disassembly and recycling technically difficult or economically unviable. Global supply chains add further complexity, as products may contain components manufactured in dozens of different countries. Consumer behaviour also presents a challenge: sustainable products frequently cost more, and consumers often lack the incentive or awareness to choose them.

Despite these challenges, circular economy principles are gaining traction in policy circles. The European Union's Circular Economy Action Plan, launched in 2020, sets ambitious targets for sustainable product design, waste reduction, and recycling across all major industry sectors. China and several Asian economies have also introduced national circular economy frameworks.`,
      questions: [
        { id: 14, type: 'mcq', question: 'What does a "linear economy" involve?', options: ['Making products last as long as possible', 'Extracting, manufacturing, and discarding materials', 'Sharing resources between companies', 'Designing products for easy repair'], answer: 'Extracting, manufacturing, and discarding materials' },
        { id: 15, type: 'mcq', question: 'What is the circular economy partly inspired by?', options: ['Industrial manufacturing systems', 'Natural systems where waste becomes input', 'European agricultural practices', 'Asian economic models'], answer: 'Natural systems where waste becomes input' },
        { id: 16, type: 'mcq', question: 'According to the Ellen MacArthur Foundation, how much could the EU gain by 2030?', options: ['€1.8 billion', '€18 billion', '€1.8 trillion', '€180 billion'], answer: '€1.8 trillion' },
        { id: 17, type: 'mcq', question: 'What does "planned obsolescence" mean?', options: ['Designing products for long lifetimes', 'Deliberately designing products to fail or become outdated', 'Planning the recycling of old products', 'Replacing outdated designs with newer models'], answer: 'Deliberately designing products to fail or become outdated' },
        { id: 18, type: 'mcq', question: 'In a product-as-a-service model, what incentive do companies have?', options: ['To sell as many products as possible', 'To increase manufacturing efficiency', 'To maintain and recover their products', 'To reduce consumer prices'], answer: 'To maintain and recover their products' },
        { id: 19, type: 'mcq', question: 'Where is the Kalundborg industrial park located?', options: ['Netherlands', 'Germany', 'Sweden', 'Denmark'], answer: 'Denmark' },
        { id: 20, type: 'mcq', question: 'What do companies at Kalundborg exchange?', options: ['Raw materials and labour', 'Steam, fly ash, and other by-products', 'Manufacturing equipment', 'Patents and technology'], answer: 'Steam, fly ash, and other by-products' },
        { id: 21, type: 'mcq', question: 'Which is NOT mentioned as an obstacle to the circular economy?', options: ['Difficulty disassembling products', 'Complex global supply chains', 'Government resistance', 'Consumer preference for cheaper products'], answer: 'Government resistance' },
        { id: 22, type: 'mcq', question: 'Why do sustainable products present a challenge for consumers?', options: ['They are less functional', 'They cost more and consumers lack incentive', 'They are unavailable in most markets', 'They require special disposal'], answer: 'They cost more and consumers lack incentive' },
        { id: 23, type: 'mcq', question: 'When was the EU Circular Economy Action Plan launched?', options: ['2015', '2018', '2020', '2022'], answer: '2020' },
        { id: 24, type: 'mcq', question: 'Which regions have introduced circular economy frameworks beyond the EU?', options: ['Only European countries', 'China and several Asian economies', 'Only developed nations', 'The United States and Canada'], answer: 'China and several Asian economies' },
        { id: 25, type: 'mcq', question: 'What does the passage suggest about product design and the circular economy?', options: ['Most products are already designed for recyclability', 'Design is irrelevant to the circular economy', 'Products need to be durable, repairable, and recyclable', 'Only packaging needs to change'], answer: 'Products need to be durable, repairable, and recyclable' },
        { id: 26, type: 'mcq', question: 'What is the main criticism of the circular economy?', options: ['It benefits the environment but not the economy', 'Implementation faces significant practical obstacles', 'It benefits large companies but not consumers', 'It has failed in all countries where it was tried'], answer: 'Implementation faces significant practical obstacles' },
      ],
    },
    {
      id: 3,
      title: 'Passage 3 – Urban Heat Islands',
      text: `Urban heat islands (UHIs) are a phenomenon in which cities experience significantly higher temperatures than the surrounding rural areas. This temperature difference can range from 1 to 7 degrees Celsius and is most pronounced on calm, clear nights. The effect was first systematically documented in London during the 19th century, when scientist Luke Howard recorded that the city centre was consistently warmer than outlying areas.

The primary cause of urban heat islands is the replacement of natural surfaces with impervious materials such as asphalt, concrete, and brick. Natural surfaces absorb solar energy during the day and release it through evaporation of water at night, a process that has a cooling effect. In contrast, built surfaces absorb and store heat during the day and release it slowly through the night, raising ambient temperatures. Dark-coloured surfaces such as asphalt are particularly effective at absorbing heat.

Additional factors contribute to the urban heat island effect. The reduction of vegetation in urban areas decreases the cooling influence of evapotranspiration. Buildings themselves can trap heat by reducing wind flow. Waste heat from air conditioning units, vehicles, and industrial processes adds further warmth to city environments.

The health consequences of urban heat islands are substantial. During heatwaves, higher urban temperatures contribute to increased rates of heat-related illness and mortality, particularly among the elderly, young children, and people with pre-existing health conditions. The European heatwave of 2003, which caused an estimated 70,000 excess deaths, demonstrated the potentially catastrophic impact of extreme heat events.

Several strategies have been proposed to mitigate urban heat islands. Green roofs, covered with soil and vegetation, can reduce building surface temperatures by up to 35 degrees Celsius compared to conventional rooftops. Street trees provide shade and cooling through evapotranspiration. Cool pavements made from lighter-coloured materials absorb less heat than conventional asphalt. Water-sensitive urban design—restoring natural water cycles through permeable surfaces and rain gardens—can increase evaporative cooling. Singapore's extensive network of urban parks and waterways is often cited as a model of this approach.

Critics argue that mitigation strategies are often expensive and may have limited effectiveness during extreme heat events. Climate change is expected to increase the frequency and intensity of heatwaves, potentially overwhelming even well-designed urban cooling systems.`,
      questions: [
        { id: 27, type: 'mcq', question: 'Where was the urban heat island effect first documented?', options: ['Paris, France', 'New York, USA', 'London, UK', 'Berlin, Germany'], answer: 'London, UK' },
        { id: 28, type: 'mcq', question: 'What temperature difference can urban heat islands cause?', options: ['1 to 3°C', '1 to 5°C', '1 to 7°C', '1 to 10°C'], answer: '1 to 7°C' },
        { id: 29, type: 'mcq', question: 'Why do built surfaces cause higher temperatures?', options: ['They reflect solar energy', 'They absorb and slowly release heat', 'They block wind more than vegetation', 'They produce waste heat'], answer: 'They absorb and slowly release heat' },
        { id: 30, type: 'mcq', question: 'What does evapotranspiration provide?', options: ['Warmth in urban areas', 'A cooling effect', 'Increased humidity', 'Reduced rainfall'], answer: 'A cooling effect' },
        { id: 31, type: 'mcq', question: 'How many excess deaths did the 2003 European heatwave cause?', options: ['7,000', '35,000', '70,000', '700,000'], answer: '70,000' },
        { id: 32, type: 'mcq', question: 'By how much can green roofs reduce surface temperatures?', options: ['Up to 10°C', 'Up to 20°C', 'Up to 35°C', 'Up to 50°C'], answer: 'Up to 35°C' },
        { id: 33, type: 'mcq', question: 'What does Singapore use as a cooling strategy?', options: ['White-painted buildings', 'Underground cooling systems', 'Parks and waterways', 'Underground water storage'], answer: 'Parks and waterways' },
        { id: 34, type: 'fill', question: 'Urban heat islands were first documented in _______ in the 19th century.', answer: 'London' },
        { id: 35, type: 'fill', question: 'The main cause of UHIs is the replacement of natural surfaces with _______ materials.', answer: 'impervious' },
        { id: 36, type: 'fill', question: 'Natural surfaces cool areas through the _______ of water at night.', answer: 'evaporation' },
        { id: 37, type: 'fill', question: 'Green roofs can reduce surface temperatures by up to _______ degrees Celsius.', answer: '35', alternatives: ['thirty-five'] },
        { id: 38, type: 'fill', question: 'Street trees provide _______ and cooling through evapotranspiration.', answer: 'shade' },
        { id: 39, type: 'fill', question: 'Water-sensitive design restores natural _______ cycles to increase evaporative cooling.', answer: 'water' },
        { id: 40, type: 'fill', question: 'Climate change is expected to increase the _______ of heatwaves.', answer: 'frequency' },
      ],
    },
  ],
};

// ─── ADVANCED ─────────────────────────────────────────────────────────────────
export const advancedReading: ReadingTest = {
  level: 'advanced',
  timeMinutes: 60,
  bandTarget: '7.0 – 9.0',
  passages: [
    {
      id: 1,
      title: 'Passage 1 – The Sapir-Whorf Hypothesis',
      text: `The Sapir-Whorf hypothesis, also known as linguistic relativity, proposes that the language a person speaks influences the structure of their cognition and their perception of reality. The hypothesis exists in two forms: the strong version, linguistic determinism, which holds that language determines thought entirely; and the weak version, which suggests that language merely influences thought patterns without fully dictating them.

The hypothesis derives its name from American linguist Edward Sapir and his student Benjamin Lee Whorf, who developed the theory in the early 20th century. Whorf's work on the Hopi language was particularly influential. He claimed that Hopi had no concept of time analogous to that of English, leading him to argue that Hopi speakers perceived time fundamentally differently. Later scholars, however, disputed these claims, arguing that Whorf had misrepresented Hopi grammar.

Despite early scepticism, the weak form of the hypothesis has received renewed empirical support in recent decades. Studies of colour perception have been particularly illuminating. In English, the colours "blue" and "green" are lexically distinct, whereas in some languages, a single term covers both. Experiments have shown that speakers of languages with distinct blue and green terms can identify and distinguish these colours more rapidly than speakers of languages with a single term.

Research on spatial cognition offers another line of evidence. Some languages use absolute spatial terms (north, south, east, west) rather than relative terms (left, right, in front). Studies by cognitive scientist Lera Boroditsky and colleagues found that speakers of absolute-reference languages maintain a strong sense of cardinal directions even in unfamiliar environments, a skill largely absent in speakers of relative-reference languages.

The hypothesis has significant implications for translation. If language shapes thought, certain concepts may be genuinely difficult to translate because the cognitive categories underlying them differ across languages. The Japanese concept of "ma"—the meaningful pause or empty space between things—lacks a direct English equivalent.

Not all researchers accept the hypothesis, even in its weak form. Critics argue that much of the empirical evidence is methodologically flawed, with small sample sizes and poorly controlled variables. Furthermore, the universality of basic cognitive operations suggests that thought can exist independently of specific linguistic structures.`,
      questions: [
        { id: 1,  type: 'tfng', question: 'The strong form of the Sapir-Whorf hypothesis claims language determines thought entirely.', answer: 'True' },
        { id: 2,  type: 'tfng', question: 'The hypothesis was developed in the late 19th century.', answer: 'False', explanation: 'It was developed in the early 20th century.' },
        { id: 3,  type: 'tfng', question: 'Benjamin Lee Whorf was a student of Edward Sapir.', answer: 'True' },
        { id: 4,  type: 'tfng', question: 'Whorf\'s research focused primarily on Mayan languages.', answer: 'False', explanation: 'It focused on Hopi language.' },
        { id: 5,  type: 'tfng', question: 'All later scholars supported Whorf\'s analysis of Hopi grammar.', answer: 'False', explanation: 'Later scholars disputed his claims.' },
        { id: 6,  type: 'tfng', question: 'Speakers with distinct blue/green terms can distinguish these colours more rapidly.', answer: 'True' },
        { id: 7,  type: 'tfng', question: 'In some languages, blue and green are described by a single word.', answer: 'True' },
        { id: 8,  type: 'tfng', question: 'Lera Boroditsky conducted the spatial cognition research described in the passage.', answer: 'True' },
        { id: 9,  type: 'tfng', question: 'All languages use absolute spatial reference systems such as north and south.', answer: 'False', explanation: 'Some use relative terms like left and right.' },
        { id: 10, type: 'tfng', question: 'The Japanese word "ma" can be translated directly into English.', answer: 'False', explanation: 'It lacks a direct English equivalent.' },
        { id: 11, type: 'tfng', question: 'Critics argue that empirical evidence for the hypothesis has methodological flaws.', answer: 'True' },
        { id: 12, type: 'tfng', question: 'The passage argues that all cognitive operations depend on language.', answer: 'Not Given', explanation: 'The text mentions this as a counter-argument by critics, not the passage\'s conclusion.' },
        { id: 13, type: 'tfng', question: 'The passage concludes that the hypothesis has been definitively proven.', answer: 'False', explanation: 'Not all researchers accept it even in its weak form.' },
      ],
    },
    {
      id: 2,
      title: 'Passage 2 – Biomimicry in Engineering',
      text: `Biomimicry—the practice of emulating structures, mechanisms, and processes found in nature to solve human engineering and design problems—has gained considerable traction as a design philosophy in recent decades. The term was popularised by biologist Janine Benyus in her 1997 book, which argued that nature, having had 3.8 billion years to refine its solutions, offers an unparalleled library of efficient, sustainable designs.

One of the most celebrated examples of biomimicry is the development of Velcro. Swiss engineer George de Mestral observed, in the 1940s, that burdock burrs attached themselves to his clothing through tiny hooks that engaged with loops of fabric or hair. He spent several years attempting to reproduce this mechanism artificially before eventually producing the fastening system now used globally.

The aerospace and automotive industries have drawn extensively on biological models. The Mercedes-Benz Bionic Car, unveiled in 2005, was modelled on the shape of the boxfish, whose seemingly unwieldy box-like body produces exceptionally low drag. Wind tunnel testing confirmed that the Bionic Car achieved a drag coefficient of 0.19, significantly lower than conventional vehicles. Similarly, the dimpled surface of golf balls, inspired by studies showing that dimples reduce aerodynamic drag, was one of the earliest applications of biomimetic principles in sports equipment.

The Eastgate Centre shopping complex in Harare, Zimbabwe, was designed using ventilation principles derived from termite mounds. African termite mounds maintain a near-constant internal temperature despite extreme external fluctuations, achieved through an intricate network of tunnels. The Eastgate Centre uses no conventional air conditioning and consumes only 10% of the energy of a comparable conventional building.

In materials science, spider silk has attracted intense research interest. Gram for gram, spider silk is stronger than steel and more elastic than nylon, produced at room temperature using water-soluble proteins. Researchers have attempted to replicate these properties through genetically modified organisms, including bacteria and goats, that produce silk proteins.

Despite its promise, biomimicry faces practical challenges. Natural systems evolved under evolutionary pressures that do not necessarily align with human engineering goals. Furthermore, the complexity of biological structures often makes them difficult to replicate at scale with current manufacturing techniques.`,
      questions: [
        { id: 14, type: 'mcq', question: 'What does "biomimicry" mean?', options: ['The study of natural ecosystems', 'Emulating nature to solve design problems', 'Breeding animals for industrial use', 'Developing AI based on neural networks'], answer: 'Emulating nature to solve design problems' },
        { id: 15, type: 'mcq', question: 'For how long has nature been refining its solutions, according to the passage?', options: ['1.8 billion years', '2.8 billion years', '3.8 billion years', '4.8 billion years'], answer: '3.8 billion years' },
        { id: 16, type: 'mcq', question: 'What inspired the invention of Velcro?', options: ['A spider\'s web', 'Burdock burrs attaching to clothing and fur', 'Gecko feet', 'Lotus leaves repelling water'], answer: 'Burdock burrs attaching to clothing and fur' },
        { id: 17, type: 'mcq', question: 'What was the drag coefficient achieved by the Mercedes-Benz Bionic Car?', options: ['0.09', '0.19', '0.29', '0.39'], answer: '0.19' },
        { id: 18, type: 'mcq', question: 'What marine creature was the Mercedes-Benz Bionic Car modelled on?', options: ['A shark', 'A dolphin', 'A tuna', 'A boxfish'], answer: 'A boxfish' },
        { id: 19, type: 'mcq', question: 'Where is the Eastgate Centre located?', options: ['South Africa', 'Zimbabwe', 'Kenya', 'Nigeria'], answer: 'Zimbabwe' },
        { id: 20, type: 'mcq', question: 'How much energy does the Eastgate Centre use compared to a conventional building?', options: ['50%', '25%', '10%', '5%'], answer: '10%' },
        { id: 21, type: 'mcq', question: 'What material is described as stronger than steel gram for gram?', options: ['Carbon fibre', 'Gecko adhesive', 'Spider silk', 'Lotus leaf coating'], answer: 'Spider silk' },
        { id: 22, type: 'mcq', question: 'How are researchers attempting to produce spider silk proteins?', options: ['By farming millions of spiders', 'Through genetically modified organisms', 'Through chemical synthesis', 'Through 3D printing'], answer: 'Through genetically modified organisms' },
        { id: 23, type: 'mcq', question: 'What ventilation design inspired the Eastgate Centre?', options: ['Wasp nests', 'Bird nests', 'Termite mounds', 'Beehives'], answer: 'Termite mounds' },
        { id: 24, type: 'mcq', question: 'What sport equipment application of biomimicry is mentioned?', options: ['Tennis rackets', 'Dimpled golf balls', 'Swimsuits', 'Running shoes'], answer: 'Dimpled golf balls' },
        { id: 25, type: 'mcq', question: 'What does the passage identify as a challenge for biomimicry?', options: ['Lack of funding for biological research', 'Natural systems evolved for different purposes', 'Governments restricting genetic modification', 'Engineers refusing to work with biologists'], answer: 'Natural systems evolved for different purposes' },
        { id: 26, type: 'mcq', question: 'What property of spider silk is highlighted beyond its strength?', options: ['It is transparent', 'It is more elastic than nylon', 'It is heat-resistant', 'It is cheaper than steel'], answer: 'It is more elastic than nylon' },
      ],
    },
    {
      id: 3,
      title: 'Passage 3 – The Economics of Attention',
      text: `In 1971, Herbert Simon, the Nobel Prize-winning economist, observed that "a wealth of information creates a poverty of attention." His insight has proved prescient. In the contemporary digital landscape, where an estimated 2.5 quintillion bytes of data are generated daily, the limiting resource is no longer information but the cognitive capacity to process it. Attention has become the primary currency of the modern knowledge economy.

The attention economy describes how digital platforms compete for and monetise human cognitive focus. Platforms such as social media networks, streaming services, and search engines generate revenue primarily through advertising. Their business models therefore depend on maximising the time users spend engaged with their content. Design features such as infinite scroll, variable reward mechanisms, and algorithmically curated feeds are explicitly engineered to hold attention as long as possible.

Research in behavioural psychology has informed the development of these techniques. Variable reward schedules—in which rewards are delivered unpredictably rather than at fixed intervals—are known to produce highly persistent behaviour in both animals and humans. This is the principle underlying gambling machines and, critics argue, social media feeds, where the unpredictable appearance of interesting content keeps users scrolling. Former technology insiders, notably former Google design ethicist Tristan Harris, have described these techniques as exploitative, comparing them to slot machine mechanics.

The consequences of attentional capture are debated. Some studies report correlations between heavy social media use and increased rates of anxiety and depression, particularly among adolescents. Research by psychologist Jean Twenge suggests that sharp increases in adolescent mental health problems in the United States since 2012 correspond with widespread smartphone adoption. However, other researchers argue that effect sizes are small and causal relationships have not been established.

The political dimensions of the attention economy are significant. Algorithms that optimise for engagement tend to promote emotionally provocative content, as outrage and fear are particularly effective at capturing attention. This has been linked to increased political polarisation. The term "filter bubble," coined by activist Eli Pariser, describes the personalised information environments that algorithms create, insulating users from contrary viewpoints.

Responses have varied. Proponents of "digital minimalism"—popularised by computer scientist Cal Newport—advocate for deliberate reduction of digital consumption. At the regulatory level, some European countries have banned infinite scroll for users under 18. Critics argue these measures place the burden of self-regulation on users rather than addressing structural incentives.`,
      questions: [
        { id: 27, type: 'mcq', question: 'What did Herbert Simon observe in 1971?', options: ['Too much data would slow down computers', 'A wealth of information creates a poverty of attention', 'Information technology would dominate the economy', 'Digital networks were inefficient'], answer: 'A wealth of information creates a poverty of attention' },
        { id: 28, type: 'mcq', question: 'How do platforms like social media primarily generate revenue?', options: ['Subscription fees', 'Selling user data directly', 'Advertising', 'Premium features'], answer: 'Advertising' },
        { id: 29, type: 'mcq', question: 'What psychological principle do variable reward schedules exploit?', options: ['Classical conditioning', 'Persistent behaviour through unpredictable rewards', 'Mirror neuron activation', 'Memory consolidation'], answer: 'Persistent behaviour through unpredictable rewards' },
        { id: 30, type: 'mcq', question: 'Who is described as a "former Google design ethicist"?', options: ['Eli Pariser', 'Jean Twenge', 'Cal Newport', 'Tristan Harris'], answer: 'Tristan Harris' },
        { id: 31, type: 'mcq', question: 'What does Jean Twenge\'s research identify?', options: ['Screen time leads directly to lower academic performance', 'Adolescent mental health problems coincide with smartphone adoption', 'Social media reduces loneliness in younger generations', 'Algorithm design determines voting patterns'], answer: 'Adolescent mental health problems coincide with smartphone adoption' },
        { id: 32, type: 'mcq', question: 'What is a "filter bubble"?', options: ['A tool to block inappropriate content', 'A personalised environment insulating users from contrary views', 'A legal term for data privacy violations', 'An algorithm that shows opposing viewpoints'], answer: 'A personalised environment insulating users from contrary views' },
        { id: 33, type: 'mcq', question: 'What regulatory response is mentioned in the passage?', options: ['A worldwide ban on social media for minors', 'Banning infinite scroll for under-18s in some European countries', 'Requiring platforms to show equal political content', 'Limiting advertising to two minutes per hour'], answer: 'Banning infinite scroll for under-18s in some European countries' },
        { id: 34, type: 'fill', question: 'Herbert Simon observed that a wealth of information creates a poverty of _______.', answer: 'attention' },
        { id: 35, type: 'fill', question: 'Digital platforms generate revenue primarily through _______.', answer: 'advertising' },
        { id: 36, type: 'fill', question: 'Variable reward schedules produce _______ behaviour in both animals and humans.', answer: 'persistent' },
        { id: 37, type: 'fill', question: 'The term _______ bubble was coined by activist Eli Pariser.', answer: 'filter' },
        { id: 38, type: 'fill', question: 'Cal Newport is a proponent of "digital _______."', answer: 'minimalism' },
        { id: 39, type: 'fill', question: 'Some European countries have banned _______ scroll for users under 18.', answer: 'infinite' },
        { id: 40, type: 'fill', question: 'Critics argue screen-time features place the burden of self-_______ on users.', answer: 'regulation' },
      ],
    },
  ],
};

export const readingTests: Record<string, ReadingTest> = {
  beginner: beginnerReading,
  intermediate: intermediateReading,
  advanced: advancedReading,
};
