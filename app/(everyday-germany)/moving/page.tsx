'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'klar_moving_checklist';

const CHECKLIST_ITEMS = [
  { id: 'anmeldung', category: 'Government', title: 'Re-register your address (Ummeldung)', note: 'Legally required within 14 days at the Bürgeramt. Bring your ID and a Wohnungsgeberbestätigung from your new landlord.', urgent: true },
  { id: 'auslaenderbehoerde', category: 'Government', title: 'Update address with the Ausländerbehörde', note: 'If you hold a residence permit, they usually need the new address too — check if yours updates automatically after Ummeldung.', urgent: true },
  { id: 'kfz', category: 'Government', title: 'Update vehicle registration', note: 'If you own a car, the address on your Fahrzeugschein needs to match — required if you moved to a new Zulassungsbezirk.', urgent: false },

  { id: 'bank', category: 'Finance', title: 'Update your bank address', note: 'Usually done in your banking app in a few taps.', urgent: false },
  { id: 'employer', category: 'Finance', title: 'Tell your employer / HR', note: 'Needed for payroll, contracts, and your Lohnsteuerbescheinigung.', urgent: true },
  { id: 'finanzamt', category: 'Finance', title: 'Check your Finanzamt has the new address', note: 'Usually updates automatically from your Ummeldung, but freelancers should double check.', urgent: false },

  { id: 'krankenkasse', category: 'Insurance', title: 'Update your health insurance (Krankenkasse)', note: 'Can usually be done online or via their app.', urgent: false },
  { id: 'haftpflicht', category: 'Insurance', title: 'Update liability insurance (Haftpflichtversicherung)', note: 'Address affects your coverage — don\'t skip this one.', urgent: false },
  { id: 'hausrat', category: 'Insurance', title: 'Update or set up household contents insurance (Hausratversicherung)', note: 'Your coverage amount may need adjusting for the new home\'s size.', urgent: false },

  { id: 'old-landlord', category: 'Housing', title: 'Schedule final walkthrough with old landlord', note: 'Return keys, agree on the state of the apartment, and settle the deposit (Kaution) return.', urgent: true },
  { id: 'nebenkosten-final', category: 'Housing', title: 'Get final Nebenkosten settlement from old landlord', note: 'You may owe money or be owed a refund — ask for the final statement.', urgent: false },
  { id: 'new-mietvertrag', category: 'Housing', title: 'Confirm your new rental contract details', note: 'Move-in date, deposit amount and due date, and what\'s included in Nebenkosten.', urgent: true },

  { id: 'internet', category: 'Utilities', title: 'Sort out internet/phone at the new place', note: 'German ISPs often need weeks of notice — arrange this well before moving day.', urgent: true },
  { id: 'strom', category: 'Utilities', title: 'Set up electricity (Strom) at the new address', note: 'Read the meter on move-out and move-in day and keep the numbers — you\'ll need them.', urgent: true },
  { id: 'gas', category: 'Utilities', title: 'Set up gas, if the new place uses it', note: 'Same meter-reading rule applies as electricity.', urgent: false },
  { id: 'gez', category: 'Utilities', title: 'Update your Rundfunkbeitrag (GEZ) address', note: 'It\'s billed per household, not per person — update it so you\'re not accidentally registered twice.', urgent: false },
  { id: 'nachsendeauftrag', category: 'Utilities', title: 'Set up mail forwarding (Nachsendeauftrag)', note: 'Deutsche Post forwards mail from your old address for a set period — worth it for the first few months.', urgent: false },

  { id: 'hausarzt', category: 'Health', title: 'Find a new doctor nearby, if you moved far', note: 'Ask your old Hausarzt for a copy of your records or a referral.', urgent: false },
  { id: 'zahnarzt', category: 'Health', title: 'Find a new dentist, if needed', note: '', urgent: false },

  { id: 'amazon', category: 'Other', title: 'Update shipping addresses on shopping accounts', note: 'Amazon, other online shops, subscription boxes.', urgent: false },
  { id: 'gym', category: 'Other', title: 'Check gym or club membership terms', note: 'Some let you transfer to a branch near your new place instead of cancelling.', urgent: false },
  { id: 'kita', category: 'Other', title: 'Update Kita/school registration', note: 'Only if you have children in daycare or school.', urgent: false },
];

const CATEGORIES = ['Government', 'Finance', 'Insurance', 'Housing', 'Utilities', 'Health', 'Other'];

export default function MovingChecklistPage() {
  const [checked, setChecked] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch (e) {
      console.error('Could not load saved progress', e);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch (e) {
      console.error('Could not save progress', e);
    }
  }, [checked, loaded]);

  const toggle = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => {
    if (confirm('Uncheck everything and start over?')) {
      setChecked({});
    }
  };

  const doneCount = CHECKLIST_ITEMS.filter((item) => checked[item.id]).length;
  const progress = Math.round((doneCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-slate-500 hover:text-teal-600 inline-flex items-center gap-1 mb-6">
          ← Back to Klar
        </Link>

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Moving Checklist</h1>
            <p className="text-slate-500 text-sm mt-1">Everyone you need to notify when you move in Germany. Your progress is saved automatically.</p>
          </div>
          <button onClick={resetAll} className="text-xs text-slate-400 hover:text-red-500 whitespace-nowrap">Reset</button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600 font-medium">{doneCount} of {CHECKLIST_ITEMS.length} done</span>
            <span className="text-teal-600 font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-teal-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="space-y-6">
          {CATEGORIES.map((category) => {
            const items = CHECKLIST_ITEMS.filter((item) => item.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <h2 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">{category}</h2>
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
                  {items.map((item) => (
                    <label key={item.id} className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={!!checked[item.id]}
                        onChange={() => toggle(item.id)}
                        className="mt-1 w-4 h-4 accent-teal-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${checked[item.id] ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                            {item.title}
                          </span>
                          {item.urgent && !checked[item.id] && (
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">Time-sensitive</span>
                          )}
                        </div>
                        {item.note && <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}