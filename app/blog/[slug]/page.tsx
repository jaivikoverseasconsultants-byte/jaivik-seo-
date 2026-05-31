import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts, getBlogPostBySlug, type ContentBlock } from '@/data/blog-posts';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${slug}`,
    keywords: post.tags,
  });
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-3 leading-snug">
          {block.content}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={index} className="text-lg font-bold text-gray-800 mt-6 mb-2 leading-snug">
          {block.content}
        </h3>
      );
    case 'p':
      return (
        <p key={index} className="text-gray-700 text-sm leading-relaxed mb-4">
          {block.content}
        </p>
      );
    case 'ul':
      return (
        <ul key={index} className="space-y-2 mb-4 ml-1">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={index} className="space-y-2 mb-4 ml-1">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      );
    case 'table':
      return (
        <div key={index} className="overflow-x-auto mb-5 rounded-xl border border-gray-200">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="bg-brand-700 text-white">
                {block.headers?.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows?.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-4 py-3 text-gray-700 ${ci === 0 ? 'font-semibold' : ''}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout':
      return (
        <div key={index} className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-4 mb-4">
          <p className="text-sm text-blue-800 leading-relaxed">{block.content}</p>
        </div>
      );
    case 'tip':
      return (
        <div key={index} className="bg-gold-50 border border-gold-200 rounded-2xl p-4 mb-4">
          <p className="text-sm text-gold-800 leading-relaxed">{block.content}</p>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = blogPosts.filter(p => p.slug !== slug && (
    p.category === post.category || p.tags.some(t => post.tags.includes(t))
  )).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Jaivik Overseas Consultants',
    },
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'Jaivik Overseas Consultants',
      url: 'https://study.jaivikoverseasconsultants.com',
    },
    url: `https://study.jaivikoverseasconsultants.com/blog/${slug}`,
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <JsonLd data={articleSchema} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/blog" className="hover:text-white">Blog</Link> /
            <span className="text-white truncate max-w-[200px] sm:max-w-none">{post.title}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <span className="inline-block bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {post.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">{post.title}</h1>
              <p className="text-blue-200 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-blue-300">
                <span>📅 {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>⏱ {post.readTime} min read</span>
                <span>✏️ Updated {new Date(post.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-white/10 text-white px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={`blog-${slug}`} compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <article className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            {post.content.map((block, i) => renderBlock(block, i))}
          </article>

          {/* Related links */}
          {post.relatedLinks.length > 0 && (
            <div className="mt-6 bg-brand-50 rounded-2xl p-5 border border-brand-100">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">🔗 Useful Links</h3>
              <div className="flex flex-wrap gap-2">
                {post.relatedLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm bg-white border border-brand-200 text-brand-700 px-4 py-2 rounded-xl hover:bg-brand-700 hover:text-white transition-all font-medium"
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPosts.map(p => (
                  <Link key={p.slug} href={`/blog/${p.slug}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all group">
                    <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full mb-2 inline-block">{p.category}</span>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-700 leading-snug">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{p.readTime} min read →</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-20 space-y-5">
            <LeadForm source={`blog-sidebar-${slug}`} defaultCountry="" />

            {/* CTA block */}
            <div className="bg-brand-700 text-white rounded-2xl p-5">
              <p className="font-bold mb-2 text-sm">📞 Need Expert Help?</p>
              <p className="text-blue-200 text-xs mb-4">Our counsellors have guided 500+ Indian students. Book your free 30-min session today.</p>
              <Link href="/book-counselling" className="block text-center bg-gold-500 hover:bg-gold-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-colors">
                Book Free Session →
              </Link>
              <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
                className="block text-center mt-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-colors">
                💬 WhatsApp Us
              </a>
            </div>

            {/* More articles */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">More Articles</h3>
              {blogPosts.filter(p => p.slug !== slug).slice(0, 5).map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`}
                  className="block py-2 border-b border-gray-50 last:border-0 group">
                  <p className="text-xs font-medium text-gray-800 group-hover:text-brand-700 leading-snug">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.readTime} min · {p.category}</p>
                </Link>
              ))}
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Links</h3>
              {[
                { href: '/mock-test', label: '📝 Free IELTS Mock Test' },
                { href: '/course-finder', label: '🔍 Course Finder' },
                { href: '/universities', label: '🎓 All Universities' },
                { href: '/book-counselling', label: '📞 Book Counselling' },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="block py-2 border-b border-gray-50 last:border-0 text-xs font-medium text-brand-700 hover:text-brand-900">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
