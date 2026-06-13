import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { embryCourses } from '@/data/embry-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import CourseRichContent from '@/components/CourseRichContent';

export function generateStaticParams() {
  return embryCourses.map(c => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const c = embryCourses.find(x => x.slug === slug);
  if (!c) return {};
  return buildMetadata({
    title: `${c.name} at Embry Riddle Singapore — Fees, IELTS & Intake for Indian Students 2026`,
    description: `${c.name} at Embry Riddle Singapore, ${(c as any).city || c.country} costs ₹${(c.annualINR / 100000).toFixed(1)}L/year for Indian students. IELTS ${c.ieltsMin}+, intakes ${c.intakeMonths.join(' & ')}. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/embry-riddle-singapore/courses/${slug}`,
  });
}

export default async function CourseDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const c = embryCourses.find(x => x.slug === slug);
  if (!c) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <Link href="/universities" className="hover:text-brand-700">Universities</Link> /
        <Link href="/universities/embry-riddle-singapore" className="hover:text-brand-700">Embry-Riddle Aeronautical University Singapore</Link> /
        <Link href="/universities/embry-riddle-singapore/courses" className="hover:text-brand-700">Courses</Link> /
        <span className="text-gray-800 font-medium">{c.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              🇸🇬 Singapore · {c.level}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{c.name}</h1>
            <p className="text-gray-500 text-sm">Embry-Riddle Aeronautical University Singapore · {c.city}, {c.state}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { label: 'Duration', value: c.duration },
                { label: 'Level', value: c.level },
                { label: 'Annual Fee (SGD)', value: 'S$${(c.annualSGD/1000).toFixed(0)}K' },
                { label: 'Annual Fee (INR)', value: `₹${(c.annualINR/100000).toFixed(1)}L` },
              ].map(s => (
                <div key={s.label} className="bg-brand-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-brand-700">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Admission Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'IELTS', value: `${c.ieltsMin}+ overall` },
                { label: 'TOEFL', value: `${c.toeflMin}+ iBT` },
                { label: 'PTE', value: `${c.pteMin}+` },
                { label: 'Intake', value: c.intakeMonths.join(' & ') },
                { label: 'Living Cost', value: '~S$${(c.livingCostSGD).toLocaleString()}/mo' },
                { label: 'Work Rights', value: '16 hrs/wk (with approval)' },
              ].map(r => (
                <div key={r.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{r.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{r.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cost Summary (Full Course)</h2>
            <div className="space-y-3">
              {[
                ['Tuition (Total)', 'S$${Math.round(c.totalSGD/1000)}K SGD'],
                ['Living Cost (Total)', '~S$${Math.round(c.livingCostSGD*12*c.durationYears/1000)}K SGD'],
                ['Approx. Total in INR', `≈ ₹${((c.annualINR * c.durationYears)/100000).toFixed(1)}L`],
              ].map(([k,v])=>(
                <div key={k} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{k}</span>
                  <span className="font-bold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
          </div>


          <CourseRichContent course={c as any} universityName="Embry Riddle Singapore" universitySlug="embry-riddle-singapore" />
          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-lg font-bold mb-2">Apply for {c.name} at Embry-Riddle Aeronautical University Singapore</h2>
            <p className="text-blue-200 text-sm mb-4">Our experts guide you from application to visa. 500+ students placed.</p>
            <Link href="/book-counselling" className="btn-gold inline-block">Book Free Counselling →</Link>
          </div>
        </div>

        <div>
          <div className="sticky top-20 space-y-5">
            <LeadForm source="embry-riddle-singapore-course" defaultCountry="Singapore" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">More Programs at Embry-Riddle Aeronautical University Singapore</h3>
              <div className="space-y-2">
                {embryCourses.filter(x=>x.slug!==slug).slice(0,6).map(x=>(
                  <Link key={x.id} href={`/universities/embry-riddle-singapore/courses/${x.slug}`}
                    className="block text-sm text-brand-700 hover:underline">
                    {x.name} →
                  </Link>
                ))}
              </div>
              <Link href="/universities/embry-riddle-singapore/courses" className="block text-xs text-gray-500 hover:underline mt-3">
                All Embry-Riddle Aeronautical University Singapore programs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
