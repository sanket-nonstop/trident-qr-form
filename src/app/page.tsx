'use client';

import { useState, FormEvent, useRef } from 'react';
// import ReCAPTCHA from 'react-google-recaptcha';

export default function InductionPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [videoWatched, setVideoWatched] = useState(false);
  const [agreeSaftey, setAgreeSaftey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const recaptchaRef = useRef<any>(null);

  // Robust validation
  const isFormValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    email.includes('@') &&
    email.includes('.') &&
    videoWatched &&
    agreeSaftey;

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
        body: JSON.stringify({ firstName, lastName, email /*, captchaToken */ }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Thank you! Your induction has been recorded.' });
        setFirstName('');
        setLastName('');
        setEmail('');
        setVideoWatched(false);
        setAgreeSaftey(false);
        // setCaptchaToken(null);
        // recaptchaRef.current?.reset();
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to the server.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-background selection:bg-primary/20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-12 md:mb-20 animate-fade-in text-white">
          <div className="relative inline-flex items-center justify-center p-1 mb-8 group">
            <div className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full transition-all duration-1000 group-hover:bg-primary/40"></div>
            <div className="relative h-24 w-24 flex items-center justify-center rounded-[2.5rem] bg-[#0f172a]/90 border border-primary/30 backdrop-blur-xl shadow-2xl overflow-hidden">
              <img src="/trident.png" alt="Trident Logo" className="w-16 h-16 object-contain" />
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-4 text-white">
            Trident Group <span className="gold-text">Portal</span>
          </h1>

          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-8"></div>

          <p className="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed tracking-wide">
            Please complete the safety induction video and form below before entering the site.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Video Section - Left Column */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative glass-card rounded-[1rem] overflow-hidden group border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none"></div>

              <div className="p-5 bg-black/50 backdrop-blur-md flex items-center justify-between border-b border-primary/20">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-[14px] font-bold text-slate-100 uppercase tracking-[0.2em] ml-2 font-mono">Safety Induction</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
                  <span className="text-[12px] font-bold text-primary uppercase tracking-widest">Mandatory</span>
                </div>
              </div>

              <div className="relative aspect-video bg-black overflow-hidden shadow-inner">
                <video
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  controls
                  poster="/poster.jpg"
                >
                  <source src="mandatory-video.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-6">
              {[
                { title: 'PPE Readiness', desc: 'Ensure all personal protective equipment is verified.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                { title: 'Safety Protocol', desc: 'Strict adherence to site-specific protocols is required.', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
              ].map((item, i) => (
                <div key={i} className="p-8 glass-card rounded-[2.5rem] group hover:border-primary/40 transition-all border-primary/10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                    </svg>
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Section - Right Column */}
          <div className="lg:col-span-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card rounded-[1rem] shadow-2xl relative overflow-hidden backdrop-blur-2xl border-primary/30 bg-slate-900/40">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

              <div className="p-8 md:p-12 relative">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Induction Form</h2>
                  <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/40">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div className="relative group">
                      <label htmlFor="firstName" className="block text-[12px] font-black text-slate-100 uppercase tracking-[0.3em] mb-3 group-focus-within:text-primary transition-colors">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. John"
                        className="premium-input w-full px-6 py-4.5 rounded-2xl text-white outline-none shadow-inner"
                      />
                    </div>
                    <div className="relative group">
                      <label htmlFor="lastName" className="block text-[12px] font-black text-slate-100 uppercase tracking-[0.3em] mb-3 group-focus-within:text-primary transition-colors">Last Name</label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Doe"
                        className="premium-input w-full px-6 py-4.5 rounded-2xl text-white outline-none shadow-inner"
                      />
                    </div>
                    <div className="relative group">
                      <label htmlFor="email" className="block text-[12px] font-black text-slate-100 uppercase tracking-[0.3em] mb-3 group-focus-within:text-primary transition-colors">Email</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.doe@example.com"
                        className="premium-input w-full px-6 py-4.5 rounded-2xl text-white outline-none shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-5 bg-black/60 p-6 rounded-[1.5rem] border border-primary/20">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={videoWatched}
                          onChange={(e) => setVideoWatched(e.target.checked)}
                          className="peer appearance-none w-5 h-5 rounded-md border-2 border-primary/40 bg-slate-900 appearance-none checked:bg-primary checked:border-primary transition-all cursor-pointer shadow-lg"
                        />
                        <svg className="absolute top-1 left-1 w-3 h-3 text-slate-950 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-slate-100 group-hover:text-white transition-colors leading-relaxed">
                        I have watched the Trident Group induction and safety video.
                      </span>
                    </label>

                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={agreeSaftey}
                          onChange={(e) => setAgreeSaftey(e.target.checked)}
                          className="peer appearance-none w-5 h-5 rounded-md border-2 border-primary/40 bg-slate-900 appearance-none checked:bg-primary checked:border-primary transition-all cursor-pointer shadow-lg"
                        />
                        <svg className="absolute top-1 left-1 w-3 h-3 text-slate-950 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-slate-100 group-hover:text-white transition-colors leading-relaxed">
                        I will follow all safety measures indicated while on site.
                      </span>
                    </label>
                  </div>

                  {/* reCAPTCHA (Commented Out)
                  <div className="flex justify-center py-2 overflow-hidden">
                    <div className="transform scale-[0.9] sm:scale-100 origin-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                      />
                    </div>
                  </div>
                  */}

                  {message && (
                    <div className={`p-5 rounded-2xl text-sm font-bold animate-fade-in border ${message.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                      {message.text}
                    </div>
                  )}

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="gold-button w-full py-5 rounded-2xl border border-primary/40"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-3 uppercase font-black">
                          Complete Induction
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </span>
                      )}
                    </button>

                    {/* {!isFormValid && !isSubmitting && (
                      <div className="text-center animate-pulse">
                        <p className="text-[14px] font-black text-primary uppercase tracking-[0.4em]">
                          Safety Verification Required
                        </p>
                      </div>
                    )} */}
                  </div>
                </form>
              </div>

              <div className="px-10 py-5 bg-black/40 border-t border-primary/30 text-center">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Trident Secured Access Protocol
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 md:mt-32 pb-12 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="h-px w-48 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} Trident Group Australia.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
