'use client';

import { useState, FormEvent } from 'react';

export default function InductionPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [videoWatched, setVideoWatched] = useState(false);
  const [agreeSaftey, setAgreeSaftey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isFormValid = firstName.trim() !== '' && lastName.trim() !== '' && videoWatched && agreeSaftey;

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
        body: JSON.stringify({ firstName, lastName }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Thank you! Your induction has been recorded.' });
        // Reset form
        setFirstName('');
        setLastName('');
        setVideoWatched(false);
        setAgreeSaftey(false);
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
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Site Induction</h1>
          <p className="text-blue-100 mt-1">Safety & Compliance Form</p>
        </div>

        {/* Video Section */}
        <div className="w-full aspect-video bg-black relative">
          {/* Replace this source with the actual induction video URL */}
          <video
            className="w-full h-full"
            controls
            poster="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop"
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Checkboxes */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center h-5">
                <input
                  type="checkbox"
                  checked={videoWatched}
                  onChange={(e) => setVideoWatched(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
              <span className="text-sm text-gray-700 leading-tight select-none">
                I have watched the site induction and safety video.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center h-5">
                <input
                  type="checkbox"
                  checked={agreeSaftey}
                  onChange={(e) => setAgreeSaftey(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
              <span className="text-sm text-gray-700 leading-tight select-none">
                I will follow all safety measures as indicated in the video while on this site.
              </span>
            </label>
          </div>

          <hr className="border-gray-100" />

          {/* Name Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] ${isFormValid && !isSubmitting
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Complete Induction'
            )}
          </button>

          {/* Visual indicator when button is hidden */}
          {!isFormValid && !isSubmitting && (
            <p className="text-center text-xs text-gray-500 italic">
              Please watch the video and agree to safety terms to continue.
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            Trident Group Safety System
          </p>
        </div>
      </div>
    </main>
  );
}
