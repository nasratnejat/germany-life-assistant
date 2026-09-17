'use client';

import { useState } from 'react';
import Link from 'next/link';

const LANGUAGES = ['English', 'German (simple)', 'Arabic', 'Turkish', 'Persian/Dari', 'Ukrainian', 'Russian'];

export default function InsurancePage() {
  const [image, setImage] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [fileName, setFileName] = useState('');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setError('');

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      setImage(base64);
      setMediaType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!image) {
      setError('Please upload a photo or scan of your policy first.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/explain-insurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, mediaType, language }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-slate-500 hover:text-teal-600 inline-flex items-center gap-1 mb-6">
          ← Back to Klar
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Insurance Policy Explainer</h1>
          <p className="text-slate-500 text-sm mt-1">
            Upload a photo or scan of your insurance policy. We'll break down what's covered, what's not, and anything worth double-checking.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Explain in</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload your policy</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
            />
            {fileName && <p className="text-xs text-slate-500 mt-1">Selected: {fileName}</p>}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-teal-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Explain this policy'}
          </button>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <span className="inline-block bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                {result.documentType}
              </span>
              <p className="text-slate-700 text-sm leading-relaxed">{result.summary}</p>
            </div>

            {result.importantNumbers?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Key numbers</h3>
                <div className="grid grid-cols-2 gap-3">
                  {result.importantNumbers.map((item, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-sm font-medium text-slate-800 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">✅ Covered</h3>
                <ul className="space-y-2">
                  {result.covered?.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-emerald-600">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">🚫 Not covered</h3>
                <ul className="space-y-2">
                  {result.excluded?.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-red-500">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {result.redFlags?.length > 0 && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
                <h3 className="text-sm font-semibold text-amber-800 mb-3">⚠️ Worth double-checking</h3>
                <ul className="space-y-2">
                  {result.redFlags.map((item, i) => (
                    <li key={i} className="text-sm text-amber-800 flex gap-2">
                      <span>•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Recommendation</h3>
              <p className="text-sm text-slate-600">{result.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}