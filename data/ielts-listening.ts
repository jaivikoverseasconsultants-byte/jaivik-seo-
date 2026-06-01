export type ListeningQuestionType = 'mcq' | 'fill' | 'matching';

export interface ListeningQuestion {
  id: number;
  type: ListeningQuestionType;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

export interface ListeningSection {
  id: number;
  title: string;
  scenario: string;
  transcript: string;
  questions: ListeningQuestion[];
}

export interface ListeningTest {
  level: string;
  timeMinutes: number;
  bandTarget: string;
  sections: ListeningSection[];
}

export function calcListeningBand(score: number): string {
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
  return '3.5';
}

// ─── BEGINNER ────────────────────────────────────────────────────────────────
const beginnerListening: ListeningTest = {
  level: 'beginner',
  timeMinutes: 30,
  bandTarget: '4.0 – 5.5',
  sections: [
    {
      id: 1,
      title: 'Hotel Booking',
      scenario: 'A person is calling a hotel to make a reservation.',
      transcript: `Receptionist: Good afternoon, Sunrise Hotel. How can I help you?
Customer: Hello, I'd like to book a room, please.
Receptionist: Of course. What dates would you like?
Customer: From the 15th to the 18th of March.
Receptionist: That's three nights. What type of room would you prefer — single, double, or twin?
Customer: A double room, please. With a sea view if possible.
Receptionist: Let me check... Yes, we have a double room with sea view available. It's £95 per night.
Customer: That's fine. Does the price include breakfast?
Receptionist: Yes, breakfast is included. It's served from 7 to 10 am in the restaurant on the ground floor.
Customer: Perfect. Could I also request a late checkout? I have a flight at 4 pm.
Receptionist: We can arrange a 1 pm checkout for an extra £20.
Customer: That works. My name is James Cooper.
Receptionist: Could you spell the surname, please?
Customer: C-O-O-P-E-R.
Receptionist: Thank you, Mr. Cooper. And a contact number?
Customer: 07721 445 893.
Receptionist: Great. I'll also need a credit card to hold the booking.
Customer: Of course. It's a Visa card, number 4782 9900 1123 0054.
Receptionist: Thank you. Your booking is confirmed. Is there anything else?
Customer: Yes — is there parking at the hotel?
Receptionist: Yes, free parking is available on the hotel grounds. You just need to register your car number at reception.
Customer: Brilliant. Thank you very much.
Receptionist: You're welcome. We look forward to seeing you on the 15th.`,
      questions: [
        { id: 1, type: 'fill', question: 'The customer wants to stay from the 15th to the ______ of March.', answer: '18th', explanation: 'The customer says "From the 15th to the 18th of March."' },
        { id: 2, type: 'mcq', question: 'What type of room does the customer book?', options: ['Single room', 'Double room with sea view', 'Twin room', 'Double room without view'], answer: 'Double room with sea view', explanation: 'The customer asks for a double room with a sea view.' },
        { id: 3, type: 'fill', question: 'The room costs £______ per night.', answer: '95', explanation: 'The receptionist says it\'s £95 per night.' },
        { id: 4, type: 'mcq', question: 'What time is breakfast served?', options: ['6 to 9 am', '7 to 10 am', '8 to 11 am', '7 to 9 am'], answer: '7 to 10 am', explanation: 'The receptionist says breakfast is served from 7 to 10 am.' },
        { id: 5, type: 'fill', question: 'A late checkout until 1 pm costs an extra £______.', answer: '20', explanation: 'The receptionist says a 1 pm checkout is £20 extra.' },
        { id: 6, type: 'fill', question: 'The customer\'s surname is ______.', answer: 'Cooper', explanation: 'The customer spells out C-O-O-P-E-R.' },
        { id: 7, type: 'fill', question: 'The customer\'s phone number is 07721 445 ______.', answer: '893', explanation: 'The customer gives 07721 445 893.' },
        { id: 8, type: 'mcq', question: 'What type of credit card does the customer use?', options: ['Mastercard', 'American Express', 'Visa', 'Discover'], answer: 'Visa', explanation: 'The customer says "It\'s a Visa card."' },
        { id: 9, type: 'mcq', question: 'What is the cost of parking at the hotel?', options: ['£5 per night', '£10 per day', 'Free', '£15 per night'], answer: 'Free', explanation: 'The receptionist says "free parking is available on the hotel grounds."' },
        { id: 10, type: 'fill', question: 'Guests need to register their ______ number at reception for parking.', answer: 'car', explanation: 'The receptionist says you need to register your car number at reception.' },
      ],
    },
    {
      id: 2,
      title: 'Community Centre Activities',
      scenario: 'Two friends are discussing activities at a local community centre.',
      transcript: `Anna: Hey Tom, have you seen the new timetable for the community centre?
Tom: No, I haven't. What's new this term?
Anna: They've added a lot more classes. On Monday evenings, there's a yoga class at 6:30.
Tom: Oh, I've always wanted to try yoga. How long is the class?
Anna: It's 90 minutes. The instructor is called Ms. Patel. She's trained in Hatha yoga.
Tom: What about swimming? I used to go every Tuesday.
Anna: Swimming is still on. Tuesday mornings from 8 to 9 and Thursday evenings from 7 to 8.
Tom: Great! I'll stick to Tuesdays. What about something more social? I want to meet new people.
Anna: There's a photography club on Wednesday at 5 pm. You bring your own camera, but they have some equipment to borrow.
Tom: I don't have a camera, though.
Anna: You can use your phone — the instructor says it's perfectly fine.
Tom: Cool. What about the weekend?
Anna: On Saturdays there's a cooking class. It's very popular — you need to register at least two weeks in advance.
Tom: What kind of cooking?
Anna: This term it's Asian cuisine. They're focusing on Thai and Japanese dishes.
Tom: That sounds amazing. How much does it cost?
Anna: The cooking class is £12 per session. The photography club is free for members, and yoga is £8 per class.
Tom: I think I'll join yoga and the photography club.
Anna: Good choices! You can sign up online or at the reception desk.`,
      questions: [
        { id: 11, type: 'fill', question: 'The yoga class is on Monday evenings at ______.', answer: '6:30', explanation: 'Anna says the yoga class is at 6:30 on Monday evenings.' },
        { id: 12, type: 'fill', question: 'The yoga class lasts ______ minutes.', answer: '90', explanation: 'Anna says "It\'s 90 minutes."' },
        { id: 13, type: 'mcq', question: 'What style of yoga does Ms. Patel teach?', options: ['Vinyasa', 'Ashtanga', 'Hatha', 'Kundalini'], answer: 'Hatha', explanation: 'Anna says Ms. Patel is trained in Hatha yoga.' },
        { id: 14, type: 'mcq', question: 'On which days is swimming available?', options: ['Monday and Wednesday', 'Tuesday and Thursday', 'Wednesday and Friday', 'Tuesday and Friday'], answer: 'Tuesday and Thursday', explanation: 'Anna says swimming is on Tuesday mornings and Thursday evenings.' },
        { id: 15, type: 'fill', question: 'The photography club meets on ______ at 5 pm.', answer: 'Wednesday', explanation: 'Anna says "There\'s a photography club on Wednesday at 5 pm."' },
        { id: 16, type: 'mcq', question: 'What can members borrow at the photography club?', options: ['Phones', 'Computers', 'Camera equipment', 'Tripods only'], answer: 'Camera equipment', explanation: 'Anna says they have some equipment to borrow.' },
        { id: 17, type: 'mcq', question: 'How far in advance must you register for the cooking class?', options: ['One week', 'Two weeks', 'Three weeks', 'One month'], answer: 'Two weeks', explanation: 'Anna says "you need to register at least two weeks in advance."' },
        { id: 18, type: 'fill', question: 'The cooking class this term focuses on ______ cuisine.', answer: 'Asian', explanation: 'Anna says "This term it\'s Asian cuisine."' },
        { id: 19, type: 'fill', question: 'The yoga class costs £______ per session.', answer: '8', explanation: 'Anna says "yoga is £8 per class."' },
        { id: 20, type: 'mcq', question: 'How can you sign up for classes?', options: ['By phone only', 'Online or at reception', 'By email only', 'In person only'], answer: 'Online or at reception', explanation: 'Anna says "You can sign up online or at the reception desk."' },
      ],
    },
    {
      id: 3,
      title: 'University Library Orientation',
      scenario: 'A university librarian is giving an orientation to new students.',
      transcript: `Librarian: Welcome, everyone, to the main university library. My name is David Chen and I'll be guiding you through our facilities today. Let's start with the basics.
The library is open Monday to Friday from 8 am to 10 pm, and on weekends from 10 am to 6 pm. During exam periods, we extend our hours to midnight on weekdays.
Our collection has over 200,000 books, 15,000 journals, and access to 50 online databases. You can search for any item using the online catalogue at library.university.edu. Each student is issued a library card at registration. If you lose it, there's a £5 replacement fee.
With your student card, you can borrow up to 10 books at a time for three weeks. DVDs and special collections can only be borrowed for one week. The fine for overdue books is 20 pence per day. For DVDs and special items, the fine is £1 per day.
On the ground floor, you'll find the main reading area with 200 study seats. Silence must be maintained throughout. On the first floor, we have group study rooms. There are 12 rooms, each holding between 4 and 8 students. You can book them online for up to two hours at a time.
The computer suite on the second floor has 80 workstations and is available on a first-come, first-served basis. Printing costs 5 pence per page for black and white, and 20 pence for colour.
If you need research assistance, our librarians hold drop-in sessions every Tuesday and Thursday from 2 to 4 pm at the information desk. You can also book a one-to-one appointment via email.
Any questions before we continue the tour?`,
      questions: [
        { id: 21, type: 'fill', question: 'On weekends, the library opens at ______ am.', answer: '10', explanation: 'The librarian says the library is open on weekends from 10 am to 6 pm.' },
        { id: 22, type: 'fill', question: 'During exam periods, the library stays open until ______ on weekdays.', answer: 'midnight', explanation: 'The librarian says they extend hours to midnight on weekdays during exams.' },
        { id: 23, type: 'mcq', question: 'How many online databases does the library provide access to?', options: ['15', '50', '200', '200,000'], answer: '50', explanation: 'The librarian says access to 50 online databases.' },
        { id: 24, type: 'fill', question: 'The fee for replacing a lost library card is £______.', answer: '5', explanation: 'The librarian says there\'s a £5 replacement fee.' },
        { id: 25, type: 'fill', question: 'Students can borrow up to ______ books at a time.', answer: '10', explanation: 'The librarian says students can borrow up to 10 books.' },
        { id: 26, type: 'mcq', question: 'How long can DVDs be borrowed?', options: ['Three weeks', 'Two weeks', 'One week', 'Four days'], answer: 'One week', explanation: 'The librarian says DVDs can only be borrowed for one week.' },
        { id: 27, type: 'fill', question: 'The fine for overdue books is ______ pence per day.', answer: '20', explanation: 'The librarian says the fine is 20 pence per day.' },
        { id: 28, type: 'fill', question: 'There are ______ group study rooms on the first floor.', answer: '12', explanation: 'The librarian says there are 12 rooms on the first floor.' },
        { id: 29, type: 'mcq', question: 'How much does colour printing cost per page?', options: ['5 pence', '10 pence', '20 pence', '25 pence'], answer: '20 pence', explanation: 'The librarian says colour printing is 20 pence per page.' },
        { id: 30, type: 'mcq', question: 'When are librarian drop-in sessions held?', options: ['Monday and Wednesday', 'Tuesday and Thursday', 'Wednesday and Friday', 'Monday and Friday'], answer: 'Tuesday and Thursday', explanation: 'The librarian says drop-in sessions are every Tuesday and Thursday from 2 to 4 pm.' },
      ],
    },
    {
      id: 4,
      title: 'Recycling and Waste Management Talk',
      scenario: 'A council officer is giving a talk to residents about recycling.',
      transcript: `Officer: Good evening, residents. Thank you for coming to tonight's information session about our new recycling programme. I'm Sandra Blake from the Environmental Services Department.
From next month, we'll be introducing a four-bin system. The green bin is for garden waste — grass cuttings, leaves, small branches. The blue bin is for paper and cardboard. The yellow bin is for glass, tins, and plastic bottles. And the black bin is for general waste that can't be recycled.
Collections will be on a rotating schedule. The black bin is collected every week. The blue and yellow bins are collected every two weeks, alternating. The green bin is collected monthly from April to October only — during winter months, garden waste collection is suspended.
A few important rules: Please rinse food containers before putting them in the recycling bins. Cardboard should be flattened to save space. Broken glass must be wrapped in newspaper before disposal — do not put it loose in the bin.
Items that cannot go in any bin include electrical appliances, large furniture, mattresses, and hazardous waste like paint or chemicals. For these, you can book a collection with the council — there's no charge for up to two large items per year.
The Recycling Centre on Park Road is open Tuesday to Sunday from 8 am to 5 pm. You'll need to bring photo ID and proof of address when you visit.
We're hoping to reduce overall waste by 30% by the end of this year. Last year, our recycling rate was 42%. The national average is 45%, so we have some way to go, but with your help, I'm confident we can exceed the target.
For more information, visit our website or call 0800 112 3456. Thank you.`,
      questions: [
        { id: 31, type: 'matching', question: 'Match: Blue bin is used for:', options: ['Garden waste', 'Paper and cardboard', 'Glass and tins', 'General waste'], answer: 'Paper and cardboard', explanation: 'The officer says the blue bin is for paper and cardboard.' },
        { id: 32, type: 'matching', question: 'Match: Yellow bin is used for:', options: ['Garden waste', 'Paper and cardboard', 'Glass, tins, and plastic bottles', 'General waste'], answer: 'Glass, tins, and plastic bottles', explanation: 'The officer says the yellow bin is for glass, tins, and plastic bottles.' },
        { id: 33, type: 'mcq', question: 'How often is the black bin collected?', options: ['Every week', 'Every two weeks', 'Monthly', 'Twice a week'], answer: 'Every week', explanation: 'The officer says the black bin is collected every week.' },
        { id: 34, type: 'fill', question: 'The green bin is only collected from April to ______.', answer: 'October', explanation: 'The officer says garden waste collection runs from April to October.' },
        { id: 35, type: 'mcq', question: 'How should broken glass be disposed of?', options: ['Put directly in yellow bin', 'Wrapped in newspaper', 'In a sealed plastic bag', 'In the black bin'], answer: 'Wrapped in newspaper', explanation: 'The officer says broken glass must be wrapped in newspaper.' },
        { id: 36, type: 'fill', question: 'Large items can be collected by the council for free up to ______ times per year.', answer: '2', explanation: 'The officer says there\'s no charge for up to two large items per year.' },
        { id: 37, type: 'fill', question: 'The Recycling Centre is on ______ Road.', answer: 'Park', explanation: 'The officer says the Recycling Centre is on Park Road.' },
        { id: 38, type: 'mcq', question: 'What documents are needed to visit the Recycling Centre?', options: ['Student ID and passport', 'Photo ID and proof of address', 'Council tax bill only', 'No documents needed'], answer: 'Photo ID and proof of address', explanation: 'The officer says you need photo ID and proof of address.' },
        { id: 39, type: 'fill', question: 'Last year\'s recycling rate was ______%.', answer: '42', explanation: 'The officer says last year the recycling rate was 42%.' },
        { id: 40, type: 'fill', question: 'The helpline number is 0800 112 ______.', answer: '3456', explanation: 'The officer gives the number 0800 112 3456.' },
      ],
    },
  ],
};

// ─── INTERMEDIATE ─────────────────────────────────────────────────────────────
const intermediateListening: ListeningTest = {
  level: 'intermediate',
  timeMinutes: 30,
  bandTarget: '5.5 – 7.0',
  sections: [
    {
      id: 1,
      title: 'Flat Rental Enquiry',
      scenario: 'A student is calling a letting agency to enquire about renting a flat.',
      transcript: `Agent: Good morning, City Lettings, Sophie speaking. How can I help?
Student: Hello. I saw your listing for the two-bedroom flat on Granville Street. I'm looking to rent from September.
Agent: Yes, that one's still available. It's on the third floor of a Victorian conversion. The monthly rent is £1,350, and that includes water rates but not gas and electricity.
Student: And how much is the deposit?
Agent: It's six weeks' rent as a holding deposit, so that would be £1,850. This is fully refundable at the end of the tenancy, provided there's no damage.
Student: Is there a minimum tenancy period?
Agent: Yes, we usually ask for a 12-month initial tenancy with a six-month break clause, so you can leave after six months if needed.
Student: What's included in the flat? Is there white goods?
Agent: The kitchen is fully fitted — there's a dishwasher, fridge-freezer, washing machine, and an electric hob and oven. The bedrooms are unfurnished, but the living area has a sofa and coffee table.
Student: Is there parking?
Agent: There's no dedicated parking, but there's a resident permit zone on the street. You'd need to apply to the council for a permit. Currently the wait is about three months.
Student: What about internet?
Agent: There's no contract currently in place, so you'd need to set that up yourself. BT and Virgin both have coverage in that area.
Student: And pets — we have a small cat.
Agent: The landlord usually says no, but for a small indoor cat, he might consider it with an additional deposit of £200.
Student: That's helpful. Could I arrange a viewing?
Agent: Of course. We have slots this Thursday at 5:30 pm or Saturday morning at 10 am.
Student: Thursday at 5:30 would be perfect.
Agent: Great. Could I take your name and number?
Student: It's Priya Sharma. My number is 07853 661 204.
Agent: Thank you, Priya. We'll see you Thursday.`,
      questions: [
        { id: 1, type: 'fill', question: 'The flat is on the ______ floor.', answer: 'third', explanation: 'The agent says it\'s on the third floor.' },
        { id: 2, type: 'fill', question: 'The monthly rent is £______.', answer: '1,350', explanation: 'The agent says the monthly rent is £1,350.' },
        { id: 3, type: 'mcq', question: 'What is NOT included in the rent?', options: ['Water rates', 'Gas and electricity', 'Building maintenance', 'Post box'], answer: 'Gas and electricity', explanation: 'The agent says rent includes water but not gas and electricity.' },
        { id: 4, type: 'fill', question: 'The holding deposit is £______.', answer: '1,850', explanation: 'Six weeks\' rent at £1,350 = £1,850.' },
        { id: 5, type: 'fill', question: 'The minimum tenancy is ______ months, with a break clause after 6 months.', answer: '12', explanation: 'The agent says the initial tenancy is 12 months.' },
        { id: 6, type: 'mcq', question: 'What is NOT included in the kitchen?', options: ['Dishwasher', 'Microwave', 'Washing machine', 'Oven'], answer: 'Microwave', explanation: 'The agent lists dishwasher, fridge-freezer, washing machine, and hob/oven — no microwave.' },
        { id: 7, type: 'fill', question: 'The current wait for a parking permit is about ______ months.', answer: 'three', explanation: 'The agent says the wait is about three months.' },
        { id: 8, type: 'mcq', question: 'What extra deposit might be required for the cat?', options: ['£100', '£150', '£200', '£250'], answer: '£200', explanation: 'The agent says an additional deposit of £200 for the cat.' },
        { id: 9, type: 'fill', question: 'The viewing is scheduled for Thursday at ______ pm.', answer: '5:30', explanation: 'The student chooses Thursday at 5:30.' },
        { id: 10, type: 'fill', question: 'The student\'s phone number is 07853 661 ______.', answer: '204', explanation: 'The student gives 07853 661 204.' },
      ],
    },
    {
      id: 2,
      title: 'Travel Podcast Discussion',
      scenario: 'Two friends discuss sustainable travel options for a gap year.',
      transcript: `Host: Welcome back to the Wandering Minds podcast. Today I'm joined by Marco, who's just returned from a 6-month low-carbon trip around Southeast Asia. Marco, tell us about your journey.
Marco: Thanks for having me. The idea was to travel without flying at all. I started from London and took the Eurostar to Paris, then a series of trains through Europe and into Asia via the Trans-Siberian Railway.
Host: That sounds ambitious. How long did just getting to Asia take?
Marco: About 12 days from London to Vladivostok in Russia, then another three days by ferry to Osaka in Japan. It was exhausting but absolutely incredible.
Host: And the cost compared to flying?
Marco: It was actually more expensive for the first leg. The Trans-Siberian Railway cost around £400 for a second-class berth, and the ferry was another £180. A flight from London to Tokyo would have been maybe £500 return.
Host: But the environmental impact is so different.
Marco: Dramatically. A return flight from London to Tokyo produces about 1.7 tonnes of CO₂ per person. The train and ferry route produces roughly 0.2 tonnes — about 8 times less.
Host: What about within Southeast Asia — how did you get around?
Marco: Mostly overnight buses and local trains. In Vietnam, there's a brilliant coastal train service that runs the entire length of the country. In Thailand, night trains are amazingly comfortable and cheap — I paid around £15 for a sleeper from Bangkok to Chiang Mai.
Host: Any advice for people wanting to try this?
Marco: Plan flexibly and book trains in advance where possible, especially in Europe. Get a railpass for certain regions — it can save a lot. And be prepared for delays; they're part of the adventure. Also, the slower pace means you actually see the places you're passing through, which no flight can give you.
Host: Great advice. Thanks so much, Marco.`,
      questions: [
        { id: 11, type: 'fill', question: 'Marco travelled for ______ months in Southeast Asia.', answer: '6', explanation: 'The host says Marco just returned from a 6-month trip.' },
        { id: 12, type: 'fill', question: 'Marco took the Trans-Siberian Railway to ______.', answer: 'Vladivostok', explanation: 'Marco says he travelled to Vladivostok.' },
        { id: 13, type: 'fill', question: 'The ferry from Russia to Osaka took ______ days.', answer: 'three', explanation: 'Marco says another three days by ferry.' },
        { id: 14, type: 'mcq', question: 'How much did the Trans-Siberian Railway second-class berth cost?', options: ['£180', '£250', '£400', '£500'], answer: '£400', explanation: 'Marco says it cost around £400 for a second-class berth.' },
        { id: 15, type: 'fill', question: 'A return flight to Tokyo would produce about ______ tonnes of CO₂ per person.', answer: '1.7', explanation: 'Marco says a return flight produces about 1.7 tonnes of CO₂.' },
        { id: 16, type: 'mcq', question: 'The train and ferry route produces approximately how many times less CO₂ than flying?', options: ['4 times', '6 times', '8 times', '10 times'], answer: '8 times', explanation: 'Marco says roughly 8 times less CO₂.' },
        { id: 17, type: 'fill', question: 'In Vietnam, Marco used a coastal ______ service to travel the length of the country.', answer: 'train', explanation: 'Marco says there\'s a brilliant coastal train service in Vietnam.' },
        { id: 18, type: 'fill', question: 'The sleeper train from Bangkok to Chiang Mai cost around £______.', answer: '15', explanation: 'Marco says he paid around £15 for the sleeper.' },
        { id: 19, type: 'mcq', question: 'What does Marco recommend booking in advance?', options: ['Ferries and buses', 'Trains especially in Europe', 'Hotels and hostels', 'Bus passes'], answer: 'Trains especially in Europe', explanation: 'Marco says "book trains in advance where possible, especially in Europe."' },
        { id: 20, type: 'mcq', question: 'According to Marco, what advantage does slow travel offer over flying?', options: ['It is cheaper', 'It is faster to your destination', 'You see the places you pass through', 'You get more passport stamps'], answer: 'You see the places you pass through', explanation: 'Marco says "you actually see the places you\'re passing through, which no flight can give you."' },
      ],
    },
    {
      id: 3,
      title: 'University Course Selection Seminar',
      scenario: 'An academic advisor is running a seminar for second-year students choosing their third-year modules.',
      transcript: `Advisor: Right, let's get started. You're all here because you need to confirm your third-year module choices by the end of this week. I want to walk you through the process and highlight some important changes for this academic year.
First, a reminder that you must take a minimum of 120 credits. Your core modules — Research Methods and Professional Practice — together count for 40 credits and are compulsory. So you have 80 credits left to fill with optional modules.
This year, for the first time, we're introducing an industry placement module worth 20 credits. You complete eight weeks of work experience with a partner company and submit a reflective journal. I'd strongly recommend this if you're interested in going directly into employment after graduation. There are 30 places available, and the deadline to apply is the 10th of October.
Now, some of you have asked about the dissertation. To be eligible for a full dissertation, worth 40 credits, you need at least a 65% average in your second year. If you're below 65%, you can complete a smaller project worth 20 credits instead. The project has no grade prerequisite.
A note about timetabling conflicts: if you select modules that overlap, the system will flag it but won't block your registration. You'll need to resolve it manually with your personal tutor.
New this year: all module leaders have agreed to release draft reading lists by the 15th of September so you can familiarise yourself with materials before term starts.
Final reminder — your choices are not locked until the 15th of October. Until then, you can swap modules freely via the student portal. After that date, any changes require written approval from your year coordinator.
Any questions?`,
      questions: [
        { id: 21, type: 'fill', question: 'Students must take a minimum of ______ credits in third year.', answer: '120', explanation: 'The advisor says the minimum is 120 credits.' },
        { id: 22, type: 'fill', question: 'The two compulsory modules together count for ______ credits.', answer: '40', explanation: 'The advisor says Research Methods and Professional Practice together count for 40 credits.' },
        { id: 23, type: 'fill', question: 'The industry placement module is worth ______ credits.', answer: '20', explanation: 'The advisor says the placement module is worth 20 credits.' },
        { id: 24, type: 'fill', question: 'Students must complete ______ weeks of work experience for the placement module.', answer: 'eight', explanation: 'The advisor says "You complete eight weeks of work experience."' },
        { id: 25, type: 'fill', question: 'The deadline to apply for the industry placement is the ______ of October.', answer: '10th', explanation: 'The advisor says the deadline is the 10th of October.' },
        { id: 26, type: 'mcq', question: 'What grade average is required to do a full dissertation?', options: ['55%', '60%', '65%', '70%'], answer: '65%', explanation: 'The advisor says you need at least a 65% average.' },
        { id: 27, type: 'fill', question: 'Students below the grade threshold can complete a smaller project worth ______ credits.', answer: '20', explanation: 'The advisor says the project is worth 20 credits.' },
        { id: 28, type: 'mcq', question: 'What happens if two modules on a timetable conflict?', options: ['The system blocks registration', 'The student is automatically moved', 'The system flags it but allows registration', 'A tutor resolves it automatically'], answer: 'The system flags it but allows registration', explanation: 'The advisor says the system flags it but won\'t block registration.' },
        { id: 29, type: 'fill', question: 'Draft reading lists will be released by the ______ of September.', answer: '15th', explanation: 'The advisor says reading lists will be released by the 15th of September.' },
        { id: 30, type: 'fill', question: 'Module choices can be changed freely until the ______ of October.', answer: '15th', explanation: 'The advisor says choices are not locked until the 15th of October.' },
      ],
    },
    {
      id: 4,
      title: 'Climate Change Lecture Extract',
      scenario: 'A university lecturer is discussing the effects of climate change on agriculture.',
      transcript: `Lecturer: Today I want to focus on one of the most immediate threats posed by climate change — its impact on global food security. This is something that will affect every person on this planet within our lifetimes, and yet it receives far less attention than it deserves in mainstream debate.
Let's start with some numbers. According to the IPCC's latest report, for every 1°C increase in global mean temperature, we can expect a 5 to 10% reduction in crop yields for major staples like wheat, rice, and maize. Given that we're on course for at least a 2°C increase by 2100, that represents a potential 10 to 20% reduction in the world's primary food sources.
The effects, however, are not evenly distributed. Tropical and subtropical regions — much of Africa, South Asia, and Latin America — are disproportionately affected. These are also, critically, the regions with the highest rates of food insecurity already. In contrast, some northern regions like Canada and Russia may initially see increased yields as warming opens up new agricultural land. But this temporary gain won't compensate for global losses.
Three mechanisms are primarily responsible. First, heat stress during critical growth phases — particularly during pollination — directly reduces yield. Second, changing precipitation patterns are causing both more severe droughts and more intense flooding, disrupting planting seasons. Third, the spread of pests and diseases into previously cooler regions is introducing new challenges for farmers who lack the resources or knowledge to respond.
Adaptation strategies exist, but they require investment. Drought-resistant crop varieties have been developed — some strains of maize can now survive with 30% less water. Precision irrigation and smart farming technologies can reduce water use by up to 40%. But these technologies are predominantly accessible to large-scale commercial farms in wealthy countries.
The real challenge is reaching subsistence farmers — the 500 million small farms that produce 70% of the food consumed in developing countries. Without significant policy intervention and technology transfer, the gap between food-secure and food-insecure populations will widen considerably.`,
      questions: [
        { id: 31, type: 'fill', question: 'For every 1°C increase in temperature, crop yields may fall by ______ to 10%.', answer: '5', explanation: 'The lecturer says a 5 to 10% reduction per 1°C increase.' },
        { id: 32, type: 'mcq', question: 'Which regions are MOST affected by climate-related food insecurity?', options: ['Northern Europe and Canada', 'Tropical and subtropical regions', 'Russia and Scandinavia', 'Australia and New Zealand'], answer: 'Tropical and subtropical regions', explanation: 'The lecturer says tropical and subtropical regions are disproportionately affected.' },
        { id: 33, type: 'mcq', question: 'Which northern regions might initially BENEFIT from warming?', options: ['UK and France', 'Sweden and Norway', 'Canada and Russia', 'Germany and Poland'], answer: 'Canada and Russia', explanation: 'The lecturer says Canada and Russia may see increased yields initially.' },
        { id: 34, type: 'matching', question: 'First mechanism affecting crops: heat stress during ______ phase.', options: ['Growth', 'Pollination', 'Germination', 'Harvest'], answer: 'Pollination', explanation: 'The lecturer says heat stress during pollination directly reduces yield.' },
        { id: 35, type: 'fill', question: 'Some maize strains can now survive with ______% less water.', answer: '30', explanation: 'The lecturer says some strains can survive with 30% less water.' },
        { id: 36, type: 'fill', question: 'Smart farming technologies can reduce water use by up to ______%.', answer: '40', explanation: 'The lecturer says up to 40% water reduction.' },
        { id: 37, type: 'fill', question: 'There are approximately ______ million small farms in developing countries.', answer: '500', explanation: 'The lecturer mentions 500 million small farms.' },
        { id: 38, type: 'fill', question: 'Small farms produce ______% of food consumed in developing countries.', answer: '70', explanation: 'The lecturer says small farms produce 70% of the food in developing countries.' },
        { id: 39, type: 'mcq', question: 'What is the third mechanism affecting crop yields?', options: ['Rising sea levels', 'Spread of pests and diseases', 'Soil erosion', 'Deforestation'], answer: 'Spread of pests and diseases', explanation: 'The lecturer lists the third mechanism as the spread of pests and diseases.' },
        { id: 40, type: 'mcq', question: 'According to the lecturer, drought-resistant crop varieties are an example of:', options: ['A failed strategy', 'A mitigation strategy', 'An adaptation strategy', 'A natural solution'], answer: 'An adaptation strategy', explanation: 'The lecturer says "Adaptation strategies exist" and lists drought-resistant varieties.' },
      ],
    },
  ],
};

// ─── ADVANCED ─────────────────────────────────────────────────────────────────
const advancedListening: ListeningTest = {
  level: 'advanced',
  timeMinutes: 30,
  bandTarget: '7.0 – 9.0',
  sections: [
    {
      id: 1,
      title: 'Research Grant Application',
      scenario: 'A PhD student is meeting with a research funding officer to discuss a grant application.',
      transcript: `Officer: Come in, Dr. Mensah. Your application for the Horizon Research Fund has been shortlisted — congratulations. I just need to clarify a few points before we pass it to the panel.
Mensah: Of course. Thank you for the opportunity.
Officer: So your project is on neuroplasticity in adolescent learners following trauma — a quite compelling area. The budget you've submitted comes to £47,500. Can you walk me through the largest cost items?
Mensah: Certainly. The biggest single item is MRI scanning time — that's £18,000 for 60 scan sessions at the neuroscience unit at Middlesex. Then personnel: I've budgeted £14,000 for a part-time research assistant for 18 months. Equipment and software — mostly fMRI analysis licences — come to about £7,500. Travel and dissemination are £4,000, and indirect costs to the university are the remaining £4,000.
Officer: The panel will want to see a breakdown of the MRI sessions. 60 sessions for 20 participants means three scans each — that's consistent with your methodology, but they'll want confirmation that all participants will complete the full protocol.
Mensah: Understood. I've built in a 15% attrition allowance — so we're actually recruiting 24 participants to ensure 20 completions.
Officer: Good. One flag: your ethics approval references committee approval from March of last year. The fund requires that ethics approval be less than 18 months old at the point of application. You're right on the boundary.
Mensah: The approval was on the 3rd of March last year. Today is the 28th of July this year — that's 16 months and 25 days.
Officer: Just within. But I'd recommend requesting a renewal confirmation from your ethics committee to be safe.
Mensah: I'll do that immediately.
Officer: The only other issue is your impact statement. The panel is particularly focused on translational impact this cycle — they want to see a clear pathway from your findings to clinical or educational practice, not just academic publication.
Mensah: I can strengthen that. I have existing links with three secondary schools and a partnership with the local CAMHS team — that should demonstrate real-world application.
Officer: That would be very persuasive. Final submission is the 12th of August, so you have about two weeks.
Mensah: That's entirely manageable. Thank you for this guidance.`,
      questions: [
        { id: 1, type: 'fill', question: 'The total grant budget submitted is £______.', answer: '47,500', explanation: 'The officer says the budget comes to £47,500.' },
        { id: 2, type: 'fill', question: 'MRI scanning is budgeted at £______ for 60 sessions.', answer: '18,000', explanation: 'Mensah says the biggest item is MRI scanning at £18,000.' },
        { id: 3, type: 'fill', question: 'The research assistant is budgeted for ______ months.', answer: '18', explanation: 'Mensah says the research assistant is budgeted for 18 months.' },
        { id: 4, type: 'fill', question: 'Equipment and software costs come to approximately £______.', answer: '7,500', explanation: 'Mensah says equipment and software are about £7,500.' },
        { id: 5, type: 'fill', question: 'Mensah plans to recruit ______ participants, expecting 20 completions.', answer: '24', explanation: 'Mensah says they\'re recruiting 24 to ensure 20 completions.' },
        { id: 6, type: 'fill', question: 'Ethics approval must be less than ______ months old at point of application.', answer: '18', explanation: 'The officer says approval must be less than 18 months old.' },
        { id: 7, type: 'mcq', question: 'What does the officer recommend Mensah do about the ethics approval?', options: ['Resubmit for a new approval', 'Request a renewal confirmation', 'Withdraw and reapply next cycle', 'Contact the panel directly'], answer: 'Request a renewal confirmation', explanation: 'The officer says "I\'d recommend requesting a renewal confirmation."' },
        { id: 8, type: 'mcq', question: 'What is the panel\'s focus this funding cycle?', options: ['Pure academic research', 'Translational impact to practice', 'International collaborations', 'Cross-disciplinary methods'], answer: 'Translational impact to practice', explanation: 'The officer says the panel is focused on translational impact this cycle.' },
        { id: 9, type: 'fill', question: 'Mensah has partnerships with ______ secondary schools.', answer: 'three', explanation: 'Mensah says "I have existing links with three secondary schools."' },
        { id: 10, type: 'fill', question: 'The final submission deadline is the ______ of August.', answer: '12th', explanation: 'The officer says final submission is the 12th of August.' },
      ],
    },
    {
      id: 2,
      title: 'Behavioural Economics Radio Discussion',
      scenario: 'A radio host interviews an economist about nudge theory and public policy.',
      transcript: `Host: My guest this evening is Professor Elena Vásquez, whose new book challenges the ethical underpinnings of behavioural economics in public policy. Professor, welcome.
Vásquez: Thank you for having me.
Host: Your book takes quite a critical stance on nudge theory, which has been very fashionable in policy circles. Where do you begin?
Vásquez: I want to be clear — I'm not dismissing the empirical evidence. Nudges can work. The famous example from the UK Behavioural Insights Team is the change in organ donor registration from an opt-in to an opt-out system, which increased registration rates from around 30% to over 80% in some regions. That's a genuine public health gain.
Host: So what's the problem?
Vásquez: The problem is the relationship between effectiveness and autonomy. When we exploit cognitive biases to steer behaviour — even toward outcomes we consider beneficial — we're treating citizens as objects to be managed rather than agents capable of making informed decisions. There's a term for this: libertarian paternalism. It's a contradiction in terms, and I think it obscures a fundamental tension.
Host: But if someone ends up on the organ donor list because of a default setting, and their family benefits from transplant surgery twenty years later, have we harmed them?
Vásquez: Individually, perhaps not. But at scale, we're normalising a form of governance that bypasses democratic deliberation. Policies that would require public debate if enacted directly are instead slipped in through default settings or environmental design. It's governance by architecture.
Host: You discuss a specific case study in the book — the workplace pension auto-enrolment scheme in the UK.
Vásquez: Yes. Auto-enrolment increased pension participation from 55% to over 90% in just a few years. By any outcome metric, it's a success. But the conversation about what an adequate retirement saving rate actually is — whether 5%, 8%, or 12% is sufficient — was never had publicly. People were nudged into a system designed by technocrats without the underlying assumptions being scrutinised.
Host: Is there a middle ground?
Vásquez: I argue for what I call "transparent nudges" — where the default and the reasoning behind it are explicitly communicated, and genuine alternative pathways are not just theoretically available but practically accessible. That's a much higher bar, but it's the only approach that's compatible with a functioning democracy.
Host: Professor Vásquez, thank you. The book is 'The Governed Self' and it's available now.`,
      questions: [
        { id: 11, type: 'fill', question: 'The opt-out organ donor system increased registration rates to over ______% in some regions.', answer: '80', explanation: 'Vásquez says registration increased to over 80% in some regions.' },
        { id: 12, type: 'fill', question: 'Before the opt-out change, the registration rate was around ______%.', answer: '30', explanation: 'Vásquez says registration was around 30% before.' },
        { id: 13, type: 'mcq', question: 'What term does Vásquez use to describe nudge theory in policy?', options: ['Cognitive governance', 'Soft power theory', 'Libertarian paternalism', 'Behavioural mandate'], answer: 'Libertarian paternalism', explanation: 'Vásquez says "There\'s a term for this: libertarian paternalism."' },
        { id: 14, type: 'fill', question: 'Vásquez calls the use of default settings in governance: "governance by ______."', answer: 'architecture', explanation: 'Vásquez says "It\'s governance by architecture."' },
        { id: 15, type: 'fill', question: 'Auto-enrolment increased pension participation from 55% to over ______%.', answer: '90', explanation: 'Vásquez says participation rose to over 90%.' },
        { id: 16, type: 'mcq', question: 'What was Vásquez\'s main critique of the pension auto-enrolment scheme?', options: ['The saving rate was too low', 'It was never publicly evaluated', 'Public debate about saving rates was bypassed', 'It did not reach lower-income workers'], answer: 'Public debate about saving rates was bypassed', explanation: 'Vásquez says the conversation about adequate saving rates was never had publicly.' },
        { id: 17, type: 'fill', question: 'Vásquez argues for "______ nudges" where reasoning is explicitly communicated.', answer: 'transparent', explanation: 'Vásquez argues for "transparent nudges."' },
        { id: 18, type: 'mcq', question: 'According to Vásquez, what makes an alternative pathway genuinely acceptable?', options: ['Being theoretically available', 'Being practical and accessible', 'Being cheaper than the default', 'Being recommended by experts'], answer: 'Being practical and accessible', explanation: 'Vásquez says alternatives must be "practically accessible, not just theoretically available."' },
        { id: 19, type: 'fill', question: 'The name of Professor Vásquez\'s book is "The Governed ______."', answer: 'Self', explanation: 'The host says the book is "The Governed Self."' },
        { id: 20, type: 'mcq', question: 'What is Vásquez\'s overall position on nudge theory?', options: ['Fully endorses all nudge policies', 'Dismisses nudges as ineffective', 'Accepts effectiveness but critiques democratic implications', 'Calls for complete ban on nudge-based policy'], answer: 'Accepts effectiveness but critiques democratic implications', explanation: 'Vásquez says "I\'m not dismissing the empirical evidence. Nudges can work" but critiques the democratic implications.' },
      ],
    },
    {
      id: 3,
      title: 'Architecture Critique Panel',
      scenario: 'Three architects are discussing the cultural significance of preserving brutalist buildings.',
      transcript: `Moderator: We're here to discuss the growing movement to preserve brutalist architecture from demolition. Raj, you've been an advocate for several preservation campaigns. Make the case.
Raj: Brutalism emerged in the late 1940s through to the 1970s as a direct response to post-war idealism — the belief that architecture could solve social problems. These buildings, love them or hate them, are documents of a particular political moment. The Barbican in London, the National Theatre, the Hayward Gallery — they represent a time when government invested in public culture and social housing at scale. Demolishing them erases that memory.
Moderator: Helena, you've argued that preservation can become fetishisation.
Helena: Yes. My concern is that we're increasingly preserving buildings based on their aesthetic novelty or their instagrammability rather than their social history or function. The Trellick Tower gets listed, but the council estate next door — built by the same architect, serving actual families — gets demolished because it's less iconic. There's an inherent classism in selective preservation.
Raj: I agree with that critique to a point, but it doesn't undermine the case for preservation — it argues for more consistent criteria, not less preservation.
Moderator: David, from a structural engineering perspective?
David: Many brutalist buildings used raw concrete in ways that were experimental at the time and are now genuinely problematic. Concrete carbonation, rebar corrosion, inadequate waterproofing — maintenance costs can far exceed the cost of demolition and rebuilding. The Robin Hood Gardens in Tower Hamlets was demolished despite vigorous campaigning because the structural remediation costs were estimated at three times the demolition cost.
Helena: But the embodied carbon in those structures is significant. Demolishing and rebuilding has a massive environmental cost — you're releasing decades of stored carbon and then consuming energy to build a replacement.
David: That argument has limits though. If a replacement building is significantly more energy efficient over its lifetime, the carbon payback can be achieved within 20 to 30 years.
Raj: Which assumes the replacement is actually built to a high standard, which in practice rarely happens when the driver is developer profit.
Moderator: A rich debate. Thank you all.`,
      questions: [
        { id: 21, type: 'fill', question: 'Brutalism emerged from the late 1940s through to the ______.', answer: '1970s', explanation: 'Raj says "Brutalism emerged in the late 1940s through to the 1970s."' },
        { id: 22, type: 'mcq', question: 'According to Raj, what did brutalist architecture represent politically?', options: ['Capitalist development', 'Government investment in public culture and housing', 'Military expansion', 'International modernism'], answer: 'Government investment in public culture and housing', explanation: 'Raj says these buildings represent "a time when government invested in public culture and social housing."' },
        { id: 23, type: 'fill', question: 'Helena says preservation is increasingly based on buildings\' "______mability."', answer: 'instagram', explanation: 'Helena says buildings are preserved based on "their instagrammability."' },
        { id: 24, type: 'mcq', question: 'What does Helena suggest is "classist" about preservation?', options: ['Preserving only expensive buildings', 'Listing iconic buildings while demolishing social housing next door', 'Ignoring engineering costs', 'Only preserving buildings in wealthy areas'], answer: 'Listing iconic buildings while demolishing social housing next door', explanation: 'Helena says the Trellick Tower gets listed while the council estate next door gets demolished.' },
        { id: 25, type: 'fill', question: 'The building demolished in Tower Hamlets despite campaigning was ______ Gardens.', answer: 'Robin Hood', explanation: 'David mentions the Robin Hood Gardens demolition.' },
        { id: 26, type: 'fill', question: 'Structural remediation costs for Robin Hood Gardens were estimated at ______ times the demolition cost.', answer: 'three', explanation: 'David says remediation costs were three times the demolition cost.' },
        { id: 27, type: 'mcq', question: 'What is Helena\'s environmental argument against demolition?', options: ['New materials are more toxic', 'Embodied carbon in old structures is significant', 'New buildings require more workers', 'Planning permissions cause delays'], answer: 'Embodied carbon in old structures is significant', explanation: 'Helena says "The embodied carbon in those structures is significant."' },
        { id: 28, type: 'fill', question: 'According to David, a replacement building can achieve carbon payback within ______ to 30 years.', answer: '20', explanation: 'David says "carbon payback can be achieved within 20 to 30 years."' },
        { id: 29, type: 'mcq', question: 'What does Raj say limits David\'s carbon payback argument?', options: ['The 30-year timeline is too optimistic', 'Demolition companies have poor records', 'Replacement buildings rarely achieve high standards when profit-driven', 'Climate targets change too often'], answer: 'Replacement buildings rarely achieve high standards when profit-driven', explanation: 'Raj says this assumes the replacement is built to a high standard, "which in practice rarely happens when the driver is developer profit."' },
        { id: 30, type: 'mcq', question: 'What is Raj\'s response to Helena\'s critique of selective preservation?', options: ['He disagrees entirely', 'He says it shows we need less preservation overall', 'He agrees but says it argues for more consistent criteria', 'He changes his position on the Barbican'], answer: 'He agrees but says it argues for more consistent criteria', explanation: 'Raj says "it argues for more consistent criteria, not less preservation."' },
      ],
    },
    {
      id: 4,
      title: 'Neuroscience of Decision-Making Lecture',
      scenario: 'A professor delivers a lecture on dual-process theory and its implications for policy.',
      transcript: `Professor: The framework I want to discuss today has reshaped our understanding of human rationality — and not in a flattering way. Dual-process theory, associated most prominently with the work of Daniel Kahneman, divides cognitive processing into two systems. System 1 is fast, automatic, emotional, and largely unconscious. System 2 is slow, deliberate, effortful, and rational in the classical sense.
The critical insight — and this is what upends the traditional economic model of the rational agent — is that System 2 is the exception, not the rule. We evolved System 1 first. It handles the overwhelming majority of our daily cognition: recognising faces, understanding speech, avoiding obstacles. System 2 is metabolically expensive — it requires genuine cognitive effort — and so we avoid using it unless we have to.
The implications for decision-making are profound. When we evaluate a complex financial product, assess a medical risk, or make a dietary choice, we are predominantly using System 1 heuristics — mental shortcuts that serve us reasonably well in ancestral environments but that are poorly calibrated for modern, complex decisions.
Three heuristics are particularly relevant for policy: availability, representativeness, and anchoring. The availability heuristic means we overweight risks that come easily to mind — plane crashes over car accidents, shark attacks over drowning — distorting risk perception at scale. Representativeness leads us to judge probabilities based on how well something matches a stereotype rather than base rates, producing systematic errors in domains from medicine to criminal justice. And anchoring means we are disproportionately influenced by the first number we encounter in a negotiation or evaluation, regardless of its relevance.
Understanding these biases doesn't make us immune to them. This is perhaps the most sobering finding of the research: even people who understand and can articulate cognitive biases in the abstract continue to exhibit them in their own judgements. The biases are architectural, not just informational. Which is why, returning to the policy debate, interventions that target the architecture of choice — the default, the framing, the sequence of options — are often more effective than those that target information or education.
The ethical question, of course, remains open.`,
      questions: [
        { id: 31, type: 'fill', question: 'Dual-process theory is most prominently associated with the work of Daniel ______.', answer: 'Kahneman', explanation: 'The professor says the theory is "associated most prominently with the work of Daniel Kahneman."' },
        { id: 32, type: 'mcq', question: 'Which system is described as "fast, automatic, and largely unconscious"?', options: ['System 2', 'System 1', 'System 3', 'The limbic system'], answer: 'System 1', explanation: 'The professor says System 1 is fast, automatic, emotional, and largely unconscious.' },
        { id: 33, type: 'fill', question: 'The professor says System 2 is "metabolically ______."', answer: 'expensive', explanation: 'The professor says System 2 "is metabolically expensive."' },
        { id: 34, type: 'mcq', question: 'What does the "availability heuristic" cause us to do?', options: ['Choose options presented first', 'Overweight easily remembered risks', 'Judge by stereotypes', 'Avoid all risk'], answer: 'Overweight easily remembered risks', explanation: 'The professor says the availability heuristic means "we overweight risks that come easily to mind."' },
        { id: 35, type: 'matching', question: 'The representativeness heuristic causes us to judge probabilities based on:', options: ['How recently an event occurred', 'How well something matches a stereotype', 'How much money is involved', 'How many people are affected'], answer: 'How well something matches a stereotype', explanation: 'The professor says representativeness leads us to judge "based on how well something matches a stereotype."' },
        { id: 36, type: 'fill', question: 'Anchoring means we are influenced by the ______ number we encounter.', answer: 'first', explanation: 'The professor says "we are disproportionately influenced by the first number we encounter."' },
        { id: 37, type: 'mcq', question: 'What is the most "sobering finding" of the cognitive bias research?', options: ['Biases only affect uneducated people', 'Biases disappear with experience', 'Even people who understand biases still exhibit them', 'Biases are only present in extreme situations'], answer: 'Even people who understand biases still exhibit them', explanation: 'The professor says even those who understand biases "continue to exhibit them in their own judgements."' },
        { id: 38, type: 'fill', question: 'The professor says biases are "______," not just informational.', answer: 'architectural', explanation: 'The professor says "The biases are architectural, not just informational."' },
        { id: 39, type: 'mcq', question: 'Which policy interventions does the professor suggest are most effective?', options: ['Educational campaigns about biases', 'Stronger regulation', 'Interventions targeting the architecture of choice', 'Penalties for poor decisions'], answer: 'Interventions targeting the architecture of choice', explanation: 'The professor says interventions targeting "the default, the framing, the sequence of options" are more effective.' },
        { id: 40, type: 'fill', question: 'The professor says an example of availability heuristic is overweighting ______ crashes over car accidents.', answer: 'plane', explanation: 'The professor says we overweight "plane crashes over car accidents."' },
      ],
    },
  ],
};

export const listeningTests: Record<string, ListeningTest> = {
  beginner: beginnerListening,
  intermediate: intermediateListening,
  advanced: advancedListening,
};
