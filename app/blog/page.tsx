import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { blogPosts, blogCategories } from '@/data/blog-posts';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Study Abroad Blog 2026 – Tips, Guides & University Advice | Jaivik Overseas',
  description: 'Expert advice for Indian students studying abroad. IELTS tips, visa guides, SOP writing, scholarship lists, country comparisons, and university admission strategies.',
  path: '/blog',
  keywords: [
    'study abroad blog',
    'IELTS tips for Indian students',
    'how to study in Canada',
    'study abroad visa guide',
    'best countries to study from India',
  ],
});

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Jaivik Overseas Study Abroad Blog',
  description: 'Expert study abroad advice for Indian students — IELTS, visa, SOP, scholarships and university guides.',
  url: 'https://study.jaivikoverseasconsultants.com/blog',
  publisher: {
    '@type': 'EducationalOrganization',
    name: 'Jaivik Overseas Consultants',
    url: 'https://study.jaivikoverseasconsultants.com',
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  'Country Guides': '🌍',
  'IELTS & Tests': '📝',
  'Visa Guides': '🛂',
  'Application Tips': '✍️',
  'Scholarships': '🎓',
  'Course Guidance': '📚',
  'Country Comparison': '⚖️',
};

export default function BlogPage() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <>
      <JsonLd data={blogSchema} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            📖 Study Abroad Knowledge Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Study Abroad Blog</h1>
          <p className="text-blue-200 text-sm max-w-xl mx-auto">
            Expert guides, visa tips, IELTS advice, and university insights for Indian students in 2026.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-xs font-semibold text-gray-600 self-center mr-1">Browse by:</span>
          {blogCategories.map(cat => (
            <Link
              key={cat}
              href={`/blog?category=${encodeURIComponent(cat)}`}
              className="inline-flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:border-brand-300 hover:text-brand-700 transition-all"
            >
              {CATEGORY_ICONS[cat] || '📌'} {cat}
            </Link>
          ))}
        </div>

        {/* Featured post */}
        <div className="mb-10">
          <Link href={`/blog/${featured.slug}`} className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-brand-200 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-2 bg-gradient-to-br from-brand-700 to-blue-900 p-10 flex items-center justify-center min-h-[180px]">
                <div className="text-center text-white">
                  <p className="text-5xl mb-3">{CATEGORY_ICONS[featured.category] || '📌'}</p>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{featured.category}</span>
                </div>
              </div>
              <div className="lg:col-span-3 p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-gold-50 text-gold-700 font-semibold px-2.5 py-1 rounded-full">⭐ Featured</span>
                    <span className="text-xs text-gray-400">{featured.readTime} min read</span>
                    <span className="text-xs text-gray-400">{new Date(featured.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-brand-700 mb-2 leading-snug">{featured.title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{featured.excerpt}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featured.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                  <span className="text-xs text-brand-700 font-semibold ml-auto self-center">Read article →</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* All posts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex flex-col">
              {/* Card header */}
              <div className="bg-gradient-to-br from-brand-50 to-blue-50 px-6 py-8 flex items-center justify-center">
                <span className="text-4xl">{CATEGORY_ICONS[post.category] || '📌'}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-brand-50 text-brand-700 font-medium px-2 py-0.5 rounded-full">{post.category}</span>
                  <span className="text-xs text-gray-400">{post.readTime} min</span>
                </div>
                <h2 className="font-bold text-gray-900 group-hover:text-brand-700 text-sm leading-snug mb-2 flex-1">{post.title}</h2>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                  <span className="text-xs text-gray-400">{new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="text-xs text-brand-700 font-semibold">Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-brand-700 text-white rounded-3xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Have questions? Talk to an expert.</h2>
          <p className="text-blue-200 text-sm mb-5">Our counsellors have helped 500+ Indian students — free 30-min session, no obligation.</p>
          <Link href="/book-counselling" className="btn-gold inline-block">Book Free Counselling →</Link>
        </div>
      </div>
    </>
  );
}
