import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { courses, courseCategories } from '@/data/courses';
import { buildMetadata } from '@/lib/seo';

function slugToCategory(slug: string): string {
  return courseCategories.find(cat =>
    cat.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and') === slug
  ) || '';
}

export async function generateStaticParams() {
  return courseCategories.map(cat => ({
    category: cat.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and'),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return {};
  const catCourses = courses.filter(c => c.category === category);
  return buildMetadata({
    title: `${category} Courses Abroad – Fees, Eligibility & Jobs 2025`,
    description: `Explore ${catCourses.length} ${category} programs available to study abroad from India. Compare fees, job growth, salary, and eligibility. Free guidance from Jaivik Overseas Consultants.`,
    path: `/courses/category/${slug}`,
    keywords: [category, 'courses abroad', 'study abroad India'],
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = slugToCategory(slug);
  if (!category) notFound();

  const catCourses = courses.filter(c => c.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <Link href="/courses" className="hover:text-brand-700">Courses</Link> /
        <span>{category}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category} Courses to Study Abroad</h1>
        <p className="text-gray-500">{catCourses.length} programs available · Compare fees, salary & eligibility</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {catCourses.map(c => (
          <Link key={c.id} href={`/courses/${c.slug}`}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all group">
            <div className="flex justify-between mb-3">
              <span className="badge bg-brand-50 text-brand-700 text-xs">{c.level}</span>
              <span className={`badge text-xs ${c.demandLevel === 'Very High' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                {c.demandLevel}
              </span>
            </div>
            <h2 className="font-bold text-gray-900 group-hover:text-brand-700 mb-3 text-sm">{c.name}</h2>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="font-bold text-brand-700">${(c.avgFeesUSD / 1000).toFixed(0)}K</p>
                <p className="text-gray-400">Avg Fees</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="font-bold text-green-600">${(c.avgSalaryUSD / 1000).toFixed(0)}K/yr</p>
                <p className="text-gray-400">Avg Salary</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">{c.duration} · IELTS {c.eligibility.minIELTS}+</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
