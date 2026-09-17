"use client";

import { useState } from "react";
import Link from "next/link";

export default function InterviewPrepPage() {
  const [jobPosting, setJobPosting] = useState("");
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!jobPosting.trim()) {
      setError("Please paste the job posting first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/generate-interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPosting, background }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-teal-600 inline-flex items-center gap-1 mb-6"
        >
          ← Back to Klar
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">
            Interview Prep Generator
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Paste the job posting, get likely interview questions and how to
            answer them.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job posting
            </label>
            <textarea
              value={jobPosting}
              onChange={(e) => setJobPosting(e.target.value)}
              rows={6}
              placeholder="Paste the full job posting here..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Your background (optional)
            </label>
            <textarea
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              rows={4}
              placeholder="A few lines about your experience — helps tailor the questions to gaps or highlights in your profile..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-teal-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? "Preparing..." : "Generate interview prep"}
          </button>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                About this role
              </h3>
              <p className="text-sm text-slate-600">{result.roleContext}</p>
            </div>

            {result.generalTips?.length > 0 && (
              <div className="bg-teal-50 rounded-2xl border border-teal-200 p-6">
                <h3 className="text-sm font-semibold text-teal-800 mb-3">
                  General tips for this interview
                </h3>
                <ul className="space-y-2">
                  {result.generalTips.map((tip, i) => (
                    <li key={i} className="text-sm text-teal-800 flex gap-2">
                      <span>•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              {result.questions?.map((q, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 p-6"
                >
                  <p className="text-sm font-semibold text-slate-800">
                    {q.question}
                  </p>
                  {q.germanPhrasing && (
                    <p className="text-sm text-slate-500 italic mt-1">
                      "{q.germanPhrasing}"
                    </p>
                  )}
                  <div className="mt-3 bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-slate-500 mb-1">
                      How to approach it
                    </p>
                    <p className="text-sm text-slate-600">{q.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
