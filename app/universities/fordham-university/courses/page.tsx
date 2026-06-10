import Link from 'next/link';
import type { Metadata } from 'next';
import { fordhamCourses } from '@/data/fordham-courses';
import { buildMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Fordham University Courses & Programs 2026 – Fees, IELTS & Intakes',
  description: '39 programs at Fordham University for Indian students. Tuition, IELTS requirements, intake dates. Free counselling by Jaivik Overseas.',
  path: '/universities/fordham-university/courses',
});

const levels = ['All', 'Bachelor', 'Master', 'Doctoral', 'Diploma'];

export default function FordhamCoursesPage() {
  const courses = fordhamCourses;
  const avgFee = Math.round(courses.reduce((s,c)=>s+c.annualUSD,0)/courses.length);

  
  const _minIelts = courses.length ? Math.min(...courses.map((c: any) => Number(c.ieltsMin) || 6.0)) : 6.0;
  const _avgFeeUSD = courses.length
    ? Math.round(courses.reduce((s: number, c: any) => s + (Number(c.annualUSD) || 0), 0) / courses.length)
    : 0;
  const _intakeSample: string[] = (courses[0] as any)?.intakeMonths ?? ['September'];
  const _intakesText = _intakeSample.join(' and ');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many courses does Fordham University offer for international students?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Fordham University offers ${courses.length} programs for international students including Undergraduate, Master's, and PhD degrees.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the minimum IELTS score required at Fordham University?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The minimum IELTS score at Fordham University is ${_minIelts}+. High-demand programs may require up to 7.0.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the average tuition fee at Fordham University?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The average annual tuition at Fordham University is approximately ${_avgFeeUSD.toLocaleString()} USD (≈ ₹${(_avgFeeUSD * 84 / 100000).toFixed(1)}L INR). Fees vary by program and level.`,
        },
      },
      {
        '@type': 'Question',
        name: `What intake options does Fordham University offer?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Fordham University offers ${_intakesText} intake${_intakeSample.length > 1 ? 's' : ''}. Apply 3–6 months before the intake opening.`,
        },
      },
      {
        '@type': 'Question',
        name: `How can Indian students apply to Fordham University?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Indian students can apply to Fordham University in USA through Jaivik Overseas Consultants — free application guidance, SOP writing, and visa assistance included.`,
        },
      },
    ],
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Fordham University — Courses for International Students`,
    description: `${courses.length} programs at Fordham University, USA. Min IELTS ${_minIelts}+.`,
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 5).map((c: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.name,
        provider: { '@type': 'CollegeOrUniversity', name: 'Fordham University' },
        offers: { '@type': 'Offer', price: Number(c.annualUSD) || 0, priceCurrency: 'USD' },
        educationalLevel: c.level ?? c.studyLevel ?? 'Undergraduate',
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={courseListSchema} />
      <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <Link href="/universities" className="hover:text-brand-700">Universities</Link> /
        <Link href="/universities/fordham-university" className="hover:text-brand-700">Fordham University</Link> /
        <span className="text-gray-800 font-medium">Courses</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fordham University — All Courses & Programs 2026</h1>
        <p className="text-gray-500">{courses.length} programs listed · Avg ~$${Math.round(avgFee/1000)}K USD/yr</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-20">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts</h3>
            {[
              ['Programs', courses.length.toString()],
              ['Min IELTS', courses[0]?.ieltsMin + '+'],
              ['Intake', 'Aug & Jan'],
              ['Country', 'USA'],
              ['Work Rights', '20 hrs/wk on-campus'],
              ['Post-Study', 'OPT 12–36 months'],
            ].map(([k,v])=>(
              <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-xs">
                <span className="text-gray-500">{k}</span>
                <span className="font-semibold text-gray-900 text-right">{v}</span>
              </div>
            ))}
            <Link href="/book-counselling" className="btn-primary w-full text-center mt-4 block text-sm">
              Free Counselling →
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-3">
          {courses.map(c => (
            <Link key={c.id} href={`/universities/fordham-university/courses/${c.slug}`}
              className="block bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 hover:text-brand-700 text-sm">{c.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{c.level} · {c.duration} · {c.campus}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">IELTS {c.ieltsMin}+</span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{c.intakeMonths.join(' & ')}</span>
                  </div>
                </div>
                <div className="text-right whitespace-nowrap">
                  <p className="font-bold text-brand-700 text-sm">$${(c.annualUSD/1000).toFixed(0)}K/yr</p>
                  <p className="text-xs text-gray-400">≈ ₹{(c.annualINR/100000).toFixed(1)}L/yr</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
