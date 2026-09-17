'use client';
import { useState } from 'react';
import Link from 'next/link';
import { jsPDF } from 'jspdf';

export default function CoverLetterPage() {
  const [form, setForm] = useState({
    yourName: '',
    jobPosting: '',
    background: '',
  });
  const [letter, setLetter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setLetter('');
    setError('');

    try {
      const response = await fetch('/api/generate-coverletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) setError(data.error || 'Something went wrong');
      else setLetter(data.letter);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadPDF() {
    const doc = new jsPDF();
    const margin = 20;
    const maxWidth = 170;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.getHeight();

    const lines = doc.splitTextToSize(letter, maxWidth);
    doc.setFontSize(11);

    let cursorY = margin;
    lines.forEach((line) => {
      if (cursorY > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    });

    doc.save('cover-letter.pdf');
  }

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';
  const textareaClass = inputClass + ' resize-none';

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 text-white text-xl font-bold mb-3">K</div>
          <h1 className="text-2xl font-semibold text-slate-800">Cover Letter Maker</h1>
          <p className="text-slate-500 text-sm mt-1">Paste a job posting and your background, get a formatted German-style Anschreiben.</p>
          <Link href="/" className="text-teal-600 text-xs mt-2 inline-block hover:underline">← Back to Home</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Your name</label>
            <input className={inputClass} value={form.yourName} onChange={(e) => update('yourName', e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Paste the job posting</label>
            <textarea
              className={textareaClass}
              rows={5}
              value={form.jobPosting}
              onChange={(e) => update('jobPosting', e.target.value)}
              placeholder="Paste the full job description here..."
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Your background (skills, experience, why you're a good fit)</label>
            <textarea
              className={textareaClass}
              rows={5}
              value={form.background}
              onChange={(e) => update('background', e.target.value)}
              placeholder="e.g. 3 years as a mechanical engineer, fluent in English and German, led a team of 4..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.yourName || !form.jobPosting || !form.background || loading}
            className="w-full bg-teal-600 text-white font-medium py-3 rounded-xl hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Writing your cover letter...' : 'Generate cover letter'}
          </button>
        </div>

        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">{error}</div>
        )}

        {letter && (
          <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Your cover letter</h3>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="text-xs font-medium text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full hover:bg-teal-100"
                >
                  {copied ? 'Copied!' : 'Copy text'}
                </button>
                <button
                  onClick={downloadPDF}
                  className="text-xs font-medium text-white bg-teal-600 px-3 py-1.5 rounded-full hover:bg-teal-700"
                >
                  Download PDF
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">{letter}</pre>
          </div>
        )}

      </div>
    </main>
  );
}