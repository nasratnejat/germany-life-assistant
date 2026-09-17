"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import ResultBadge from "@/components/ResultBadge";
import ResultList from "@/components/ResultList";
import { inputClass, buttonClass } from "@/lib/styles";
const CAPPED_CITIES = [
  "Berlin",
  "München",
  "Hamburg",
  "Köln",
  "Frankfurt am Main",
  "Stuttgart",
];

export default function RentCheckPage() {
  const [city, setCity] = useState("Berlin");
  const [currentRent, setCurrentRent] = useState("800");
  const [proposedRent, setProposedRent] = useState("900");
  const [monthsSinceLastIncrease, setMonthsSinceLastIncrease] = useState("");
  const [letterText, setLetterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiResult, setAiResult] = useState(null);

  const current = parseFloat(currentRent) || 0;
  const proposed = parseFloat(proposedRent) || 0;
  const increaseAmount = proposed - current;
  const increasePercent = current > 0 ? (increaseAmount / current) * 100 : 0;
  const cap = CAPPED_CITIES.includes(city) ? 15 : 20;
  const maxAllowedRent = current * (1 + cap / 100);
  const overCap = increasePercent > cap + 0.01;
  const tooSoon =
    monthsSinceLastIncrease && parseFloat(monthsSinceLastIncrease) < 15;

  const fmt = (n) =>
    n.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €";

  const handleSubmit = async () => {
    if (!letterText.trim()) {
      setError(
        "Paste the justification text from your rent increase letter to run the full check.",
      );
      return;
    }
    setLoading(true);
    setError("");
    setAiResult(null);

    try {
      const response = await fetch("/api/check-rent-increase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentRent: current,
          proposedRent: proposed,
          increasePercent: increasePercent.toFixed(1),
          cap,
          monthsSinceLastIncrease,
          letterText,
        }),
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setAiResult(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Rent Increase Checker"
      description="Check a Mieterhöhung against the legal caps and formal requirements."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current rent (cold, €)
            </label>
            <input
              type="number"
              value={currentRent}
              onChange={(e) => setCurrentRent(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Proposed new rent (€)
            </label>
            <input
              type="number"
              value={proposedRent}
              onChange={(e) => setProposedRent(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
            >
              {CAPPED_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c} (15% cap)
                </option>
              ))}
              <option value="other">Other city (20% cap, usually)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Months since last increase (optional)
            </label>
            <input
              type="number"
              value={monthsSinceLastIncrease}
              onChange={(e) => setMonthsSinceLastIncrease(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div
          className={`rounded-2xl border p-5 ${overCap ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}
        >
          <p className="text-xs text-slate-500">This increase</p>
          <p
            className={`text-2xl font-semibold mt-1 ${overCap ? "text-red-700" : "text-emerald-700"}`}
          >
            {increasePercent.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Cap for {city === "other" ? "most areas" : city}: {cap}% per 3 years
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">
            Maximum rent allowed under the cap
          </p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">
            {fmt(maxAllowedRent)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Based on your current rent × (1 + {cap}%)
          </p>
        </div>
      </div>

      {overCap && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-sm text-red-800">
            The proposed increase ({increasePercent.toFixed(1)}%) is above the{" "}
            {cap}% Kappungsgrenze for{" "}
            {city === "other" ? "most non-designated areas" : city}. This alone
            can make the increase invalid, regardless of what the local
            Mietspiegel says — the cap and the market-rate comparison are two
            separate limits, and the landlord must respect whichever is lower.
          </p>
        </div>
      )}

      {tooSoon && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-sm text-amber-800">
            Rent can normally only be raised this way once every 15 months. You
            entered {monthsSinceLastIncrease} months since the last increase —
            worth double-checking this is correct.
          </p>
        </div>
      )}

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Paste the justification text from your letter (optional, for a full
            check)
          </label>
          <textarea
            value={letterText}
            onChange={(e) => setLetterText(e.target.value)}
            rows={6}
            placeholder="Paste the reasoning your landlord gave — reference to Mietspiegel, comparable apartments, an expert opinion, etc..."
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={buttonClass}
        >
          {loading ? "Checking..." : "Check the full letter"}
        </button>
      </div>

      {aiResult && (
        <div className="mt-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <ResultBadge
              text={aiResult.assessment}
              tone={
                aiResult.assessment === "looks valid"
                  ? "good"
                  : aiResult.assessment === "likely invalid"
                    ? "danger"
                    : "warning"
              }
            />
            <p className="text-sm text-slate-700 mt-3 leading-relaxed">
              {aiResult.summary}
            </p>
          </div>
          <ResultList
            title="Issues found"
            icon="🚩"
            items={aiResult.issues}
            tone="danger"
          />
          <ResultList
            title="Correctly done"
            icon="✅"
            items={aiResult.goodPoints}
            tone="good"
          />
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Recommendation
            </h3>
            <p className="text-sm text-slate-600">{aiResult.recommendation}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        The 15% cap list shown here covers the most commonly cited cities, but
        roughly 627 municipalities across 13 states currently have this
        designation, and some states' ordinances have expiry dates in late 2026
        — if you're unsure, your local Mieterverein can confirm your city's
        exact status. This tool doesn't cover modernization-based increases
        (§559 BGB), which follow different rules entirely.
      </p>
    </PageShell>
  );
}
