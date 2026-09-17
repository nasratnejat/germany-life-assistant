"use client";

import { useState } from "react";
import Link from "next/link";

const riskStyles = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

const riskLabels = {
  low: "Looks reasonably safe",
  medium: "Worth being careful",
  high: "High scam risk",
};

export default function ScamCheckPage() {
  const [listingText, setListingText] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!listingText.trim()) {
      setError("Please paste the listing text first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/check-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingText, city, price }),
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
            Apartment Scam Checker
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Paste in a rental listing's description and message text. We'll flag
            patterns commonly seen in rental scams.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                City (optional)
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Berlin"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Monthly rent (optional)
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 650"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Listing description / messages from the landlord
            </label>
            <textarea
              value={listingText}
              onChange={(e) => setListingText(e.target.value)}
              rows={8}
              placeholder="Paste the full listing text here, and any messages the 'landlord' has sent you..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-teal-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check this listing"}
          </button>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <div
              className={`rounded-2xl border p-6 ${riskStyles[result.riskLevel]}`}
            >
              <span className="text-xs font-semibold uppercase tracking-wide">
                {riskLabels[result.riskLevel]}
              </span>
              <p className="text-sm mt-2 leading-relaxed">{result.summary}</p>
            </div>

            {result.redFlags?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">
                  🚩 Red flags found
                </h3>
                <ul className="space-y-2">
                  {result.redFlags.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-red-500">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.goodSigns?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">
                  ✅ Reassuring signs
                </h3>
                <ul className="space-y-2">
                  {result.goodSigns.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-emerald-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                Recommendation
              </h3>
              <p className="text-sm text-slate-600">{result.recommendation}</p>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-400 mt-4 leading-relaxed">
          This is a pattern-based check, not a guarantee — a listing with no red
          flags can still be a scam, and a legitimate listing can occasionally
          trigger a flag. Never send money before viewing a place in person or
          via a verified video call, and never pay a deposit directly to a
          private account before signing a contract.
        </p>
      </div>
    </main>
  );
}
