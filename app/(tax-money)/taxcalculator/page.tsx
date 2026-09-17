'use client';
import { useState } from 'react';
import Link from 'next/link';

// 2026 German income tax brackets (§32a EStG) — rates increase in a straight line
// within each zone, so averaging the start/end rate over the zone gives an accurate estimate.
const TAX_BRACKETS = [
  { start: 0, end: 12348, rateStart: 0, rateEnd: 0 },
  { start: 12348, end: 17799, rateStart: 0.14, rateEnd: 0.2397 },
  { start: 17799, end: 69878, rateStart: 0.2397, rateEnd: 0.42 },
  { start: 69878, end: 277825, rateStart: 0.42, rateEnd: 0.42 },
  { start: 277825, end: Infinity, rateStart: 0.45, rateEnd: 0.45 },
];

function estimateIncomeTax(taxableIncome) {
  let tax = 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.start) break;
    const incomeInBracket = Math.min(taxableIncome, bracket.end) - bracket.start;
    if (incomeInBracket <= 0) continue;
    const avgRate = (bracket.rateStart + bracket.rateEnd) / 2;
    tax += incomeInBracket * avgRate;
  }
  return tax;
}

const KLEINUNTERNEHMER_LAST_YEAR_LIMIT = 25000;
const KLEINUNTERNEHMER_THIS_YEAR_LIMIT = 100000;

export default function TaxCalculatorPage() {
  const [revenue, setRevenue] = useState('');
  const [profit, setProfit] = useState('');
  const [result, setResult] = useState(null);

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';

  function handleCalculate() {
    const revenueNum = parseFloat(revenue) || 0;
    const profitNum = parseFloat(profit) || 0;

    const qualifiesKleinunternehmer =
      revenueNum <= KLEINUNTERNEHMER_LAST_YEAR_LIMIT || revenueNum <= KLEINUNTERNEHMER_THIS_YEAR_LIMIT;

    const annualTax = estimateIncomeTax(profitNum);
    const monthlySetAside = annualTax / 12;

    setResult({
      qualifiesKleinunternehmer,
      annualTax,
      monthlySetAside,
      effectiveRate: profitNum > 0 ? (annualTax / profitNum) * 100 : 0,
    });
  }

  function formatEuro(value) {
    return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 text-white text-xl font-bold mb-3">K</div>
          <h1 className="text-2xl font-semibold text-slate-800">Freelancer Tax Calculator</h1>
          <p className="text-slate-500 text-sm mt-1">A rough estimate of your Kleinunternehmer status and tax set-aside.</p>
          <Link href="/" className="text-teal-600 text-xs mt-2 inline-block hover:underline">← Back to Home</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Expected gross revenue this year (€)</label>
            <input
              className={inputClass}
              type="number"
              placeholder="e.g. 18000"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-1">Total money coming in, before expenses. Used to check Kleinunternehmer status.</p>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Expected net profit this year (€)</label>
            <input
              className={inputClass}
              type="number"
              placeholder="e.g. 14000"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-1">Revenue minus business expenses. This is what income tax is actually calculated on.</p>
          </div>

          <button
            onClick={handleCalculate}
            disabled={!revenue || !profit}
            className="w-full bg-teal-600 text-white font-medium py-3 rounded-xl hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="mt-5 space-y-3">

            <div className={`rounded-2xl border p-5 ${result.qualifiesKleinunternehmer ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
              <h3 className={`text-sm font-semibold mb-1 ${result.qualifiesKleinunternehmer ? 'text-green-800' : 'text-amber-800'}`}>
                {result.qualifiesKleinunternehmer ? '✅ You likely qualify for Kleinunternehmer status' : '⚠️ You likely don\'t qualify for Kleinunternehmer status'}
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                {result.qualifiesKleinunternehmer
                  ? 'This means you don\'t have to charge VAT (Umsatzsteuer) on your invoices, which keeps things simpler.'
                  : 'Your expected revenue is above the current limits, so you\'ll likely need to charge VAT on your invoices like a regular business.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Estimated yearly tax</p>
                <p className="font-semibold text-slate-800 text-lg">{formatEuro(result.annualTax)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Set aside per month</p>
                <p className="font-semibold text-slate-800 text-lg">{formatEuro(result.monthlySetAside)}</p>
              </div>
            </div>

            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed">
              This is a rough estimate based on 2026 income tax brackets, for planning purposes only — it doesn't include church tax, solidarity surcharge, health insurance, or pension contributions. Talk to a Steuerberater or use the official Elster calculator before relying on this for real decisions.
            </div>

          </div>
        )}

      </div>
    </main>
  );
}