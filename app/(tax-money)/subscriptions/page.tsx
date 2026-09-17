'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState([
    { name: '', cost: '', usage: '' },
    { name: '', cost: '', usage: '' },
    { name: '', cost: '', usage: '' },
  ]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateSub(index, field, value) {
    setSubs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addRow() {
    setSubs((prev) => [...prev, { name: '', cost: '', usage: '' }]);
  }

  function removeRow(index) {
    setSubs((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    const validSubs = subs.filter((s) => s.name && s.cost);
    if (validSubs.length === 0) return;

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch('/api/check-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptions: validSubs }),
      });
      const data = await response.json();
      if (!response.ok) setError(data.error || 'Something went wrong');
      else setResult(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  const inputClass =
    'border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 text-white text-xl font-bold mb-3">K</div>
          <h1 className="text-2xl font-semibold text-slate-800">Subscription Checker</h1>
          <p className="text-slate-500 text-sm mt-1">List what you're paying for each month, see what's worth cutting.</p>
          <Link href="/" className="text-teal-600 text-xs mt-2 inline-block hover:underline">← Back to Home</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

          <div className="grid grid-cols-[1fr_90px_1fr_28px] gap-2 mb-2 px-1">
            <span className="text-xs font-medium text-slate-500">Name</span>
            <span className="text-xs font-medium text-slate-500">€/month</span>
            <span className="text-xs font-medium text-slate-500">How often used</span>
            <span></span>
          </div>

          <div className="space-y-2">
            {subs.map((sub, i) => (
              <div key={i} className="grid grid-cols-[1fr_90px_1fr_28px] gap-2">
                <input
                  className={inputClass}
                  placeholder="Netflix"
                  value={sub.name}
                  onChange={(e) => updateSub(i, 'name', e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="12.99"
                  value={sub.cost}
                  onChange={(e) => updateSub(i, 'cost', e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="e.g. rarely"
                  value={sub.usage}
                  onChange={(e) => updateSub(i, 'usage', e.target.value)}
                />
                <button
                  onClick={() => removeRow(i)}
                  className="text-slate-400 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addRow}
            className="text-teal-600 text-xs font-medium mt-3 hover:underline"
          >
            + Add another subscription
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 bg-teal-600 text-white font-medium py-3 rounded-xl hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Checking your subscriptions...' : 'Check my subscriptions'}
          </button>
        </div>

        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">{error}</div>
        )}

        {result && (
          <div className="mt-5 space-y-3">

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Per month</p>
                <p className="font-semibold text-slate-800 text-lg">{result.totalMonthly}</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Per year</p>
                <p className="font-semibold text-slate-800 text-lg">{result.totalYearly}</p>
              </div>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-teal-800 mb-1">💡 Summary</h3>
              <p className="text-slate-700 text-sm leading-relaxed">{result.summary}</p>
            </div>

            {result.flagged?.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-amber-800 mb-3">✂️ Worth reconsidering</h3>
                <div className="space-y-3">
                  {result.flagged.map((item, i) => (
                    <div key={i} className="border-b border-amber-100 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between text-sm font-medium text-slate-800">
                        <span>{item.name}</span>
                        <span>{item.monthlyCost}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}