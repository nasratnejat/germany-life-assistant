"use client";

import { useState } from "react";
import PageShell from "../../components/PageShell";
import ResultBadge from "../../components/ResultBadge";
import ResultList from "../../components/ResultList";
import { inputClass, buttonClass } from "../../lib/styles";

const assessmentTone = {
  strong: "good",
  "needs work": "warning",
  "major issues": "danger",
};

export default function CvCheckerPage() {
  const [cvText, setCvText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!cvText.trim()) {
      setError("Please paste your CV text first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/check-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, targetRole }),
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
    <PageShell
      title="Lebenslauf (CV) Checker"
      description="Paste your CV, get it checked against German CV conventions."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Target role (optional)
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Software Developer"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your CV text
          </label>
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            rows={10}
            placeholder="Paste the full text of your CV here..."
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={buttonClass}
        >
          {loading ? "Checking..." : "Check my CV"}
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <ResultBadge
              text={result.assessment}
              tone={assessmentTone[result.assessment] || "neutral"}
            />
            <p className="text-sm text-slate-700 mt-3 leading-relaxed">
              {result.summary}
            </p>
          </div>

          <ResultList
            title="Things to fix"
            icon="🚩"
            items={result.issues}
            tone="danger"
          />
          <ResultList
            title="What you're doing well"
            icon="✅"
            items={result.strengths}
            tone="good"
          />

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Recommendation
            </h3>
            <p className="text-sm text-slate-600">{result.recommendation}</p>
          </div>
        </div>
      )}
    </PageShell>
  );
}
