'use client';

import { useState, FormEvent, useRef } from 'react';
// import ReCAPTCHA from 'react-google-recaptcha';

export default function InductionPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [videoWatched, setVideoWatched] = useState(false);
  const [agreeSaftey, setAgreeSaftey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const recaptchaRef = useRef<any>(null);

  const isFormValid = firstName.trim() !== '' && lastName.trim() !== '' && videoWatched && agreeSaftey; // && !!captchaToken;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName /*, captchaToken */ }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Thank you! Your induction has been recorded.' });
        setFirstName('');
        setLastName('');
        setVideoWatched(false);
        setAgreeSaftey(false);
        // setCaptchaToken(null);
        // recaptchaRef.current?.reset();
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong. Please try again.' });
        // setCaptchaToken(null);
        // recaptchaRef.current?.reset();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to the server.' });
      // setCaptchaToken(null);
      // recaptchaRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-6 md:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-blue-600 shadow-xl shadow-blue-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trident Group <span className="text-blue-600">Portal</span>
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Please complete the safety induction video and form below before entering the site.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Video Section - Left Column (8 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="glass-card rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-white">
              <div className="p-4 bg-slate-900 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Safety Induction Video</span>
              </div>
              <div className="relative aspect-video bg-black">
                <video
                  className="w-full h-full object-cover"
                  controls
                  poster="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop"
                >
                  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            <div className="hidden lg:block p-6 glass-card rounded-3xl border-blue-100 bg-blue-50/50">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3">Site Requirements</h3>
              <ul className="grid grid-cols-2 gap-4">
                {[
                  'Wear PPE at all times',
                  'Report all incidents',
                  'Stay in designated areas',
                  'No smoking on site'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-blue-800">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form Section - Right Column (4 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden border border-white">
              <div className="p-6 md:p-8 bg-white/50">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Induction Form
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Inputs */}
                  <div className="space-y-4">
                    <div className="relative group">
                      <label htmlFor="firstName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 transition-colors group-focus-within:text-blue-600">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-slate-900 placeholder:text-slate-300"
                      />
                    </div>
                    <div className="relative group">
                      <label htmlFor="lastName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 transition-colors group-focus-within:text-blue-600">Last Name</label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-slate-900 placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={videoWatched}
                        onChange={(e) => setVideoWatched(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                      />
                      <span className="text-sm font-medium text-slate-700 leading-snug">
                        I have watched the Trident Group induction and safety video.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeSaftey}
                        onChange={(e) => setAgreeSaftey(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                      />
                      <span className="text-sm font-medium text-slate-700 leading-snug">
                        I will follow all safety measures indicated while on site.
                      </span>
                    </label>
                  </div>

                  {/* reCAPTCHA
                  <div className="flex justify-center py-2 overflow-hidden">
                    <div className="transform scale-[0.9] sm:scale-100 origin-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                        onChange={(token) => setCaptchaToken(token)}
                        onExpired={() => setCaptchaToken(null)}
                      />
                    </div>
                  </div>
                  */}

                  {/* Message Display */}
                  {message && (
                    <div className={`p-4 rounded-2xl text-sm font-medium animate-fade-in ${message.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                      {message.text}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`w-full py-4.5 rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden relative ${isFormValid && !isSubmitting
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span>Complete Induction</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </>
                    )}
                  </button>

                  {!isFormValid && !isSubmitting && (
                    <p className="text-center text-xs text-slate-400 font-medium animate-pulse">
                      Pending review of video & safety terms
                    </p>
                  )}
                </form>
              </div>

              <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100/50 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Trident Group Security Secure
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 md:mt-24 pb-8 text-center text-slate-400">
          <p className="text-sm font-medium">© {new Date().getFullYear()} Trident Group Australia. All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  );
}
