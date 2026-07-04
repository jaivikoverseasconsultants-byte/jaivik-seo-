'use client';
import { useState } from 'react';

interface Props {
  universityName: string;
}

export default function UniversityLeadCapture({ universityName }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 10) return;
    setSubmitted(true);
    const msg = encodeURIComponent(
      `Hi Jaivik Overseas! I'm ${name} (WhatsApp: ${phone}). I want verified 2026 fee & admission data for ${universityName}. Interested in: ${course || 'General Inquiry'}.`
    );
    setTimeout(() => {
      window.open(`https://wa.me/919971226347?text=${msg}`, '_blank');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-blue-700 rounded-2xl p-5 text-white shadow-lg">
        {!submitted ? (
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-blue-200 mb-1 uppercase tracking-wide">Limited Seats · Free Service</p>
              <h2 className="text-lg font-bold leading-snug mb-1">
                Get Verified 2026 Fee &amp; Admission Data for {universityName}
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Our counsellors will send you verified tuition fees, IELTS requirements, and scholarship details within 30 minutes
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="px-3.5 py-2.5 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-32"
              />
              <input
                type="tel"
                placeholder="WhatsApp Number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                required
                maxLength={12}
                className="px-3.5 py-2.5 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-36"
              />
              <input
                type="text"
                placeholder="Interested Course"
                value={course}
                onChange={e => setCourse(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-36"
              />
              <button
                type="submit"
                className="bg-white text-blue-700 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors whitespace-nowrap flex items-center gap-2 justify-center"
              >
                <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Get Free Data on WhatsApp
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-lg font-bold">✅ Opening WhatsApp…</p>
            <p className="text-blue-100 text-sm mt-1">Our counsellors will respond within 30 minutes</p>
          </div>
        )}
      </div>
    </div>
  );
}
