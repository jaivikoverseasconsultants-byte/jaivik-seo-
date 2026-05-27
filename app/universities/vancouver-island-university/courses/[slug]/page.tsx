import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { viuCourses, getViuCoursesBySlug } from '@/data/viu-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
  return (viuCourses as unknown as any[]).map((c: any) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getViuCoursesBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} | VIU – Fees, IELTS & Intake 2025`,
    description: `${course.name} at Vancouver Island University. Annual fee CAD $${course.annualCAD.toLocaleString()} (${course.durationYears} year${course.durationYears !== 1 ? 's' : ''}). IELTS ${course.ieltsMin}+. Intake: ${course.intakeMonths.join(' & ')}. PGWP eligible. Free guidance from Jaivik Overseas Consultants.`,
    path: `/universities/vancouver-island-university/courses/${slug}`,
    keywords: [course.name, 'VIU', 'Vancouver Island University', 'study in Canada', course.level, 'PGWP'],
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getViuCoursesBySlug(slug);
  if (!course) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: 'Vancouver Island University',
      sameAs: 'https://www.viu.ca',
    },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    timeRequired: `P${course.durationYears}Y`,
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
            <Link href="/universities/country/canada" className="hover:text-white">Canada</Link> /
            <Link href="/universities/vancouver-island-university" className="hover:text-white">VIU</Link> /
            <Link href="/universities/vancouver-island-university/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇨🇦 Vancouver Island University · Nanaimo, Canada · PGWP Eligible
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              <p className="text-blue-200 text-lg mb-5">
                {course.studyLevel} · {course.duration} · {course.campus}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (CAD)', value: `$${course.annualCAD.toLocaleString()}` },
                  { label: 'Fee in INR', value: `₹${feeINRLakh}L/yr` },
                  { label: 'IELTS Minimum', value: `${course.ieltsMin}+` },
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
              <LeadForm source={`viu-course-${slug}`} defaultCountry="Canada" compact />
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
                { label: 'Annual Tuition (CAD)', value: `$${course.annualCAD.toLocaleString()}` },
                { label: 'Annual Tuition (USD)', value: `$${course.annualUSD.toLocaleString()}` },
                { label: 'Living Cost (CAD)', value: `$${course.livingCostCAD.toLocaleString()}/yr` },
                { label: 'Total Course Fee', value: `$${course.totalCAD.toLocaleString()} CAD` },
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
                { label: 'TOEFL iBT', value: `${course.toeflMin}+`, sub: 'Writing 20+' },
                { label: 'PTE Academic', value: `${course.pteMin}+`, sub: 'No band below 50' },
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
                { label: `Tuition Fee × ${course.durationYears} year${course.durationYears !== 1 ? 's' : ''}`, value: `$${course.totalCAD.toLocaleString()} CAD`, highlight: true },
                { label: `Living Cost × ${course.durationYears} year${course.durationYears !== 1 ? 's' : ''}`, value: `$${(course.livingCostCAD * course.durationYears).toLocaleString()} CAD` },
                { label: 'Total Estimated Cost', value: `$${(course.totalCAD + course.livingCostCAD * course.durationYears).toLocaleString()} CAD`, highlight: true },
                { label: 'In Indian Rupees (₹)', value: `₹${((course.totalCAD + course.livingCostCAD * course.durationYears) * 61 / 100000).toFixed(1)} Lakh`, highlight: true },
              ].map(r => (
                <div key={r.label} className={`flex justify-between items-center p-3 rounded-xl ${r.highlight ? 'bg-brand-50 font-bold' : 'bg-gray-50'}`}>
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className={`text-sm ${r.highlight ? 'text-brand-700' : 'text-gray-900'}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Canada Study Permit & Work Rights</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Visa Type', value: 'Canada Study Permit' },
                { label: 'Work Rights (Term)', value: '24 hrs/week (on-campus unlimited)' },
                { label: 'Work Rights (Vacation)', value: 'Full-time' },
                { label: 'Post-Study Work', value: 'PGWP — up to 3 years' },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
              <p className="text-xs text-green-800 font-semibold">✅ PGWP Eligible Institution</p>
              <p className="text-xs text-green-700 mt-1">Graduates can apply for a Post-Graduation Work Permit valid for up to 3 years, which can lead to Canadian Permanent Residency.</p>
            </div>
          </div>

          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Interested in {course.name}?</h2>
            <p className="text-blue-200 text-sm mb-4">
              Book a free counselling session. Our Canada admissions advisors help Indian students every step of the way.
            </p>
            <Link href="/book-counselling" className="btn-gold inline-block">
              Get Free Guidance →
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={`viu-course-${slug}-sidebar`} defaultCountry="Canada" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer"
                  className="block text-sm text-brand-700 hover:underline">
                  Official Course Page ↗
                </a>
                <Link href="/universities/vancouver-island-university/courses" className="block text-sm text-brand-700 hover:underline">
                  All VIU Courses →
                </Link>
                <Link href="/universities/country/canada" className="block text-sm text-brand-700 hover:underline">
                  Study in Canada Guide →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
