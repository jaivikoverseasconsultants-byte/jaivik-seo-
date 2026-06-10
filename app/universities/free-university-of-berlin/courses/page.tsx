import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { fuberlinCourses } from '@/data/fu-berlin-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Free University of Berlin International Courses – All Programs, Fees & IELTS 2026',
  description: `Free University of Berlin – ${(fuberlinCourses as unknown as any[]).length} courses for international students. Free guidance from Jaivik Overseas Consultants.`,
  path: '/universities/free-university-of-berlin/courses',
  keywords: ['FU Berlin courses', 'Free University of Berlin international', 'study in Germany'],
});

const levelOrder = ['Undergraduate', 'Foundation', 'Graduate Certificate', 'Graduate Diploma', 'Masters', 'MBA', 'PhD', 'Postgraduate'];

function groupByLevel(courses: any[]) {
  const groups: Record<string, any[]> = {};
  courses.forEach((c: any) => {
    const lv = c.level || 'Other';
    if (!groups[lv]) groups[lv] = [];
    groups[lv].push(c);
  });
  return groups;
}

export default function CoursesPage() {
  const courses = fuberlinCourses as unknown as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const pgCourses = courses.filter((c: any) => c.studyLevel !== 'Undergraduate');
  const avgFee = pgCourses.length
    ? Math.round(pgCourses.reduce((s: number, c: any) => s + (c.annualEUR || c.annualUSD || 0), 0) / pgCourses.length)
    : Math.round(courses.reduce((s: number, c: any) => s + (c.annualEUR || c.annualUSD || 0), 0) / (totalCourses || 1));

  
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
        name: `How many courses does Free University of Berlin offer for international students?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Free University of Berlin offers ${courses.length} programs for international students including Undergraduate, Master's, and PhD degrees.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the minimum IELTS score required at Free University of Berlin?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The minimum IELTS score at Free University of Berlin is ${_minIelts}+. High-demand programs may require up to 7.0.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the average tuition fee at Free University of Berlin?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The average annual tuition at Free University of Berlin is approximately ${_avgFeeUSD.toLocaleString()} USD (≈ ₹${(_avgFeeUSD * 84 / 100000).toFixed(1)}L INR). Fees vary by program and level.`,
        },
      },
      {
        '@type': 'Question',
        name: `What intake options does Free University of Berlin offer?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Free University of Berlin offers ${_intakesText} intake${_intakeSample.length > 1 ? 's' : ''}. Apply 3–6 months before the intake opening.`,
        },
      },
      {
        '@type': 'Question',
        name: `How can Indian students apply to Free University of Berlin?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Indian students can apply to Free University of Berlin in Germany through Jaivik Overseas Consultants — free application guidance, SOP writing, and visa assistance included.`,
        },
      },
    ],
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Free University of Berlin — Courses for International Students`,
    description: `${courses.length} programs at Free University of Berlin, Germany. Min IELTS ${_minIelts}+.`,
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 5).map((c: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.name,
        provider: { '@type': 'CollegeOrUniversity', name: 'Free University of Berlin' },
        offers: { '@type': 'Offer', price: Number(c.annualUSD) || 0, priceCurrency: 'USD' },
        educationalLevel: c.level ?? c.studyLevel ?? 'Undergraduate',
      },
    })),
  };


  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: 'Free University of Berlin',
    sameAs: 'https://www.fu-berlin.de',
    url: 'https://www.fu-berlin.de',
    numberOfStudents: { '@type': 'QuantitativeValue', value: 40000 },
  };

  const orderedGroups = levelOrder.filter(l => groups[l]).map(l => [l, groups[l]]);
  const otherGroups = Object.keys(groups).filter(l => !levelOrder.includes(l)).map(l => [l, groups[l]]);
  const allGroups = [...orderedGroups, ...otherGroups] as [string, any[]][];

  const feeINRLakh = (avgFee * 90 / 100000).toFixed(1);

  return (
    <>
      <JsonLd data={schema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={courseListSchema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/free-university-of-berlin" className="hover:text-white">FU Berlin</Link> /
            <span>Courses</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Free University of Berlin</h1>
          <p className="text-blue-100 text-lg mb-6">
            {totalCourses} Programs for International Students · Berlin, Germany · IELTS 6.0–7.0+
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">{totalCourses}</div>
              <div className="text-blue-200 text-xs">Courses</div>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">€{avgFee.toLocaleString()}</div>
              <div className="text-blue-200 text-xs">Avg PG Fee/year</div>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">₹{feeINRLakh}L</div>
              <div className="text-blue-200 text-xs">Avg Fee (INR)</div>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">6.0–7.0</div>
              <div className="text-blue-200 text-xs">IELTS Range</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        {allGroups.map(([level, levelCourses]) => (
          <div key={level} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm">{level}</span>
              <span className="text-gray-500 text-sm font-normal">{levelCourses.length} programs</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {levelCourses.map((course: any) => {
                const fee = course.annualEUR || course.annualUSD || 0;
                const feeStr = fee > 0 ? '€' + fee.toLocaleString() + '/yr' : 'Low fees';
                return (
                  <Link
                    key={course.id}
                    href={`/universities/free-university-of-berlin/courses/${course.slug}`}
                    className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-brand-200 transition-all group"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors mb-2 text-sm leading-snug">
                      {course.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{course.level}</span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{feeStr}</span>
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">IELTS {course.ieltsMin}+</span>
                      <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{course.duration}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">{(course.intakeMonths || []).join(' & ')} intake</div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="bg-brand-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-brand-900 mb-2">Apply to FU Berlin</h2>
          <p className="text-center text-gray-600 mb-6">Get free expert guidance from Jaivik Overseas Consultants</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
