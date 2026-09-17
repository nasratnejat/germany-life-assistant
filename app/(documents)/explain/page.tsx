'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

const LANGUAGES = ['English', 'German (simple)', 'Arabic', 'Turkish', 'Persian/Dari', 'Ukrainian', 'Russian'];

export default function ExplainPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [language, setLanguage] = useState('English');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  function handleFileChange(selectedFile) {
    if (!selectedFile) return;
    setFile(selectedFile);
    setResult(null);
    setError('');
    setPreview(URL.createObjectURL(selectedFile));
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files[0]);
  }

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];
      try {
        const response = await fetch('/api/explain-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image, mediaType: file.type, language }),
        });
        const data = await response.json();
        if (!response.ok) setError(data.error || 'Something went wrong');
        else setResult(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  }

  const selectClass =
    'border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 text-white text-xl font-bold mb-3">K</div>
          <h1 className="text-2xl font-semibold text-slate-800">Letter Explainer</h1>
          <p className="text-slate-500 text-sm mt-1">Upload a confusing German letter, get it explained in your language.</p>
          <Link href="/" className="text-teal-600 text-xs mt-2 inline-block hover:underline">← Back to Home</Link>
        </div>

        <div className="mb-3 flex items-center justify-center gap-2">
          <label className="text-xs font-medium text-slate-600">Explain in:</label>
          <select className={selectClass} value={language} onChange={(e) => setLanguage(e.target.value)}>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {!preview ? (
            <label
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl h-48 cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors"
            >
              <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-slate-500">
                <span className="text-teal-600 font-medium">Click to upload</span> or drag a photo here
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files[0])} />
            </label>
          ) : (
            <div className="relative">
              <img src={preview} alt="Uploaded letter" className="w-full h-48 object-contain rounded-xl bg-slate-100" />
              <button onClick={reset} className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-slate-500 hover:text-slate-800">✕</button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="w-full mt-4 bg-teal-600 text-white font-medium py-3 rounded-xl hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {loading ? 'Reading your letter...' : 'Explain this letter'}
          </button>
        </div>

        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">{error}</div>
        )}

        {result && (
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">From</p>
                <p className="font-semibold text-slate-800">{result.sender}</p>
              </div>
              {result.urgent ? (
                <span className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">Urgent</span>
              ) : (
                <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Not urgent</span>
              )}
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-teal-800 mb-1">📄 What this letter is</h3>
              <p className="text-slate-700 text-sm leading-relaxed">{result.summary}</p>
              <p className="text-slate-600 text-sm leading-relaxed mt-2">{result.details}</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-amber-800 mb-1">✅ What you need to do</h3>
              <p className="text-slate-700 text-sm leading-relaxed">{result.actionNeeded}</p>
            </div>

            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-1">⏰ Deadline</h3>
              <p className="text-slate-700 text-sm leading-relaxed">{result.deadline}</p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}