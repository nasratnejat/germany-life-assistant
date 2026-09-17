'use client';

import { useState } from 'react';
import Link from 'next/link';

const STATES = {
  BW: 'Baden-Württemberg',
  BY: 'Bayern',
  BE: 'Berlin',
  BB: 'Brandenburg',
  HB: 'Bremen',
  HH: 'Hamburg',
  HE: 'Hessen',
  MV: 'Mecklenburg-Vorpommern',
  NI: 'Niedersachsen',
  NW: 'Nordrhein-Westfalen',
  RP: 'Rheinland-Pfalz',
  SL: 'Saarland',
  SN: 'Sachsen',
  ST: 'Sachsen-Anhalt',
  SH: 'Schleswig-Holstein',
  TH: 'Thüringen',
};

const ALL_STATES = Object.keys(STATES);

// 2026 dates
const HOLIDAYS_2026 = [
  { date: '2026-01-01', name: 'Neujahr', states: ALL_STATES },
  { date: '2026-01-06', name: 'Heilige Drei Könige', states: ['BW', 'BY', 'ST'] },
  { date: '2026-03-08', name: 'Internationaler Frauentag', states: ['BE', 'MV'] },
  { date: '2026-04-03', name: 'Karfreitag', states: ALL_STATES },
  { date: '2026-04-05', name: 'Ostersonntag', states: ['BB'] },
  { date: '2026-04-06', name: 'Ostermontag', states: ALL_STATES },
  { date: '2026-05-01', name: 'Tag der Arbeit', states: ALL_STATES },
  { date: '2026-05-14', name: 'Christi Himmelfahrt', states: ALL_STATES },
  { date: '2026-05-24', name: 'Pfingstsonntag', states: ['BB'] },
  { date: '2026-05-25', name: 'Pfingstmontag', states: ALL_STATES },
  { date: '2026-06-04', name: 'Fronleichnam', states: ['BW', 'BY', 'HE', 'NW', 'RP', 'SL'] },
  { date: '2026-08-15', name: 'Mariä Himmelfahrt', states: ['SL'] },
  { date: '2026-10-03', name: 'Tag der Deutschen Einheit', states: ALL_STATES },
  { date: '2026-10-31', name: 'Reformationstag', states: ['BB', 'HB', 'HH', 'MV', 'NI', 'SN', 'ST', 'SH', 'TH'] },
  { date: '2026-11-01', name: 'Allerheiligen', states: ['BW', 'BY', 'NW', 'RP', 'SL'] },
  { date: '2026-11-18', name: 'Buß- und Bettag', states: ['SN'] },
  { date: '2026-12-25', name: '1. Weihnachtstag', states: ALL_STATES },
  { date: '2026-12-26', name: '2. Weihnachtstag', states: ALL_STATES },
];

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${WEEKDAYS[d.getDay()]}, ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

export default function HolidaysPage() {
  const [state, setState] = useState('BE');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const holidays = HOLIDAYS_2026.filter((h) => h.states.includes(state));

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-slate-500 hover:text-teal-600 inline-flex items-center gap-1 mb-6">
          ← Back to Klar
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Public Holidays 2026</h1>
          <p className="text-slate-500 text-sm mt-1">Offices, Bürgeramt appointments, and deliveries all stop on these days — pick your state to see which ones apply to you.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">Your state (Bundesland)</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
          >
            {ALL_STATES.map((code) => (
              <option key={code} value={code}>{STATES[code]}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {holidays.map((h) => {
            const d = new Date(h.date + 'T00:00:00');
            const isPast = d < today;
            const isNationwide = h.states.length === ALL_STATES.length;
            return (
              <div key={h.date} className={`flex items-center justify-between p-4 ${isPast ? 'opacity-40' : ''}`}>
                <div>
                  <p className="text-sm font-medium text-slate-800">{h.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDate(h.date)}</p>
                </div>
                {!isNationwide && (
                  <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                    Regional
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 mt-4 leading-relaxed">
          Bavaria also observes Mariä Himmelfahrt and parts of Saxony/Thuringia observe Fronleichnam, but only in specific
          municipalities with majority-Catholic populations — not statewide, so they're left off this list. Check locally if you're in one of those areas.
        </p>
      </div>
    </main>
  );
}