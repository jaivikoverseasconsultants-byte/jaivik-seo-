import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { vuwCourses, getVuwCourseBySlug } from '@/data/vuw-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';

import { isPswEligible } from '@/lib/psw-eligibility';
export async function generateStaticParams() {
  return (vuwCourses as unknown as any[]).map((c: any) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getVuwCourseBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at Victoria University of Wellington — Fees in INR, IELTS & Requirements for Indian Students`,
    description: `${course.name} at Victoria University of Wellington, ${(course as any).city || course.country} costs ₹${(course.annualINR / 100000).toFixed(1)}L/year for Indian students. IELTS ${course.ieltsMin}+, intakes ${course.intakeMonths.join(' & ')}. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/victoria-university-wellington/courses/${slug}`,
    keywords: [course.name, 'Victoria', 'Victoria University of Wellington', 'study in New Zealand', course.level],
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getVuwCourseBySlug(slug);
  if (!course) notFound();

  const schema = {
    '@context': 'https://schema.org', '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: 'Victoria University of Wellington', sameAs: 'https://www.wgtn.ac.nz' },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    ...(course.durationYears > 0 ? { timeRequired: `P${course.durationYears}Y` } : {}),
    url: course.url,
  };

  const feeINRLakh = (course.annualINR / 100000).toFixed(1);

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/victoria-university-wellington" className="hover:text-white">Victoria</Link> /
            <Link href="/universities/victoria-university-wellington/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇳🇿 Victoria University of Wellington · Wellington, New Zealand
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name} at Victoria University of Wellington — Fees in INR, IELTS &amp; Requirements for Indian Students</h1>
              <p className="text-blue-200 text-lg mb-5">{course.studyLevel} · {course.duration} · {course.campus}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (NZD)', value: `NZ$${course.annualNZD.toLocaleString()}` },
                  { label: 'Fee in INR', value: `₹${feeINRLakh}L/yr` },
                  { label: 'IELTS Min', value: `${course.ieltsMin}+` },
                  { label: 'Duration', value: course.duration },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={`vuw-course-${slug}`} defaultCountry="New Zealand" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Qualification', value: course.level },
                { label: 'Duration', value: course.duration + ' full-time' },
                { label: 'Campus', value: course.campus },
                { label: 'Intakes', value: course.intakeMonths.join(' & ') },
                { label: 'Annual Fee (NZD)', value: `NZ$${course.annualNZD.toLocaleString()}` },
                { label: 'Annual Fee (USD)', value: `$${course.annualUSD.toLocaleString()}` },
                { label: 'Living Cost (NZD/yr)', value: `NZ$${course.livingCostNZD.toLocaleString()}` },
                { label: 'Total Course Fee', value: `NZ$${course.totalNZD.toLocaleString()}` },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">English Language Requirements</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'IELTS Academic', value: `${course.ieltsMin}+`, sub: 'No band below 5.5' },
                { label: 'TOEFL iBT', value: `${course.toeflMin}+`, sub: 'Writing 21+' },
                { label: 'PTE Academic', value: `${course.pteMin}+`, sub: 'No band below 51' },
              ].map(e => (
                <div key={e.label} className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold text-brand-700">{e.value}</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{e.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Total Cost of Study (Indian Students)</h2>
            <div className="space-y-3">
              {[
                { label: `Tuition × ${course.durationYears} yr${course.durationYears !== 1 ? 's' : ''}`, value: `NZ$${course.totalNZD.toLocaleString()}`, hi: true },
                { label: `Living × ${course.durationYears} yr${course.durationYears !== 1 ? 's' : ''}`, value: `NZ$${(course.livingCostNZD * course.durationYears).toLocaleString()}` },
                { label: 'Total Est. Cost', value: `NZ$${(course.totalNZD + course.livingCostNZD * course.durationYears).toLocaleString()}`, hi: true },
                { label: 'In Indian Rupees', value: `₹${((course.totalNZD + course.livingCostNZD * course.durationYears) * 0.60 * 84 / 100000).toFixed(1)} Lakh`, hi: true },
              ].map(r => (
                <div key={r.label} className={`flex justify-between items-center p-3 rounded-xl ${r.hi ? 'bg-brand-50 font-bold' : 'bg-gray-50'}`}>
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className={`text-sm ${r.hi ? 'text-brand-700' : 'text-gray-900'}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Visa & Work Rights — New Zealand</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Student Visa', value: 'New Zealand Student Visa' },
                { label: 'Work Rights (Term)', value: '20 hrs/week' },
                { label: 'Work Rights (Vacation)', value: 'Full-time' },
                ...(isPswEligible(course as any) ? [{ label: 'Post-Study Visa', value: 'Open Work Visa (Post-Study)' }] : []),
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>


          <CourseRichContent course={course as any} universityName="Victoria University of Wellington" universitySlug="victoria-university-wellington" />
          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Interested in {course.name}?</h2>
            <p className="text-blue-200 text-sm mb-4">Our New Zealand admissions advisors give free, personalised guidance to Indian students.</p>
            <Link href="/book-counselling" className="btn-gold inline-block">Get Free Guidance →</Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={`vuw-course-${slug}-sidebar`} defaultCountry="New Zealand" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">Official Course Page ↗</a>
                <Link href="/universities/victoria-university-wellington/courses" className="block text-sm text-brand-700 hover:underline">All Victoria Courses →</Link>
                <Link href="/universities/country/new-zealand" className="block text-sm text-brand-700 hover:underline">Study in New Zealand Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
