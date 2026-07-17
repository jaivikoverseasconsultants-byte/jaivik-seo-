import JsonLd from '@/components/JsonLd';
import type { Faq } from '@/lib/course-faqs';
import { authorPersonSchema } from '@/lib/seo';

interface Props {
  faqs: Faq[];
  courseName: string;
}

export default function CourseFaqSection({ faqs, courseName }: Props) {
  if (faqs.length === 0) return null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    author: authorPersonSchema,
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <JsonLd data={faqSchema} />
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Frequently Asked Questions — {courseName}
      </h2>
      <div className="divide-y divide-gray-100">
        {faqs.map((faq, i) => (
          <details key={i} className="group py-3 first:pt-0 last:pb-0" open={i === 0}>
            <summary className="flex items-start justify-between gap-3 cursor-pointer list-none">
              <span className="text-sm font-semibold text-gray-900 leading-snug">{faq.question}</span>
              <span className="flex-shrink-0 mt-0.5 text-brand-700 transition-transform group-open:rotate-45 text-lg leading-none">+</span>
            </summary>
            <p className="text-sm text-gray-700 leading-relaxed mt-2.5 pr-6">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
