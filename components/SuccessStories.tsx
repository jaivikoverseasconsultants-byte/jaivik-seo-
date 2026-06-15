const STORIES = [
  { name: 'Priya S.',  initial: 'P', city: 'Ghaziabad', course: 'MSc Data Science',        uni: 'University of Manchester', year: 2025, flag: '🇬🇧', color: 'bg-blue-600' },
  { name: 'Rahul K.',  initial: 'R', city: 'Noida',     course: 'MBA',                      uni: 'University of Warwick',     year: 2025, flag: '🇬🇧', color: 'bg-purple-600' },
  { name: 'Ananya M.', initial: 'A', city: 'Delhi',     course: 'MSc Computer Science',     uni: 'University of Edinburgh',   year: 2024, flag: '🇬🇧', color: 'bg-pink-600' },
  { name: 'Vikram S.', initial: 'V', city: 'Meerut',    course: 'MSc Public Health',        uni: 'McMaster University',       year: 2025, flag: '🇨🇦', color: 'bg-red-600' },
  { name: 'Neha G.',   initial: 'N', city: 'Ghaziabad', course: 'BE Civil Engineering',     uni: 'University of Bath',        year: 2024, flag: '🇬🇧', color: 'bg-green-600' },
  { name: 'Arjun T.',  initial: 'A', city: 'Karnal',    course: 'MSc Biotechnology',        uni: 'University of Glasgow',     year: 2025, flag: '🇬🇧', color: 'bg-orange-600' },
];

export default function SuccessStories() {
  return (
    <section className="py-14 px-4 bg-gradient-to-br from-brand-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold-500/10 text-gold-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            ⭐ Real Students · Real Results
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Students Who Made It Abroad</h2>
          <p className="text-gray-500">From NCR &amp; Haryana to top universities worldwide — guided by Jaivik Overseas</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STORIES.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-11 h-11 rounded-full ${s.color} text-white flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                  {s.initial}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.city}, India · {s.year}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[1,2,3,4,5].map(n => <span key={n} className="text-gold-500 text-sm">★</span>)}
                </div>
              </div>

              <p className="text-sm text-gray-700 italic leading-relaxed mb-4">
                &ldquo;Jaivik Overseas made my dream possible — visa approved in 3 weeks! Their team handled everything from SOP to interview prep. Highly recommend!&rdquo;
              </p>

              <div className="bg-brand-50 rounded-xl p-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base">{s.flag}</span>
                  <div>
                    <p className="text-xs font-bold text-brand-800">{s.course}</p>
                    <p className="text-xs text-brand-600">{s.uni}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="/book-counselling"
            className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Get Your Success Story Started →
          </a>
          <p className="text-xs text-gray-400 mt-2">Free 30-min counselling · No obligation</p>
        </div>
      </div>
    </section>
  );
}
