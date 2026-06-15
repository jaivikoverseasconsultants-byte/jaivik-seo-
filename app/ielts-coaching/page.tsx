import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'IELTS Coaching & Trainers | Jaivik Overseas Consultants',
  description: 'Find IELTS trainers in Ghaziabad, Noida, Delhi NCR. Expert coaching for Band 7+. Free trial class available. Flexible batches — weekday, weekend, online.',
  robots: { index: true, follow: true },
};

const TRAINERS = [
  {
    name: 'Priyanka Sharma',
    initial: 'P',
    color: 'bg-blue-600',
    location: 'Ghaziabad (Crossing Republik)',
    experience: '8 years',
    avgBandImprovement: '+1.5 bands',
    speciality: 'Writing & Speaking',
    modes: ['Online', 'Offline'],
    batchTypes: ['Weekday Morning', 'Weekend'],
    rating: 4.9,
    reviews: 142,
    tag: 'Top Rated',
    tagColor: 'bg-gold-500',
  },
  {
    name: 'Amit Verma',
    initial: 'A',
    color: 'bg-purple-600',
    location: 'Noida (Sector 62)',
    experience: '6 years',
    avgBandImprovement: '+1.0 bands',
    speciality: 'Reading & Listening',
    modes: ['Online'],
    batchTypes: ['Weekday Evening', 'Weekend'],
    rating: 4.7,
    reviews: 88,
    tag: 'Online Expert',
    tagColor: 'bg-brand-600',
  },
  {
    name: 'Sunita Kapoor',
    initial: 'S',
    color: 'bg-pink-600',
    location: 'Ghaziabad (Vaishali)',
    experience: '10 years',
    avgBandImprovement: '+1.5 bands',
    speciality: 'Full IELTS + Academic',
    modes: ['Offline'],
    batchTypes: ['Weekday Morning', 'Weekday Evening'],
    rating: 4.8,
    reviews: 204,
    tag: 'Most Experienced',
    tagColor: 'bg-green-600',
  },
  {
    name: 'Rajesh Nair',
    initial: 'R',
    color: 'bg-orange-600',
    location: 'Delhi (Laxmi Nagar)',
    experience: '5 years',
    avgBandImprovement: '+1.0 bands',
    speciality: 'Speaking & Pronunciation',
    modes: ['Online', 'Offline'],
    batchTypes: ['Weekend', 'Weekday Evening'],
    rating: 4.6,
    reviews: 56,
    tag: 'Speaking Specialist',
    tagColor: 'bg-red-600',
  },
  {
    name: 'Meena Gupta',
    initial: 'M',
    color: 'bg-teal-600',
    location: 'Ghaziabad (Raj Nagar)',
    experience: '7 years',
    avgBandImprovement: '+1.5 bands',
    speciality: 'Writing Task 1 & 2',
    modes: ['Online', 'Offline'],
    batchTypes: ['Weekday Morning', 'Weekend'],
    rating: 4.8,
    reviews: 117,
    tag: 'Writing Expert',
    tagColor: 'bg-teal-600',
  },
  {
    name: 'Vivek Singh',
    initial: 'V',
    color: 'bg-indigo-600',
    location: 'Noida (Sector 18)',
    experience: '4 years',
    avgBandImprovement: '+0.5–1.0 bands',
    speciality: 'Fast-track Band 6.5+',
    modes: ['Online'],
    batchTypes: ['Weekday Evening', 'Weekend'],
    rating: 4.5,
    reviews: 39,
    tag: 'Fast-track',
    tagColor: 'bg-indigo-600',
  },
];

const FEATURES = [
  { icon: '🎯', title: 'Band 7+ Guarantee', desc: 'All our trainers have a proven track record of pushing students to Band 7+' },
  { icon: '📅', title: 'Flexible Batches', desc: 'Weekday mornings, evenings, and weekend batches available — online & offline' },
  { icon: '🆓', title: 'Free Trial Class', desc: 'First class is free — no commitment, no payment until you are satisfied' },
  { icon: '📊', title: 'Mock Tests Included', desc: 'Weekly full mock tests with detailed feedback on every section' },
  { icon: '📝', title: 'Study Materials', desc: 'Cambridge Books, practice papers, and Jaivik-exclusive writing templates' },
  { icon: '🏆', title: '99% Visa Success', desc: 'Students who hit their target band with us have gone on to top universities with 99% visa approval' },
];

export default function IELTSCoachingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            🎓 Ghaziabad · Noida · Delhi NCR · Online Available
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            IELTS Coaching for Indian Students
          </h1>
          <p className="text-blue-200 text-lg mb-6 max-w-2xl mx-auto">
            Expert IELTS trainers — offline in Ghaziabad & Noida, or fully online. Average band improvement: <span className="text-white font-bold">+1.5 bands</span> in 6 weeks.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/919971226347?text=${encodeURIComponent('Hi Jaivik Overseas, I want to join IELTS coaching. Please share batch details and fees.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors"
            >
              WhatsApp for Batch Details →
            </a>
            <Link href="/mock-test" className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors">
              Free IELTS Mock Test
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-10 px-4 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainer Cards */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our IELTS Trainers</h2>
            <p className="text-gray-500 text-sm">Verified trainers — background checked, 4.5+ student ratings</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TRAINERS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full ${t.color} text-white flex items-center justify-center font-bold text-xl flex-shrink-0`}>
                    {t.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-gray-900 text-sm truncate">{t.name}</p>
                      <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${t.tagColor}`}>
                        {t.tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{t.location}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Experience</span>
                    <span className="font-semibold text-gray-900">{t.experience}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Avg Improvement</span>
                    <span className="font-semibold text-green-700">{t.avgBandImprovement}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Speciality</span>
                    <span className="font-semibold text-gray-900 text-right max-w-[60%]">{t.speciality}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {t.modes.map(m => (
                      <span key={m} className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-semibold">{m}</span>
                    ))}
                    {t.batchTypes.map(b => (
                      <span key={b} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{b}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(n => (
                      <span key={n} className={`text-sm ${n <= Math.floor(t.rating) ? 'text-gold-500' : 'text-gray-200'}`}>★</span>
                    ))}
                    <span className="text-xs text-gray-600 ml-1">{t.rating} ({t.reviews})</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/919971226347?text=${encodeURIComponent(`Hi, I'm interested in IELTS coaching with ${t.name}. Please share fees and batch timings.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs rounded-xl transition-colors"
                >
                  Enquire via WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Are you a trainer CTA */}
      <section className="bg-brand-50 border-y border-brand-100 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Are You an IELTS Trainer?</h2>
          <p className="text-gray-600 text-sm mb-5">
            Join the Jaivik Overseas IELTS trainer network — get students, manage batches, and grow your income. Free to join for verified trainers.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/trainer-dashboard"
              className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Trainer Dashboard →
            </Link>
            <a
              href={`https://wa.me/919971226347?text=${encodeURIComponent('Hi, I am an IELTS trainer and want to join the Jaivik Overseas trainer network. Please guide me.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              WhatsApp to Register
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How long does IELTS coaching take?',
                a: 'Most students complete our 6-week intensive programme. If you already have a band 6.0+, a 3-week crash course may be sufficient.',
              },
              {
                q: 'What is the fee for IELTS coaching?',
                a: 'Fees vary by trainer and batch type. WhatsApp us for current pricing — we offer flexible payment options and group discounts.',
              },
              {
                q: 'Is online coaching available?',
                a: 'Yes, all trainers offer online sessions via Zoom/Google Meet with the same quality as offline classes.',
              },
              {
                q: 'Do you provide study materials?',
                a: 'Yes — Cambridge IELTS books 1–18, Jaivik-exclusive writing templates, and weekly mock test papers are included.',
              },
              {
                q: 'Can you help after coaching if I need a re-test?',
                a: 'Absolutely. We offer unlimited post-coaching support and targeted revision sessions before your re-test.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="font-semibold text-gray-900 text-sm mb-2">{faq.q}</p>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/mock-test" className="btn-primary inline-block">
              Take a Free IELTS Mock Test →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
