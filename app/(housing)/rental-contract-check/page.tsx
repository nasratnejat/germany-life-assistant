"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { textareaClass, buttonClass } from "@/lib/styles";

export default function RentalContractCheck() {
  const [contractText, setContractText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contractText.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/check-rental-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <PageShell
      icon={
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6M9 8h6M5 5h14a1 1 0 011 1v13.586a1 1 0 01-1.707.707L15 17H6l-3.293 3.293A1 1 0 011 19.586V6a1 1 0 011-1z"
          />
        </svg>
      }
      title="Rental Contract Checker"
      description="Paste your Mietvertrag and get unusual clauses, deposit terms, and notice periods flagged."
      wide
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 space-y-3"
      >
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">
            Paste your rental contract text
          </label>
          <textarea
            className={textareaClass}
            rows={10}
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="Paste the full text of your Mietvertrag here..."
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button type="submit" className={buttonClass} disabled={loading}>
          {loading ? "Analyzing..." : "Check contract"}
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 mb-3">
              Summary
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Deposit (Kaution)
              </p>
              <p className="text-sm text-slate-800 font-medium">
                {result.depositAmount}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {result.depositAssessment}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Notice Period (Kündigungsfrist)
              </p>
              <p className="text-sm text-slate-800 font-medium">
                {result.noticePeriod}
              </p>
            </div>
          </div>

          {result.flaggedClauses?.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-amber-800 mb-3">
                ⚠️ Worth double-checking
              </p>
              <ul className="space-y-2">
                {result.flaggedClauses.map((clause, i) => (
                  <li key={i} className="text-sm text-amber-800 flex gap-2">
                    <span>•</span>
                    <span>{clause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.standardClauses?.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-emerald-800 mb-3">
                ✅ Standard, nothing to worry about
              </p>
              <ul className="space-y-2">
                {result.standardClauses.map((clause, i) => (
                  <li key={i} className="text-sm text-emerald-800 flex gap-2">
                    <span>•</span>
                    <span>{clause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Recommendation
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {result.recommendation}
            </p>
          </div>
        </div>
      )}
    </PageShell>
  );
}
