export interface CourseForContent {
  name: string;
  level: string;
  studyLevel?: string;
  duration: string;
  durationYears: number;
  campus: string;
  intakeMonths: string[];
  country: string;
  city?: string;
  ieltsMin: number;
  toeflMin: number;
  pteMin?: number;
  annualINR: number;
  annualUSD: number;
  pgwp?: boolean;
  [key: string]: unknown;
}

export interface GeneratedContent {
  about: string;
  careerOutcomes: string;
  whyStudyHere: string;
  requirements: string[];
}

type Field = 'cs' | 'data' | 'ai' | 'engineering' | 'business' | 'finance' |
  'health' | 'law' | 'education' | 'psychology' | 'design' | 'marketing' |
  'science' | 'arts' | 'default';

function detectField(name: string): Field {
  const n = name.toLowerCase();
  if (/\b(artificial intelligence|deep learning|neural network|machine vision)\b/.test(n)) return 'ai';
  if (/\b(machine learning|data science|data analytics|big data|data engineering)\b/.test(n)) return 'data';
  if (/\b(computer science|software engineering|software development|computing|information technology|it management|cyber|network security)\b/.test(n)) return 'cs';
  if (/\b(mechanical|electrical|civil|chemical|structural|aerospace|industrial|systems|automotive|petroleum) engineering\b/.test(n)) return 'engineering';
  if (/\beng(ineering)?\b/.test(n) && /\b(beng|meng|bsc eng)\b/.test(n)) return 'engineering';
  if (/\b(mba|business administration|business management|entrepreneurship|leadership|operations management)\b/.test(n)) return 'business';
  if (/\b(finance|financial engineering|accounting|economics|banking|investment|actuarial)\b/.test(n)) return 'finance';
  if (/\b(nursing|medicine|medical|public health|health sciences|pharmacy|biomedical|clinical|physiotherapy|occupational therapy)\b/.test(n)) return 'health';
  if (/\b(law|legal studies|llm|llb|jurisprudence)\b/.test(n)) return 'law';
  if (/\b(education|teaching|pedagogy|curriculum|tesol)\b/.test(n)) return 'education';
  if (/\b(psychology|counselling|social work|mental health|behavioural science)\b/.test(n)) return 'psychology';
  if (/\b(architecture|urban design|interior design|product design|urban planning)\b/.test(n)) return 'design';
  if (/\b(marketing|communications|media studies|journalism|advertising|public relations|digital marketing)\b/.test(n)) return 'marketing';
  if (/\b(biology|chemistry|physics|mathematics|statistics|biochemistry|genetics|environmental science|biotechnology)\b/.test(n)) return 'science';
  if (/\b(arts|humanities|history|philosophy|literature|linguistics|cultural studies|film)\b/.test(n)) return 'arts';
  return 'default';
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return h;
}

function v(courseName: string, uniName: string, n: number): number {
  return hash(courseName + uniName) % n;
}

// ─── About ───────────────────────────────────────────────────────────────────

const fieldAbout: Record<Field, string[]> = {
  cs: [
    `This programme delivers rigorous training in algorithm design, data structures, software architecture, distributed systems, and cloud computing. Students engage with current challenges in the field through lab-based projects, collaborative software development assignments, and seminars led by researchers working at the forefront of computer science. The curriculum balances theoretical foundations with applied skills, preparing graduates to build scalable and reliable software systems across any industry.`,
    `The curriculum spans core areas including operating systems, programming language theory, software engineering methodologies, database design, and computer networks. Students develop proficiency with industry-standard tools and workflows, and many programmes offer specialisation tracks in cybersecurity, cloud infrastructure, or human-computer interaction. Practical learning through capstone projects and industry placements ensures graduates are immediately productive in professional software engineering roles.`,
    `Students gain expertise across a broad range of computing disciplines — from low-level systems programming and computer architecture to high-level application development and software project management. The programme emphasises problem-solving under real-world constraints, preparing graduates for roles that require both technical depth and collaborative engineering skills. Elective modules allow students to focus on areas such as mobile computing, embedded systems, or applied machine learning.`,
    `Core modules cover fundamental computing theory alongside modern engineering practice, including software testing, version control, agile development, and API design. The programme nurtures analytical thinking and the ability to design and evaluate complex systems. Many students complete research projects alongside faculty, gaining publication experience and deepening their technical expertise beyond the standard curriculum.`,
  ],
  data: [
    `The programme covers statistical modelling, machine learning pipelines, data wrangling, visualisation, and the ethical deployment of data-driven systems. Students work with industry-standard tools including Python, R, SQL, Spark, and cloud-based analytics platforms. A strong emphasis on reproducible research methods and communication of insights to non-technical stakeholders makes graduates effective not just as analysts but as strategic decision-makers in data-rich organisations.`,
    `Students develop expertise in the full data science workflow — from data acquisition and cleaning through to model development, validation, and deployment. The curriculum integrates statistics, computer science, and domain knowledge, giving graduates the versatility to work across healthcare, finance, logistics, marketing, and technology sectors. Capstone projects are frequently completed in collaboration with partner organisations, providing real-world portfolio evidence of analytical skills.`,
    `Core topics include supervised and unsupervised learning, time-series analysis, natural language processing, data engineering, and business intelligence. The programme develops proficiency in translating ambiguous business questions into structured analytical problems, a skill highly valued by employers. Students leave with experience in deploying machine learning models to production environments and communicating data-driven findings at the executive level.`,
    `The curriculum is designed around the complete analytics lifecycle — data engineering, exploratory analysis, predictive modelling, and impact measurement. Students gain hands-on experience with tools like TensorFlow, scikit-learn, Power BI, and cloud data warehousing solutions. Strong industry partnerships at many institutions provide internship and placement opportunities that frequently lead to full-time employment on graduation.`,
  ],
  ai: [
    `The programme explores the theoretical and applied foundations of artificial intelligence, including deep learning architectures, reinforcement learning, computer vision, natural language processing, and AI ethics. Students implement models using PyTorch, TensorFlow, and cloud AI platforms, gaining direct experience with the systems driving real-world applications in healthcare, autonomous vehicles, finance, and intelligent software. Research seminars expose students to state-of-the-art papers and emerging AI paradigms.`,
    `Core study areas include neural networks, generative AI, robotics, knowledge representation, probabilistic reasoning, and responsible AI development. The programme equips students with the mathematical rigour needed to innovate in AI research while also providing the engineering skills required for production AI deployments. Students frequently collaborate with research groups and industry partners on applied AI projects, building portfolios that stand out in a competitive global job market.`,
    `The curriculum covers foundational algorithms (search, planning, reasoning) alongside modern deep learning and its applications in language, vision, speech, and multi-modal systems. Students explore the societal dimensions of AI — fairness, accountability, transparency, and governance — alongside core technical skills. Many graduates go on to research roles in industry labs or pursue PhDs, while others enter high-growth AI product and engineering teams.`,
    `This programme trains students to design, evaluate, and deploy intelligent systems across diverse application domains. Topics span machine learning theory, large language models, computer vision pipelines, AI system design, and human-AI interaction. An emphasis on ethical and safety considerations distinguishes graduates as practitioners who understand not just how to build AI systems but how to build them responsibly and sustainably.`,
  ],
  engineering: [
    `The programme covers engineering principles including mechanics, materials science, thermodynamics, systems analysis, and project management, alongside specialised modules aligned with the specific discipline. Students apply theoretical knowledge through design projects, laboratory work, and simulation software used across the industry. A strong emphasis on professional engineering standards and sustainability ensures graduates are equipped to meet the technical and regulatory demands of modern engineering practice.`,
    `Core modules address both fundamental engineering science and contemporary practice — computer-aided design, structural analysis, process optimisation, and project life-cycle management are integrated throughout the curriculum. Students develop proficiency with professional tools used in industry, and many programmes offer placements or industry-linked projects that provide direct experience solving real engineering problems at scale. Graduate engineers from this programme are recognised for their practical readiness and analytical rigour.`,
    `The curriculum develops analytical, design, and problem-solving competencies across a range of engineering sub-disciplines, with a focus on applying scientific principles to create functional, cost-effective, and sustainable solutions. Final-year design projects often address genuine industry challenges set by partner organisations, giving students experience working to real project briefs, deadlines, and budget constraints. Professional accreditation routes are available at many institutions, supporting registration as a chartered engineer.`,
    `Students study applied mathematics, physical sciences, and core engineering subjects, progressing to advanced topics in materials selection, systems integration, reliability, and safety engineering. Simulation and modelling tools are used throughout to complement laboratory and workshop activities. The programme places strong emphasis on teamwork, technical communication, and engineering ethics, developing graduates who are both highly capable and professionally well-rounded.`,
  ],
  business: [
    `The programme develops strategic leadership, operational excellence, and commercial acumen across disciplines including corporate strategy, organisational behaviour, financial analysis, supply chain management, and marketing. Students work in diverse teams on case studies drawn from real business situations, developing the judgement and interpersonal skills demanded by senior roles. The curriculum integrates global business perspectives, making graduates effective in multinational and cross-cultural working environments.`,
    `Core areas of study include business strategy, managerial economics, corporate finance, human resource management, operations, and entrepreneurship. Many students arrive with professional experience and benefit from a cohort that brings diverse industry perspectives into classroom discussions. Action learning projects, consulting simulations, and mentorship from practising executives provide an applied dimension that distinguishes graduates in competitive management hiring processes.`,
    `The programme equips students with the analytical frameworks and leadership capabilities needed to drive organisational performance. Modules cover strategic analysis, digital transformation, sustainable business models, stakeholder management, and corporate governance. A global mindset is embedded throughout, with international case studies, exchange opportunities, and a diverse faculty that reflects the internationalisation of modern business. Graduates are prepared to enter roles at the senior management level across private, public, and social sectors.`,
    `This management programme challenges students to think critically about organisational challenges and develop evidence-based solutions. Topics range from financial management and data analytics to innovation strategy and change management. The programme places particular emphasis on responsible leadership and sustainable value creation, reflecting the expectations of modern employers. Students graduate with a strong professional network and the credentials to accelerate into leadership roles within three to five years of completing the programme.`,
  ],
  finance: [
    `The programme provides a rigorous grounding in financial theory and quantitative methods, covering asset pricing, portfolio management, corporate finance, derivatives, risk modelling, and financial regulation. Students develop proficiency with financial data platforms and modelling tools including Bloomberg, Python, and Excel VBA. A curriculum informed by current market practice ensures graduates understand how financial theories translate into real-world decisions in investment management, banking, and corporate treasury roles.`,
    `Core modules span financial markets and institutions, quantitative finance, investment analysis, corporate valuation, behavioural finance, and financial econometrics. Students acquire both the technical skills for financial modelling and the judgment required for sound investment and risk decisions. Many programmes include Bloomberg certification or CFA preparatory content, giving graduates a tangible credential advantage when entering competitive financial services recruitment processes.`,
    `The programme develops expertise in the valuation, management, and regulation of financial instruments and institutions. Topics include equity research, fixed income, derivatives pricing, credit risk, regulatory frameworks, and sustainable finance. Strong industry connections at many institutions enable students to attend market briefings, hear from senior practitioners, and access internship opportunities that provide direct experience of financial services careers in the host country and globally.`,
    `Students develop quantitative and analytical skills applied to the full spectrum of financial problems — from pricing complex derivatives and constructing efficient portfolios to evaluating corporate capital structures and managing financial risk in volatile markets. The programme balances rigorous mathematical training with applied financial judgment, producing graduates who can operate in research, advisory, and trading roles. Elective modules allow students to specialise in areas such as fintech, sustainable finance, or real estate finance.`,
  ],
  health: [
    `The programme provides comprehensive preparation for a career in healthcare, covering clinical knowledge, public health principles, research methodology, health systems management, and professional practice. Students develop the critical appraisal skills needed to apply evidence-based approaches to patient care and health policy. Field placements, simulation laboratories, and case-based learning provide experiential context that connects academic study to real healthcare settings across diverse patient populations.`,
    `Core modules address both the science of health and the social determinants of wellbeing, covering epidemiology, health behaviour, chronic disease management, health economics, and healthcare ethics. Students engage with contemporary health challenges including ageing populations, mental health provision, and global health inequalities. The programme develops graduates capable of working as healthcare practitioners, public health professionals, health managers, or health researchers within complex multi-disciplinary environments.`,
    `The curriculum develops clinical competency alongside the broader skills needed to manage, improve, and innovate within health systems. Students study pathophysiology, pharmacology, health law, quality improvement, and the integration of technology into healthcare delivery. Practical learning through supervised clinical placements or community health projects is a central feature of the programme, ensuring graduates are prepared to work safely and effectively from their first day in a professional role.`,
    `This health sciences programme combines scientific rigour with professional preparation, training students to apply the latest clinical evidence and health technologies in real practice settings. Topics range from fundamental health sciences and biostatistics to health policy analysis and interprofessional collaboration. Graduates are in high demand across hospitals, public health agencies, community organisations, and the rapidly growing health technology sector.`,
  ],
  law: [
    `The programme provides a thorough grounding in legal principles, analysis, and reasoning, covering constitutional law, contract, tort, criminal law, administrative law, and the international dimensions of legal systems. Students develop the skills to construct legal arguments, interpret statutes and case law, and advise on complex legal problems across multiple jurisdictions. Mooting, clinical legal education, and legal research projects provide applied experience that prepares graduates for practice, policy, or academic careers.`,
    `Core legal studies are complemented by specialisation opportunities in areas such as commercial law, human rights, intellectual property, environmental law, and international arbitration. Students learn to navigate the nuances of legal reasoning, procedural rules, and professional ethics. Many programmes maintain strong links with law firms, barristers' chambers, and legal aid organisations, providing networking, mentorship, and work experience opportunities that are valuable in a competitive legal job market.`,
    `The programme trains students in the conceptual foundations and practical applications of law, developing the analytical and advocacy skills required for legal practice, public service, or corporate advisory roles. Students examine the interaction between law and society, exploring how legal frameworks shape individual rights, commercial relationships, and governance structures. Graduates are well positioned to enter bar exams, solicitor qualification routes, or international legal careers in the host country and beyond.`,
    `Legal education at this level encompasses the doctrinal, theoretical, and practical dimensions of the discipline. Students engage deeply with primary legal sources — statutes, regulations, and judicial decisions — developing precision in legal analysis and confidence in argumentation. The programme's global perspective, incorporating comparative law and international legal instruments, prepares graduates for practice in an increasingly interconnected legal environment.`,
  ],
  education: [
    `The programme prepares educators and education professionals to design, deliver, and assess effective learning experiences in diverse contexts. Core study areas include learning theory, curriculum development, inclusive education, assessment design, educational technology, and education policy. Students engage in practical teaching placements or school-based projects that contextualise theoretical learning and develop classroom competence alongside reflective professional practice.`,
    `This education programme develops both specialist content knowledge and the pedagogical skills to teach across age groups and subject areas. Students explore evidence-based teaching strategies, student motivation, differentiated instruction, and the integration of technology into learning environments. A focus on educational research methods enables graduates to critically evaluate educational interventions and contribute to knowledge development within their professional practice.`,
    `Students develop expertise in the theory and practice of education, with modules covering developmental psychology, social justice in education, school leadership, professional ethics, and the policy frameworks that shape educational institutions. Practical experience is woven throughout the curriculum, providing opportunities to apply classroom management strategies, design assessments, and mentor learners within supervised settings that reflect the real complexity of educational work.`,
    `The programme equips students to become effective, reflective, and research-informed education professionals. Topics range from the neuroscience of learning and literacy development to curriculum standards, teacher professional identity, and educational equity. Students graduate with a deep understanding of how individuals and institutions learn and change, along with the practical skills to make a meaningful difference in educational settings at every level.`,
  ],
  psychology: [
    `The programme provides a comprehensive foundation in psychological science, covering cognitive psychology, developmental psychology, social psychology, abnormal psychology, research methodology, and psychometrics. Students develop the critical and analytical skills to understand human thought, emotion, and behaviour, and to apply psychological principles in clinical, organisational, educational, and community settings. Practical modules in research design and statistical analysis develop competencies that are highly valued across many professional fields.`,
    `Core study areas include personality theory, psychopathology, neuropsychology, health psychology, and counselling approaches. Students engage with current debates in psychological science and practice, developing the ability to critically evaluate evidence and apply it ethically to real human situations. The programme provides a strong foundation for those pursuing careers in clinical practice, educational psychology, organisational behaviour, health services, or postgraduate research.`,
    `Students develop a scientifically grounded understanding of human behaviour across the lifespan, exploring individual differences, social influences, and the biological bases of psychological function. Applied modules in counselling skills, psychological assessment, and intervention design complement theoretical study and prepare students for roles in mental health, education, human resources, marketing research, and community services. Many graduates go on to professional training programmes in clinical, educational, or forensic psychology.`,
    `The programme explores psychological theory from cognitive and biological perspectives through to social, cultural, and clinical applications. Students develop rigorous research skills and the ability to design, conduct, and report psychological investigations. Placements or applied projects in relevant community, clinical, or organisational settings provide direct experience of working with human needs and professional responsibilities, informing a reflective and ethical professional identity.`,
  ],
  design: [
    `The programme develops creative and technical skills in design through a studio-based curriculum that combines conceptual thinking with practical making. Students explore design history and theory, spatial reasoning, materials and methods, digital fabrication, sustainable design principles, and the relationship between design and social context. Portfolio reviews, live briefs from industry, and collaborative studio projects prepare graduates for professional practice in a wide range of design disciplines.`,
    `Core studies cover design process methodology, visual communication, human-centred design, prototyping, and the environmental impact of design decisions. Students develop proficiency with industry-standard digital design tools and fabrication technologies, while also cultivating the critical thinking and research skills needed to tackle complex design problems. Guest lectures, industry visits, and external project briefs ensure the curriculum is informed by the realities of professional practice.`,
    `Students develop a distinctive design voice through iterative project work that moves between research, ideation, prototyping, and evaluation. The curriculum addresses both the creative and functional dimensions of design, with modules covering user research, ergonomics, sustainability, and professional project management. The programme prepares graduates for roles in commercial studios, design consultancies, in-house design teams, and entrepreneurial ventures within the creative industries.`,
    `This design programme challenges students to address real-world problems through evidence-informed creative practice. Topics span spatial design, product development, interaction design, and communication design, with a strong emphasis on sustainability and inclusive design principles. A rich portfolio of completed projects, developed across the programme, demonstrates the graduate's design thinking and making capabilities to prospective employers.`,
  ],
  marketing: [
    `The programme covers the full spectrum of marketing practice — market research, consumer behaviour, brand management, digital marketing, content strategy, performance analytics, and integrated campaign planning. Students develop proficiency with digital marketing platforms, customer relationship management systems, and analytics tools. A curriculum that integrates marketing theory with current industry practice ensures graduates are able to design and implement effective marketing strategies across digital and traditional channels.`,
    `Core modules address marketing strategy, advertising management, social media marketing, SEO and paid media, public relations, marketing communications, and data-driven customer insights. Students engage with real brand challenges through applied projects that develop the commercial judgment to allocate budgets, measure effectiveness, and adapt strategies in dynamic market conditions. Industry guest speakers and agency partnerships provide access to current professional expertise and networking opportunities.`,
    `Students develop expertise in understanding markets, communicating value propositions, and building brand equity through coherent marketing programmes. The curriculum balances creative marketing concepts with analytical rigour, training graduates to make evidence-based marketing decisions. Modules in digital marketing, content creation, influencer marketing, and customer journey design reflect the evolving landscape of marketing practice, preparing students for roles in marketing agencies, brand teams, and digital media organisations.`,
    `The programme builds both strategic marketing thinking and hands-on execution skills. Students learn to segment markets, develop brand positioning, design customer experiences, and measure marketing return on investment. A strong focus on digital channels — search, social, programmatic, and email — ensures graduates are immediately productive in performance marketing roles, while modules in brand strategy and marketing leadership prepare them for longer-term career progression to senior marketing positions.`,
  ],
  science: [
    `The programme provides rigorous training in the fundamental principles and contemporary applications of the natural sciences. Students develop strong quantitative and analytical skills alongside laboratory competency, applying scientific reasoning to experimental design, data collection, analysis, and interpretation. The curriculum integrates lectures, tutorials, and research projects that challenge students to engage with current scientific questions and contribute to the advancement of knowledge in their chosen field.`,
    `Core scientific training is complemented by specialist modules that reflect the leading research areas at the institution. Students develop proficiency with scientific instrumentation, computational modelling tools, and technical writing, building the competencies needed for research careers or postgraduate study. Many programmes offer supervised research projects in which students work alongside faculty members on live investigations, gaining authentic experience of the scientific research process.`,
    `Students develop a deep conceptual understanding of their chosen scientific discipline alongside the practical and mathematical skills to investigate natural phenomena rigorously. The programme addresses both foundational science and its applications — from clinical diagnostics and pharmaceutical development to environmental monitoring and computational modelling. Graduates enter careers in research, industry, government agencies, and education, or progress to higher-level postgraduate study.`,
    `This science programme combines theoretical depth with practical application, developing graduates who can think critically, design experiments, and communicate scientific findings clearly. The curriculum is regularly updated to reflect developments in the field, and students are encouraged to engage with primary literature from early in their studies. Strong research infrastructure at many institutions provides access to advanced analytical equipment and the opportunity to pursue innovative research projects at the undergraduate or postgraduate level.`,
  ],
  arts: [
    `The programme fosters critical, creative, and research-based engagement with the humanities and arts, developing the analytical, communication, and interpretive skills that are fundamental to understanding culture, history, and human expression. Students engage with primary sources, theoretical frameworks, and interdisciplinary perspectives, building the intellectual depth and expressive capability prized across media, education, public affairs, and the cultural sectors.`,
    `Core study combines the acquisition of specialist knowledge in a humanities or arts discipline with transferable skills in critical analysis, academic writing, research methodology, and structured argumentation. Students develop the ability to construct and defend well-evidenced interpretations of complex texts, artefacts, and cultural phenomena. The programme prepares graduates for careers in arts management, publishing, education, journalism, public service, and graduate research.`,
    `Students develop rigorous scholarly and creative skills through sustained engagement with the traditions and contemporary debates of their chosen discipline. The curriculum integrates seminars, studio practice, fieldwork, and research projects that challenge students to think independently and communicate complex ideas with clarity and precision. Graduates bring valuable analytical and communication competencies to employers in every sector, including technology companies, consultancies, government, and international organisations.`,
    `This arts and humanities programme develops intellectual curiosity alongside practical expertise in research, critical thinking, and written and oral communication. Students engage with diverse cultural, historical, and theoretical perspectives, developing a nuanced understanding of human experience across time and geography. The programme's emphasis on independent scholarship and creative problem-solving equips graduates for leadership roles in the cultural industries and beyond.`,
  ],
  default: [
    `The programme offers a structured pathway through the discipline's core knowledge areas, developing both theoretical understanding and applied professional skills. Students engage with current research and industry practice through a mix of lectures, seminars, case studies, and project-based learning. The curriculum is designed to develop graduates with the analytical capability, communication skills, and domain expertise to contribute effectively in professional environments from the first day of their career.`,
    `Core modules provide foundational expertise in the discipline's key concepts and methodologies, supplemented by elective study that allows students to develop specialised knowledge aligned with career goals. Students benefit from exposure to current professional practice through industry partnerships, guest lecturers, and applied projects. Many programmes include work placement components that provide direct professional experience and help students build a network of industry contacts before graduation.`,
    `The programme develops rigorous academic and professional competencies across the major areas of the discipline. Students are challenged to engage critically with ideas, apply evidence-based approaches to professional problems, and communicate findings effectively to specialist and non-specialist audiences. Access to leading faculty, research facilities, and alumni networks provides the connections and knowledge needed to enter the profession with confidence and a credible academic foundation.`,
    `Students develop expertise aligned with the current demands of the profession, with a curriculum shaped by input from practitioners and informed by applied research. The programme emphasises reflective practice, continuous learning, and professional ethics alongside core technical and analytical skills. Graduates are recognised by employers for their preparedness, critical thinking, and the ability to adapt to new challenges — qualities developed through the rigorous and supportive learning environment of the programme.`,
  ],
};

// ─── Career Outcomes ─────────────────────────────────────────────────────────

interface CareerData {
  roles: string[];
  industries: string[];
  avgUSD: number;
  demand: string;
}

const fieldCareers: Record<Field, CareerData> = {
  cs: { roles: ['Software Engineer', 'Backend Developer', 'Solutions Architect', 'DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer'], industries: ['technology', 'finance', 'healthcare technology', 'e-commerce', 'defence', 'consulting'], avgUSD: 110000, demand: 'consistently one of the highest-demand skills globally, with strong growth in cloud, AI, and cybersecurity roles' },
  data: { roles: ['Data Scientist', 'Machine Learning Engineer', 'Analytics Manager', 'Data Architect', 'Business Intelligence Analyst', 'Quantitative Analyst'], industries: ['finance', 'healthcare', 'retail', 'technology', 'government', 'consulting'], avgUSD: 105000, demand: 'extremely high across every industry as organisations invest heavily in data-driven decision-making' },
  ai: { roles: ['AI Engineer', 'Machine Learning Researcher', 'NLP Engineer', 'Computer Vision Engineer', 'AI Product Manager', 'Research Scientist'], industries: ['technology', 'autonomous systems', 'healthcare AI', 'financial technology', 'defence', 'gaming'], avgUSD: 120000, demand: 'surging globally, with AI engineering among the fastest-growing and best-remunerated technical specialisations' },
  engineering: { roles: ['Design Engineer', 'Project Engineer', 'Structural Analyst', 'Systems Engineer', 'Engineering Consultant', 'Technical Lead'], industries: ['construction', 'manufacturing', 'energy', 'aerospace', 'automotive', 'civil infrastructure', 'oil and gas'], avgUSD: 90000, demand: 'steady and strong, particularly in infrastructure, renewable energy, and advanced manufacturing sectors' },
  business: { roles: ['Management Consultant', 'Strategy Analyst', 'Business Development Manager', 'Product Manager', 'Operations Director', 'Chief of Staff'], industries: ['consulting', 'technology', 'retail', 'finance', 'healthcare', 'government', 'non-profit'], avgUSD: 100000, demand: 'consistently strong, with MBA and management graduates sought by organisations across every sector for leadership roles' },
  finance: { roles: ['Financial Analyst', 'Investment Banker', 'Portfolio Manager', 'Risk Manager', 'Corporate Treasurer', 'Equity Research Analyst'], industries: ['investment banking', 'asset management', 'corporate finance', 'insurance', 'fintech', 'consultancy'], avgUSD: 110000, demand: 'strong, particularly in financial centres, with growing opportunities in sustainable finance and financial technology' },
  health: { roles: ['Clinical Practitioner', 'Public Health Officer', 'Health Services Manager', 'Research Scientist', 'Health Policy Analyst', 'Community Health Worker'], industries: ['hospitals', 'public health agencies', 'pharmaceutical companies', 'NGOs', 'government health departments', 'health technology'], avgUSD: 80000, demand: 'robust and growing as populations age and healthcare systems expand worldwide, particularly in aged care, mental health, and primary care' },
  law: { roles: ['Solicitor', 'Barrister', 'Corporate Counsel', 'Legal Consultant', 'Policy Advisor', 'Compliance Officer'], industries: ['private law firms', 'in-house legal departments', 'government and regulatory agencies', 'NGOs', 'international organisations', 'financial services'], avgUSD: 95000, demand: 'stable with growing demand in commercial law, intellectual property, data privacy, and international arbitration' },
  education: { roles: ['Teacher', 'Education Consultant', 'Curriculum Designer', 'School Administrator', 'Education Researcher', 'Learning and Development Manager'], industries: ['schools and universities', 'EdTech companies', 'government education departments', 'international schools', 'corporate training', 'NGOs'], avgUSD: 65000, demand: 'steady globally, with growing opportunities in EdTech, corporate learning, and international education' },
  psychology: { roles: ['Clinical Psychologist', 'Counsellor', 'Organisational Psychologist', 'Educational Psychologist', 'Human Resources Business Partner', 'Research Scientist'], industries: ['mental health services', 'hospitals', 'schools', 'HR and consulting', 'public sector', 'research institutions'], avgUSD: 78000, demand: 'growing strongly as demand for mental health services increases and organisations invest in employee wellbeing and organisational effectiveness' },
  design: { roles: ['Architect', 'Product Designer', 'UX Designer', 'Interior Designer', 'Urban Planner', 'Design Consultant'], industries: ['architecture firms', 'product companies', 'technology companies', 'government planning', 'retail and property development', 'creative agencies'], avgUSD: 80000, demand: 'growing, particularly in UX/UI, sustainable design, and urban planning, as digital and physical environments are redesigned for new user needs' },
  marketing: { roles: ['Marketing Manager', 'Brand Strategist', 'Digital Marketing Specialist', 'Content Director', 'Growth Marketing Lead', 'CMO'], industries: ['consumer goods', 'technology companies', 'media and advertising agencies', 'e-commerce', 'financial services', 'healthcare'], avgUSD: 85000, demand: 'strong and diversifying, with digital marketing skills among the most sought-after competencies across industries globally' },
  science: { roles: ['Research Scientist', 'Laboratory Manager', 'Clinical Trials Associate', 'Data Analyst', 'Regulatory Affairs Specialist', 'Science Communicator'], industries: ['pharmaceutical and biotech', 'research institutions', 'government labs', 'environmental agencies', 'food science', 'materials science'], avgUSD: 82000, demand: 'growing in life sciences, environmental science, and technology-adjacent fields, with strong demand for scientists who can apply computational and data skills' },
  arts: { roles: ['Content Strategist', 'Policy Analyst', 'Arts Administrator', 'Journalist', 'Communications Manager', 'Research Officer'], industries: ['media', 'government', 'NGOs', 'education', 'cultural institutions', 'consulting', 'technology companies'], avgUSD: 70000, demand: 'diverse, with arts and humanities graduates valued across media, public affairs, education, and organisations seeking critical thinking and communication skills' },
  default: { roles: ['Professional Analyst', 'Project Manager', 'Research Officer', 'Consultant', 'Operations Manager', 'Policy Advisor'], industries: ['government', 'consulting', 'technology', 'finance', 'healthcare', 'international organisations'], avgUSD: 80000, demand: 'solid across most sectors, with employer demand focusing on graduates who combine domain knowledge with transferable analytical and communication skills' },
};

function generateCareer(course: CourseForContent, uniName: string, field: Field, variation: number): string {
  const cd = fieldCareers[field];
  const topRoles = cd.roles.slice(0, 4).join(', ');
  const country = course.country;
  const inrLakh = (cd.avgUSD * 83.5 / 100000).toFixed(1);

  const openers = [
    `Graduates of the ${course.name} from ${uniName} are well positioned for careers across the ${cd.industries[0]} and ${cd.industries[1]} sectors in ${country} and internationally.`,
    `The ${course.name} from ${uniName} opens pathways into a wide range of professional roles in ${country}, including ${topRoles}.`,
    `Career outcomes for ${course.name} graduates from ${uniName} include roles such as ${topRoles} across ${cd.industries[0]}, ${cd.industries[1]}, and ${cd.industries[2]}.`,
    `Students completing the ${course.name} at ${uniName} develop skills that are ${cd.demand}.`,
  ];

  const mid = [
    ` The average graduate salary for this field in ${country} is approximately USD ${cd.avgUSD.toLocaleString()} (₹${inrLakh} lakh) per year, with experienced professionals typically earning significantly above this level. Demand for qualified ${field === 'default' ? 'professionals' : field.toUpperCase() === field ? field : field} graduates in ${country} is ${cd.demand}.`,
    ` In ${country}, professionals in this field earn an average of USD ${cd.avgUSD.toLocaleString()} annually — approximately ₹${inrLakh} lakh — with rapid salary growth for those who develop specialist expertise. Graduate employment in this sector is ${cd.demand}.`,
    ` Salaries in ${country} for this specialisation average USD ${cd.avgUSD.toLocaleString()} per year (approximately ₹${inrLakh} lakh), rising sharply with experience and seniority. Demand for graduates in this field is ${cd.demand}.`,
    ` Earnings in ${country} for qualified professionals in this area average USD ${cd.avgUSD.toLocaleString()} per annum (around ₹${inrLakh} lakh), with strong upside in senior roles. Employer demand is ${cd.demand}.`,
  ];

  const closers = [
    ` ${uniName} maintains active relationships with employers across the sector, providing students with access to networking events, on-campus recruitment presentations, and career mentorship throughout the programme.`,
    ` ${uniName}'s career services and alumni network provide students with connections to employers across ${country} and beyond, supporting internship placements and graduate recruitment.`,
    ` Many graduates secure roles before completing their studies through the university's industry connections, internship programmes, and career fair participation. The ${country} job market for this specialisation is considered highly favourable for qualified international graduates.`,
    ` The ${country} job market for this specialisation is considered one of the most accessible for skilled international graduates, with many ${uniName} alumni progressing to senior roles within five years of graduation.`,
  ];

  return openers[variation % openers.length] + mid[variation % mid.length] + closers[variation % closers.length];
}

// ─── Why Study Here ───────────────────────────────────────────────────────────

const countryWhy: Record<string, string[]> = {
  Canada: [
    `Canada is one of the world's most popular destinations for Indian students, offering a combination of world-class universities, a welcoming multicultural society, and one of the most accessible post-study work pathways available globally. The Post-Graduation Work Permit (PGWP) allows international graduates to work in Canada for up to three years, providing valuable work experience that can lead to Canadian Permanent Residency through pathways such as Express Entry and the Provincial Nominee Programme. Canada's strong technology, healthcare, and business sectors offer internationally competitive salaries, making it an excellent return on investment for Indian students and their families.`,
    `Canada's education system consistently ranks among the best in the world, and its universities are recognised for research output, faculty quality, and graduate employability. For Indian students, Canada offers a uniquely accessible immigration pathway through the PGWP and Express Entry systems, with many graduates achieving Permanent Residency within three to five years of arriving. The country's high standard of living, affordable cost of education compared to the United States, and large Indian diaspora community make the transition straightforward and well-supported.`,
    `Studying in Canada offers Indian students an excellent combination of academic quality, post-study work rights, and immigration prospects. The PGWP allows graduates of designated learning institutions to work full-time for a period matching their study duration (up to three years), and this work experience directly feeds into Canadian Permanent Residency applications. Canadian cities such as Toronto, Vancouver, Calgary, and Montreal consistently rank among the world's most liveable, with strong employment markets and vibrant Indian communities that ease the transition for new arrivals.`,
  ],
  UK: [
    `The United Kingdom offers some of the world's most prestigious universities, with many institutions ranked consistently in the global top 100. For Indian students, the Graduate Route Visa provides the right to work in the UK for two years (three years for PhD graduates) after completing any degree, providing a valuable pathway into the UK job market and, for some, into longer-term UK residency. The UK's compact geography, excellent transport links, and diversity of industries — from London's global financial centre to the technology hubs of Manchester and Edinburgh — provide exceptional career development opportunities.`,
    `The UK remains one of the most sought-after study destinations for Indian students, offering world-renowned academic institutions, a rich cultural heritage, and strong industry connections in finance, technology, healthcare, and the creative industries. The Graduate Route Visa allows graduates to remain and work in the UK for two years post-graduation, supporting the transition into employment and giving graduates time to build professional experience and connections. A significant Indian diaspora community and cultural familiarity make the UK one of the most welcoming English-speaking destinations for Indian students.`,
    `Studying in the UK provides access to a world-class education system with strong industry connections and an internationally recognised academic credential. The Graduate Route Visa, introduced in 2021, allows international graduates to work in the UK for up to two years after graduating, giving them time to establish their careers in one of the world's most diverse and competitive job markets. For Indian students seeking careers in finance, technology, healthcare, law, or the creative industries, the UK offers an unparalleled concentration of global employers and professional networks.`,
  ],
  Australia: [
    `Australia is a consistently popular destination for Indian students, offering high academic standards, a relaxed lifestyle, and strong post-study work opportunities. International graduates are eligible for the Temporary Graduate Visa (Subclass 485), which allows them to live and work in Australia for two to four years after completing their degree, depending on the course and location of study. Australia's growing technology, healthcare, engineering, and mining sectors create strong demand for skilled graduates, and many students progress to Australian Permanent Residency through skilled migration pathways.`,
    `Australia's universities are globally respected, and the country's welcoming attitude toward skilled immigration makes it an attractive long-term destination for Indian students. The Temporary Graduate Visa provides post-study work rights for two to four years, during which graduates can develop local work experience that supports applications for skilled migration. Australian cities including Sydney, Melbourne, Brisbane, and Perth consistently rank among the world's most liveable, with thriving job markets, warm climates, and large, well-established Indian communities.`,
    `For Indian students, Australia combines strong university rankings with accessible post-study pathways and a diverse, multicultural society. The Temporary Graduate Visa allows international graduates to remain in Australia and work for up to four years after completing their degree, and this experience counts directly toward skilled migration applications. Australia's growing healthcare, technology, construction, and resources sectors are particularly strong, and the country's general skills shortage creates excellent employment prospects for qualified graduates.`,
  ],
  USA: [
    `The United States offers the world's most prestigious and research-intensive universities, with unparalleled resources, faculty talent, and industry connections. For Indian students, the Optional Practical Training (OPT) programme allows up to 12 months of work experience in the USA after graduation, with STEM graduates eligible for an extension of up to 36 months total. Proximity to Silicon Valley, Wall Street, and the world's largest healthcare and defence industries creates exceptional career opportunities, with US graduate salaries consistently among the highest globally for international students.`,
    `Studying in the United States provides access to world-leading research facilities, a culture of innovation, and a job market that sets global salary benchmarks across technology, finance, healthcare, and engineering. The OPT programme gives international graduates up to three years of work authorisation in STEM fields, providing time to build the professional profile needed for H-1B visa sponsorship and longer-term career development in the USA. For Indian students aspiring to technology, research, or business careers, the US remains the most impactful global destination.`,
    `The USA's higher education system is unmatched in scale and global influence, with universities that attract the best faculty and researchers from around the world. For Indian graduates, the OPT period (12–36 months) provides a crucial window to gain US work experience and move toward H-1B sponsorship by a US employer. Graduates of top US programmes command premium salaries and build professional networks that remain valuable throughout their careers, regardless of where they ultimately settle.`,
  ],
  Germany: [
    `Germany offers an exceptional combination of academic excellence and affordable education, with many public universities charging minimal or no tuition fees even for international students. The country's engineering, manufacturing, automotive, and pharmaceutical sectors are among the world's strongest, creating excellent employment prospects for STEM graduates. International graduates can remain in Germany for up to 18 months after graduation on a job-seeker visa, and those who secure employment gain access to EU working rights and a path toward German residency.`,
    `Germany is one of Europe's most desirable destinations for Indian students in STEM and business, combining world-class technical universities with a job-seeker visa that allows graduates 18 months to find employment after completing their studies. Many German universities offer programmes in English, and the cost of living and tuition fees are substantially lower than in the UK, USA, or Australia. Germany's export-driven economy and strong demand for engineers, scientists, and technology professionals make it an excellent career launchpad.`,
    `Studying in Germany provides access to one of Europe's strongest research and industrial ecosystems at competitive cost. German universities — particularly technical universities and the TU9 alliance — have global reputations for engineering and applied sciences education. International graduates can stay in Germany for up to 18 months on a job-seeker visa, giving them time to find employment, after which they gain the right to work and live in Germany with a path to permanent residency after several years of skilled employment.`,
  ],
  Ireland: [
    `Ireland is an attractive English-speaking destination within the European Union, home to the European headquarters of global technology companies including Google, Meta, Apple, LinkedIn, and many others. International graduates can remain in Ireland on a Stay Back Visa for up to two years (for degree graduates) or one year (for Masters graduates) to seek employment in the Irish market. Ireland's booming technology, pharmaceutical, and financial services sectors offer excellent graduate job prospects, and EU residency rights following settled status in Ireland are a significant long-term benefit.`,
    `Studying in Ireland offers Indian students access to a dynamic economy, an English-speaking environment, and EU membership benefits. The Graduate Permission Scheme allows international graduates to remain in Ireland after graduation to seek employment — 12 months for Masters graduates and 24 months for PhD graduates — in a job market that includes the European operations of many of the world's largest technology and pharmaceutical companies. Ireland's small size, friendly culture, and significant Indian community make it a welcoming and accessible destination.`,
    `Ireland combines the benefits of an English-speaking educational environment with the EU career market, making it a uniquely positioned destination for Indian students. International graduates are eligible for a stay-back permission of 12 to 24 months to find employment, and those who join Ireland's thriving technology, consultancy, or life sciences sectors often progress to longer-term visas and eventual permanent residency. Dublin, Cork, and Galway offer active job markets with a strong presence of multinational employers.`,
  ],
  Netherlands: [
    `The Netherlands is renowned for its internationally oriented universities, high proportion of English-taught programmes, and progressive approach to education and innovation. International graduates can apply for an orientation permit allowing one year to seek employment in the Dutch market, and those who find work in high-demand sectors gain access to favourable visa pathways including the highly skilled migrant visa. The Netherlands' location in the heart of Europe and its world-class infrastructure make it an excellent base for careers with international scope.`,
    `Studying in the Netherlands offers Indian students a high-quality, English-taught education in an open, diverse academic environment with strong European career connectivity. Many Dutch universities have deep industry ties with global companies in logistics, agriculture, technology, and financial services, providing students with internship and graduate placement opportunities. The Dutch orientation permit allows one year of job-seeking after graduation, and the country's highly skilled migrant visa pathway supports longer-term professional development.`,
    `The Netherlands is one of Europe's most internationally minded higher education destinations, with a high proportion of degree programmes taught in English and a culture of open inquiry and practical learning. Dutch graduates benefit from access to the broader EU job market and a domestic economy that punches well above its weight in technology, maritime industries, agri-food, and chemical engineering. An orientation year after graduation provides time to establish professional connections in a country that consistently ranks among the world's best for quality of life.`,
  ],
  Singapore: [
    `Singapore is Asia's premier education and business hub, offering world-class universities, a dynamic economy, and exceptional career opportunities in finance, technology, logistics, and life sciences. International graduates in Singapore benefit from one of the most competitive graduate job markets in Asia, with high salaries and access to a region of over three billion people. Singapore's strategic position as a gateway to Southeast Asia makes it an ideal location for graduates seeking careers with regional scope in some of the world's fastest-growing economies.`,
    `Studying in Singapore provides access to a globally respected education system and one of the world's most competitive and well-connected job markets. Singapore hosts the regional headquarters of many of the world's largest banks, technology companies, and trading firms, making it an exceptional launchpad for careers in finance, consulting, technology, and international trade. The Employment Pass and S Pass systems support qualified international graduates in securing professional employment, with career progression that frequently leads to long-term residency.`,
    `Singapore's universities have risen rapidly in global rankings and are now recognised as among the best in Asia and the world. The city-state's strategic location, business-friendly environment, and exceptional quality of life attract graduates from across the globe. Indian graduates are particularly well represented in Singapore's professional workforce, and the country's large Indian community provides a supportive social environment alongside strong professional networks in technology, banking, law, and consulting.`,
  ],
  'New Zealand': [
    `New Zealand offers a welcoming immigration environment, high quality of life, and internationally respected universities in a natural environment of extraordinary beauty. International graduates are eligible for a post-study work visa of one to three years depending on their qualification level, and New Zealand's skilled migrant pathway provides an accessible route to permanent residency for graduates who secure employment. The country's growing technology, agri-tech, healthcare, and tourism sectors offer genuine career opportunities for international graduates.`,
    `For Indian students, New Zealand combines academic quality with a relatively accessible immigration system and a safe, multicultural society. Post-study work visas allow graduates to work for one to three years in New Zealand after completing their degree, and skilled employment during this period supports applications for permanent residency through the Skilled Migrant Category. New Zealand's cities — Auckland, Wellington, and Christchurch — offer good employment markets and a high standard of living at a lower cost than comparable destinations.`,
    `New Zealand's universities are recognised internationally for research quality and graduate preparedness, and the country's immigration policies are among the more accessible for skilled graduates seeking pathways to permanent residency. The post-study work visa provides one to three years of full work rights after graduation, giving graduates time to develop local professional experience. New Zealand's focus on sustainability, innovation, and environmental technology creates distinctive career pathways for graduates in science, engineering, and related fields.`,
  ],
  UAE: [
    `The UAE — and Dubai in particular — has developed into a world-class hub for education, business, and innovation, hosting campuses of prestigious international universities alongside a thriving economy that attracts global talent. Graduates in the UAE gain exposure to one of the world's fastest-growing business environments, with opportunities in real estate, finance, logistics, hospitality, healthcare, and technology. The UAE's tax-free salaries, modern infrastructure, and cosmopolitan society make it a compelling destination for Indian students seeking regional career opportunities.`,
    `Studying in the UAE provides Indian students with an internationally recognised qualification within a business-friendly, tax-free environment. Dubai and Abu Dhabi host international branches of many of the world's leading universities and are home to the regional operations of hundreds of multinational companies. Graduates who secure employment in the UAE benefit from competitive tax-free salaries and a cultural environment in which Indian professionals are well represented in senior roles across business, healthcare, engineering, and the creative industries.`,
    `The UAE offers a unique educational experience that combines international academic standards with direct exposure to one of the world's most dynamic business environments. Dubai and Abu Dhabi are major global cities with strong employment markets in sectors including financial services, logistics, real estate, healthcare, and advanced technology. Indian students benefit from a large and well-established professional community in the UAE, providing networking and career support across every major industry.`,
  ],
  Denmark: [
    `Denmark consistently ranks among the world's happiest countries and offers a progressive higher education system with strong emphasis on student autonomy and interdisciplinary thinking. Danish universities are internationally respected, particularly in engineering, design, life sciences, and social sciences, and programmes are frequently taught in English. International graduates can apply for a six-month job-seeker visa, and those who secure employment gain access to Denmark's well-regulated job market and its high standard of living. Denmark's technology and clean energy sectors are internationally competitive and actively seek skilled international graduates.`,
    `Studying in Denmark provides access to a world-class, tuition-free (for EU students; modest fees for non-EU students) education system in one of Europe's most innovative and liveable countries. Danish universities have deep industry partnerships, particularly in renewable energy, biotech, shipping, and design, creating strong internship and graduate employment opportunities. The Positive List scheme makes it easier for graduates in shortage fields to obtain work permits in Denmark, and the country's EU membership provides broader European career access.`,
    `Denmark's higher education system is internationally recognised for its research quality, innovative teaching methods, and graduate outcomes. For Indian students, Denmark offers a distinctive academic environment that emphasises critical thinking, collaborative learning, and project-based work. The country's green economy, engineering excellence, and Scandinavian quality of life make it an increasingly attractive destination. Post-graduation, Denmark's job-seeker visa allows time to find employment in a well-regulated, high-wage labour market.`,
  ],
  Sweden: [
    `Sweden is home to several world-class universities and a highly innovative economy, particularly strong in engineering, life sciences, music, gaming, and environmental technology. Tuition fees apply to non-EU international students, but Sweden offers a supportive academic environment with high quality of life. Graduates may apply for a six-month job-seeker permit, and those securing professional employment can progress toward longer-term residency. Sweden's global companies — including Volvo, Ericsson, Spotify, and IKEA — are active graduate recruiters, as are the country's growing technology and health-tech sectors.`,
    `Studying in Sweden offers Indian students access to internationally respected universities in a country that punches well above its weight in innovation, design, and sustainability. Swedish universities are known for a practical, project-based approach to learning that develops graduates ready for immediate professional impact. Major cities Stockholm, Gothenburg, and Malmö host dynamic job markets, and Sweden's EU membership provides pathways into the wider European employment landscape for graduates who establish themselves professionally in Sweden.`,
    `Sweden's academic culture of independent thinking, sustainability, and collaborative innovation distinguishes it from many other study destinations. The country's technology, pharmaceutical, automotive, and media industries are internationally competitive, and graduates with Swedish credentials are well regarded across Europe. The job-seeker visa pathway and Sweden's structured skilled worker visa make it feasible for international graduates to build long-term careers in a country with high wages, strong worker protections, and an exceptional quality of life.`,
  ],
  France: [
    `France is home to some of the world's most prestigious engineering schools (Grandes Écoles), business schools, and research universities, with globally recognised programmes in engineering, management, fashion, gastronomy, and the arts. For Indian students, France offers a unique combination of academic excellence and cultural richness. The Autorisation Provisoire de Séjour (APS) allows international graduates to remain in France for 12 months to seek employment, and those securing jobs in France can transition to a talent passport or skilled worker visa with a pathway to permanent residency.`,
    `France combines world-class higher education with a high quality of life, world-renowned cuisine, and access to the broader European job market. French universities and Grandes Écoles are particularly respected in engineering, mathematics, management, and the luxury and creative industries. International graduates benefit from a 12-month post-study permit to find employment in France, and proficiency in French (in addition to English) significantly expands career opportunities in a wide range of sectors.`,
    `Studying in France opens doors to a rich academic tradition and access to one of Europe's largest economies. French engineering schools and business schools are globally respected, and the country's technology, aerospace, luxury goods, and pharmaceutical industries are internationally significant. For Indian students comfortable with a bilingual environment, France offers an intellectually stimulating, culturally enriching study experience alongside strong European career connectivity.`,
  ],
  Italy: [
    `Italy combines a centuries-long tradition of academic excellence with world-leading industries in fashion, design, automotive, luxury goods, and engineering. For Indian students, Italy offers internationally respected universities — particularly strong in architecture, engineering, and the arts — with a relatively accessible immigration framework. Graduates can apply for a one-year job-seeker permit, and Italy's booming technology sector and strong manufacturing industries offer genuine career opportunities for skilled international graduates.`,
    `Studying in Italy provides access to some of Europe's oldest and most respected universities alongside a rich cultural environment. Italian universities in Milan, Rome, Turin, and Bologna are particularly strong in engineering, architecture, design, and business, and several offer English-taught programmes attractive to international students. Italy's position within the EU provides access to the broader European job market, and the country's growing technology and innovation hubs offer increasing opportunities for internationally qualified graduates.`,
    `Italy's higher education system has evolved significantly, with major universities now offering world-class programmes in English across engineering, management, and the sciences. The country's renowned expertise in design, automotive engineering, and industrial innovation makes it an exceptional destination for students in these fields. Italian graduates gain access to a culturally rich country with a vibrant startup ecosystem in Milan and Turin, EU working rights, and strong connections to global luxury and industrial brands.`,
  ],
  Spain: [
    `Spain offers a dynamic academic environment within the European Union, with internationally respected business schools, engineering faculties, and arts programmes. Barcelona and Madrid are major European business cities with active tech startup ecosystems, and Spain's position within the EU provides graduates with European working rights. International graduates can apply for a post-study job-seeker authorisation, and Spain's growing technology, tourism, and renewable energy sectors create career pathways for qualified graduates.`,
    `Studying in Spain combines high-quality education with an exceptional quality of life in one of Europe's most culturally vibrant countries. Spanish universities — and particularly its internationally ranked business schools such as IESE and ESADE — are globally respected, and many programmes are offered in English. Barcelona and Madrid attract increasing numbers of international companies, providing a dynamic job market for graduates with international credentials and multilingual skills.`,
    `Spain offers Indian students access to internationally recognised higher education within an EU framework, alongside a rich cultural experience and a rapidly modernising economy. Spanish business schools are among the most respected in Europe, and the country's growing technology sector — centred on Barcelona and Madrid — creates strong opportunities for graduates in digital, engineering, and business disciplines. EU residency rights and the broadly accessible post-study immigration framework make Spain an increasingly attractive long-term destination.`,
  ],
  'South Korea': [
    `South Korea has invested heavily in its higher education system and is now home to globally ranked universities with strengths in technology, engineering, and business. The Korean economy, dominated by world-leading conglomerates in electronics, automotive, and shipbuilding, creates strong demand for internationally qualified graduates. Korea offers competitive graduate salaries and a post-study job-seeking framework that enables international graduates to explore the Korean job market, while also providing a gateway to broader careers across East Asia.`,
    `Studying in South Korea offers access to world-class technical and business education in one of Asia's most innovative economies. Korean universities have risen rapidly in global rankings and are particularly strong in engineering, computer science, and business management. Graduates benefit from exposure to Korea's globally significant technology and manufacturing industries, with companies such as Samsung, LG, Hyundai, and SK providing major recruitment pipelines for international graduates.`,
    `South Korea's dynamic economy and rapidly rising universities make it an increasingly attractive destination for Indian students in STEM and business. The country's investment in artificial intelligence, semiconductor technology, and advanced manufacturing creates strong demand for skilled graduates. An active Indian professional community in Korea, combined with increasing numbers of English-taught programmes, is making Korea a compelling alternative to traditional anglophone study destinations.`,
  ],
  Japan: [
    `Japan offers Indian students access to world-class research universities, a technologically advanced society, and a job market with genuine demand for internationally qualified graduates in engineering, technology, and business. Japanese universities rank highly in engineering, materials science, and robotics, reflecting the country's industrial excellence. The post-graduation visa framework allows international graduates to seek employment in Japan, where competitive salaries and a global business culture provide strong career development opportunities.`,
    `Studying in Japan provides access to some of Asia's most respected research institutions and a unique cultural environment that values precision, craftsmanship, and continuous improvement. Japanese industries in automotive engineering, robotics, precision manufacturing, and electronics are globally significant, and qualified international graduates are increasingly sought after as Japan's talent shortage grows. Post-graduation, international students can obtain a designated activities visa to seek employment in Japan.`,
    `Japan's higher education institutions are internationally recognised, particularly in engineering, natural sciences, and applied mathematics. The country's advanced industrial economy — home to global leaders in automotive, robotics, consumer electronics, and pharmaceuticals — creates strong graduate career opportunities for technically skilled international students. Japan's structured post-study immigration framework supports qualified graduates in transitioning into the Japanese job market.`,
  ],
};

function generateWhyStudy(country: string, uniName: string, pgwp?: boolean, variation?: number): string {
  const countryKey = Object.keys(countryWhy).find(k =>
    country.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(country.toLowerCase())
  ) || 'default';

  const texts = countryWhy[countryKey] || [
    `${country} is home to internationally respected universities and a growing economy that creates strong demand for internationally qualified graduates. Students at ${uniName} benefit from a high-quality educational environment, access to industry networks, and the opportunity to build a professional profile in a globally connected job market.`,
  ];

  const idx = ((variation || 0) + (uniName.charCodeAt(0) || 0)) % texts.length;
  return texts[idx];
}

// ─── Requirements ─────────────────────────────────────────────────────────────

function generateRequirements(course: CourseForContent, intakes: string): string[] {
  const level = course.level.toLowerCase();
  const isMasters = level.includes('master') || level.includes('msc') || level.includes('mba') || level.includes('meng');
  const isBachelors = level.includes('bachelor') || level.includes('bsc') || level.includes('beng') || level.includes('ba ');
  const isPhD = level.includes('phd') || level.includes('doctorate') || level.includes('doctoral');

  const academicReq = isPhD
    ? `Masters degree (or equivalent) in a relevant field with strong research component or thesis`
    : isMasters
    ? `Bachelor's degree (minimum 55–60% or equivalent GPA) in a relevant subject area`
    : isBachelors
    ? `10+2 (Higher Secondary) with minimum 60–70% in relevant subjects (Science/Commerce as applicable)`
    : `Relevant academic qualification at the appropriate level; contact Jaivik Overseas for details`;

  const workExp = (level.includes('mba') || level.includes('business administration'))
    ? `Work experience: 2–3 years of relevant professional experience recommended for MBA programmes`
    : null;

  const docs = [
    `Academic transcripts: Attested/notarised copies of all marksheets and degree certificates`,
    `Statement of Purpose (SOP): 500–1,000 words outlining your academic background, career goals, and motivation for this programme`,
    `Letters of Recommendation (LORs): Typically 2–3 academic or professional referees`,
    `Valid passport with at least 18 months of validity`,
    `English language test scores: IELTS/TOEFL/PTE Academic (not more than 2 years old at time of application)`,
  ];

  const deadline = `Application deadline: Typically 3–6 months before the ${intakes} intake; early applications are strongly advised`;

  const reqs = [
    `IELTS Academic: Minimum ${course.ieltsMin} overall (no individual band below 5.5 for most programmes)`,
    `TOEFL iBT: Minimum ${course.toeflMin} (with section minimums varying by department)`,
    course.pteMin ? `PTE Academic: Minimum ${course.pteMin} (no communicative skill below 42)` : null,
    academicReq,
    workExp,
    `Intake: ${intakes} — early application recommended to secure scholarship consideration`,
    deadline,
    ...docs,
  ].filter(Boolean) as string[];

  return reqs;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function generateCourseContent(
  course: CourseForContent,
  universityName: string,
  universitySlug: string
): GeneratedContent {
  const field = detectField(course.name);
  const city = course.city || 'the university campus';
  const intakes = course.intakeMonths.join(' and ');
  const variation = v(course.name, universityName, 4);
  const feeINRLakh = (course.annualINR / 100000).toFixed(1);

  const levelLabel = course.level;
  const studyLevelLabel = course.studyLevel || course.level;

  // ─── About ───────────────────────────────────────────────────────────────
  const fieldTexts = fieldAbout[field];
  const fieldPara = fieldTexts[variation % fieldTexts.length];

  const intros = [
    `The ${course.name} at ${universityName} is a ${levelLabel} programme offered at the ${course.campus} in ${city}, ${course.country}. Running for ${course.duration} on a full-time basis, this ${studyLevelLabel.toLowerCase()} qualification is designed for students who want to develop advanced expertise and build a strong professional foundation in a globally relevant field.`,
    `${universityName}'s ${course.name} is a ${course.duration} ${levelLabel} programme based at ${city}, ${course.country}. The programme accepts students into its ${intakes} intake${course.intakeMonths.length > 1 ? 's' : ''} and provides a structured pathway from foundational principles through to professional-level competency and research capability.`,
    `Offered at ${universityName}'s ${course.campus} in ${city}, the ${course.name} is a ${course.duration} full-time ${levelLabel} programme in ${course.country}. With ${intakes} entry, the programme attracts a diverse cohort of students from ${course.country} and internationally, creating a rich collaborative learning environment.`,
    `The ${course.name} is delivered over ${course.duration} at ${universityName}'s ${course.campus} in ${city}, ${course.country}. This ${levelLabel} programme is designed to provide students with a comprehensive, career-relevant education that combines academic rigour with practical skills development.`,
  ];

  const closingAbout = [
    ` Annual tuition fees are approximately ₹${feeINRLakh} lakh, and Jaivik Overseas Consultants can assist Indian students with admissions, documentation, and scholarship identification throughout the application process.`,
    ` The programme fee is approximately ₹${feeINRLakh} lakh per year for international students. Jaivik Overseas Consultants provides end-to-end support for Indian students applying to ${universityName}, including documentation, SOP preparation, and visa guidance.`,
    ` With an annual tuition fee of approximately ₹${feeINRLakh} lakh, this programme represents strong value for Indian students seeking internationally recognised qualifications. Jaivik Overseas Consultants supports students through every step, from shortlisting to visa approval.`,
    ` The annual programme fee for international students is approximately ₹${feeINRLakh} lakh. Jaivik Overseas Consultants has assisted hundreds of Indian students in securing admission to ${universityName} and can provide personalised guidance on scholarships, financial planning, and the application process.`,
  ];

  const about = intros[variation % intros.length] + '\n\n' + fieldPara + closingAbout[variation % closingAbout.length];

  // ─── Career Outcomes ──────────────────────────────────────────────────────
  const careerOutcomes = generateCareer(course, universityName, field, variation);

  // ─── Why Study Here ───────────────────────────────────────────────────────
  const whyStudyHere = generateWhyStudy(course.country, universityName, course.pgwp, variation);

  // ─── Requirements ────────────────────────────────────────────────────────
  const requirements = generateRequirements(course, intakes);

  return { about, careerOutcomes, whyStudyHere, requirements };
}
