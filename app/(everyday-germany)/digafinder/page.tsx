'use client';
import { useState } from 'react';
import Link from 'next/link';

const DIGA_APPS = [
  { name: 'Kaia Rückenschmerzen', condition: 'Back pain', keywords: ['back pain', 'rückenschmerzen', 'back', 'rücken'], description: 'Home-based back training program with guided exercises.' },
  { name: 'Vivira', condition: 'Back pain / joint pain', keywords: ['back pain', 'rückenschmerzen', 'joint pain', 'osteoarthritis', 'knee', 'arthrose'], description: 'Physical therapy support for back and joint pain.' },
  { name: 'Invirto', condition: 'Anxiety', keywords: ['anxiety', 'angst', 'panic', 'phobia'], description: 'Structured therapy program for anxiety disorders and panic attacks.' },
  { name: 'Novego: Ängste überwinden', condition: 'Anxiety', keywords: ['anxiety', 'angst', 'fear'], description: 'Guided program to manage and overcome anxiety.' },
  { name: 'velibra', condition: 'Anxiety / social anxiety', keywords: ['anxiety', 'angst', 'social anxiety'], description: 'Support for anxiety disorders including social anxiety.' },
  { name: 'deprexis', condition: 'Depression', keywords: ['depression', 'low mood', 'sadness'], description: 'Automated online intervention for depressive symptoms.' },
  { name: 'Selfapys Online-Kurs bei Depression', condition: 'Depression', keywords: ['depression', 'low mood'], description: 'Online course-based therapy support for depression.' },
  { name: 'somnio', condition: 'Insomnia', keywords: ['insomnia', 'sleep', 'schlaflosigkeit', 'schlafstörung'], description: 'Evidence-based program to improve sleep quality.' },
  { name: 'HelloBetter Schlafen', condition: 'Insomnia', keywords: ['insomnia', 'sleep', 'schlaf'], description: 'Sleep coaching based on cognitive behavioral therapy.' },
  { name: 'glucura Diabetestherapie', condition: 'Diabetes (type 2)', keywords: ['diabetes', 'blood sugar', 'zucker'], description: 'Support program for managing type 2 diabetes.' },
  { name: 'Vitadio', condition: 'Diabetes (type 2)', keywords: ['diabetes', 'blood sugar'], description: 'Coaching app for type 2 diabetes management.' },
  { name: 'Kalmeda', condition: 'Tinnitus', keywords: ['tinnitus', 'ringing ears', 'ohrgeräusche'], description: 'Counseling and coping program for tinnitus.' },
  { name: 'zanadio', condition: 'Obesity / weight management', keywords: ['obesity', 'weight loss', 'übergewicht', 'adipositas'], description: 'Structured weight management program.' },
  { name: 'Oviva Direkt für Adipositas', condition: 'Obesity / weight management', keywords: ['obesity', 'weight', 'nutrition', 'adipositas'], description: 'Nutrition-based program for obesity treatment.' },
  { name: 'Endo-App', condition: 'Endometriosis', keywords: ['endometriosis', 'endometriose'], description: 'Symptom tracking and management for endometriosis.' },
  { name: 'NichtraucherHelden-App', condition: 'Smoking cessation', keywords: ['smoking', 'quit smoking', 'rauchen', 'nichtraucher'], description: 'Structured program to help quit smoking.' },
  { name: 'PINK! Coach', condition: 'Breast cancer support', keywords: ['breast cancer', 'brustkrebs', 'cancer'], description: 'Support and coaching for people with breast cancer.' },
];

export default function DigaFinderPage() {
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? DIGA_APPS.filter((app) => {
        const q = query.toLowerCase();
        return (
          app.name.toLowerCase().includes(q) ||
          app.condition.toLowerCase().includes(q) ||
          app.keywords.some((k) => k.includes(q))
        );
      })
    : [];

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 text-white text-xl font-bold mb-3">K</div>
          <h1 className="text-2xl font-semibold text-slate-800">Health App Finder</h1>
          <p className="text-slate-500 text-sm mt-1">Search a health condition to see if a doctor-prescribable app exists for it.</p>
          <Link href="/" className="text-teal-600 text-xs mt-2 inline-block hover:underline">← Back to Home</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <input
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="e.g. back pain, anxiety, diabetes, tinnitus..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="mt-4 space-y-3">
          {query.trim() && results.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-sm text-slate-500 text-center">
              No matches in this starter list for "{query}". Check the full official directory at{' '}
              <a href="https://diga.bfarm.de" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                diga.bfarm.de
              </a>.
            </div>
          )}

          {results.map((app, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-slate-800">{app.name}</h3>
                <span className="bg-teal-100 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ml-2">
                  {app.condition}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{app.description}</p>
              <p className="text-xs text-slate-400 mt-2">Ask your doctor about this — it may be covered by your health insurance.</p>
            </div>
          ))}
        </div>

        {!query.trim() && (
          <p className="text-center text-xs text-slate-400 mt-6">
            This is a small starter list of real approved apps, not the complete official directory (62+ apps as of 2026).
          </p>
        )}

      </div>
    </main>
  );
}