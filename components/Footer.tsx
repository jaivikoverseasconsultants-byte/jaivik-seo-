import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-blue-100 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/joc-logo-circle.jpeg" alt="Jaivik Overseas Consultants" className="h-12 w-12 rounded-full" />
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">
              Trusted study abroad consultancy helping students across India achieve their international education dreams since 2012.
            </p>
            <div className="mt-4 space-y-1.5 text-sm">
              <p>📍 333 Orbit Plaza, Crossing Republik,<br />
                <span className="ml-5">Ghaziabad, Uttar Pradesh</span>
              </p>
              <p>📞 <a href="tel:+919971226347" className="hover:text-white">+91-9971226347</a></p>
              <p>📞 <a href="tel:+919971881347" className="hover:text-white">+91-9971881347</a></p>
              <p>📞 <a href="tel:+917428222100" className="hover:text-white">+91-7428222100</a></p>
              <p>☎️ <a href="tel:01204115882" className="hover:text-white">0120-4115882</a></p>
              <p>✉️ <a href="mailto:info@jaivikoverseasconsultants.com" className="hover:text-white">info@jaivikoverseasconsultants.com</a></p>
              <p>
                <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-full transition-colors mt-1">
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Top Destinations</h3>
            <ul className="space-y-2 text-sm">
              {['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'Singapore', 'New Zealand', 'France', 'Netherlands', 'Sweden', 'UAE', 'Denmark', 'Italy', 'Spain'].map(c => (
                <li key={c}>
                  <Link href={`/universities/country/${c.toLowerCase().replace(' ', '-')}`}
                    className="hover:text-white transition-colors">
                    Study in {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Popular Courses</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'MS Computer Science', slug: 'ms-computer-science' },
                { name: 'MS Data Science', slug: 'ms-data-science' },
                { name: 'MBA', slug: 'mba-master-of-business-administration' },
                { name: 'MS AI', slug: 'ms-artificial-intelligence' },
                { name: 'MS Finance', slug: 'ms-finance' },
                { name: 'LLM', slug: 'llm-master-of-laws' },
              ].map(c => (
                <li key={c.slug}>
                  <Link href={`/courses/${c.slug}`} className="hover:text-white transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/universities" className="hover:text-white">All Universities</Link></li>
              <li><Link href="/courses" className="hover:text-white">All Courses</Link></li>
              <li><Link href="/find-my-course" className="hover:text-white">Find My Course</Link></li>
              <li><Link href="/scholarships" className="hover:text-white">Scholarships</Link></li>
              <li><Link href="/scholarships-and-low-budget-guide" className="hover:text-white">Low Budget Study Abroad</Link></li>
              <li><Link href="/course-finder" className="hover:text-white">Course Finder Tool</Link></li>
              <li><Link href="/blog" className="hover:text-white">Study Abroad Blog</Link></li>
              <li><Link href="/visa-guide" className="hover:text-white">Visa Guides 2026</Link></li>
              <li><Link href="/cost-of-living" className="hover:text-white">Cost of Living Abroad</Link></li>
              <li><Link href="/mock-test" className="hover:text-white">Free IELTS Mock Test</Link></li>
              <li><Link href="/book-counselling" className="hover:text-white">Book Free Counselling</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li>
                <a href="https://jaivikoverseasconsultants.com" target="_blank" rel="noopener noreferrer" className="hover:text-white font-semibold text-gold-400">
                  Main Website ↗
                </a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gold-500 rounded-lg">
              <p className="text-white text-xs font-semibold">Book a Free Session</p>
              <p className="text-yellow-100 text-xs mt-1">30-min expert counselling — 100% free</p>
              <Link href="/book-counselling" className="block mt-2 text-xs text-white font-semibold underline">
                Schedule Now →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-blue-300">
          <p>© 2026 Jaivik Overseas Consultants. Data curated in-house.</p>
          <div className="flex items-center gap-4">
            <p>Registered Study Abroad Consultancy | Ghaziabad, Uttar Pradesh, India</p>
            <Link href="/terms" className="hover:text-white underline">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
