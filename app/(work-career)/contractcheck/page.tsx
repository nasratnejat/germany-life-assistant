"use client";

import { useState } from "react";
import PageShell from "../../components/PageShell";
import ResultBadge from "../../components/ResultBadge";
import ResultList from "../../components/ResultList";
import { inputClass, buttonClass } from "../../lib/styles";

const assessmentTone = {
  "looks standard": "good",
  "some concerns": "warning",
  "significant concerns": "danger",
};

export default function ContractCheckPage() {
  const [contractText, setContractText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!contractText.trim()) {
      setError("Please paste your contract text first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/check-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText }),
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
      title="Employment Contract Checker"
      description="Paste your Arbeitsvertrag and get it checked against German employment standards."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your employment contract text
          </label>
          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            rows={12}
            placeholder="Paste the full text of your contract here..."
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={buttonClass}
        >
          {loading ? "Checking..." : "Check my contract"}
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

          {result.keyTerms?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                Key terms found
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {result.keyTerms.map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="text-sm font-medium text-slate-800 mt-0.5">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ResultList
            title="Things to look into"
            icon="🚩"
            items={result.redFlags}
            tone="danger"
          />
          <ResultList
            title="Standard or favorable terms"
            icon="✅"
            items={result.goodPoints}
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

      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        This is a pattern-based check based on general German employment law
        norms, not legal advice. For anything that looks genuinely concerning, a
        Fachanwalt für Arbeitsrecht or your local Mieterverein/Gewerkschaft
        (e.g. ver.di) can review your specific contract properly — often for
        free or low cost if you're a member.
      </p>
    </PageShell>
  );
}
