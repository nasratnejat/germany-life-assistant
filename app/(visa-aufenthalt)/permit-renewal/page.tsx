"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { selectClass } from "@/lib/styles";

const PERMIT_CHECKLISTS = {
  "EU Blue Card": {
    description:
      "For highly qualified employment with a recognized university degree.",
    documents: [
      "Valid passport",
      "Biometric passport photo",
      "Current Blue Card / permit",
      "Proof of address (Meldebescheinigung)",
      "Employment contract or confirmation of continued employment",
      "Recent salary slips (last 3 months)",
      "Proof of health insurance",
      "University degree certificate (if not already on file)",
      "Completed application form (Antrag auf Aufenthaltstitel)",
    ],
  },
  "Employment Permit (§18)": {
    description:
      "For skilled employment under a standard work-based residence permit.",
    documents: [
      "Valid passport",
      "Biometric passport photo",
      "Current residence permit",
      "Proof of address (Meldebescheinigung)",
      "Employment contract or employer confirmation letter",
      "Recent salary slips",
      "Proof of health insurance",
      "Completed application form",
    ],
  },
  "Family Reunion (Familiennachzug)": {
    description:
      "For spouses, partners, or children joining a family member in Germany.",
    documents: [
      "Valid passport",
      "Biometric passport photo",
      "Current residence permit",
      "Proof of address (Meldebescheinigung)",
      "Marriage or birth certificate (translated/apostilled if needed)",
      "Proof of the sponsoring family member's income and housing",
      "Proof of health insurance",
      "Basic German language certificate (if required for your case)",
      "Completed application form",
    ],
  },
  "Student Residence Permit": {
    description:
      "For enrolled students at a German university or Studienkolleg.",
    documents: [
      "Valid passport",
      "Biometric passport photo",
      "Current residence permit",
      "Proof of address (Meldebescheinigung)",
      "Current enrollment certificate (Immatrikulationsbescheinigung)",
      "Proof of financial resources (blocked account, scholarship, or parental support letter)",
      "Proof of health insurance",
      "Completed application form",
    ],
  },
  "Job Seeker Visa": {
    description:
      "For graduates or qualified professionals searching for work after studies or training.",
    documents: [
      "Valid passport",
      "Biometric passport photo",
      "Current residence permit",
      "Proof of address (Meldebescheinigung)",
      "University degree or recognized qualification",
      "Proof of sufficient funds to support yourself",
      "Proof of health insurance",
      "Completed application form",
    ],
  },
  "Self-Employment Permit": {
    description: "For freelancers and self-employed founders.",
    documents: [
      "Valid passport",
      "Biometric passport photo",
      "Current residence permit",
      "Proof of address (Meldebescheinigung)",
      "Recent tax assessment (Steuerbescheid) or income statement",
      "Business registration (Gewerbeanmeldung) or freelance tax number",
      "Proof of ongoing client contracts or business activity",
      "Proof of health insurance",
      "Completed application form",
    ],
  },
};

const PERMIT_TYPES = Object.keys(PERMIT_CHECKLISTS);

export default function PermitRenewalChecklist() {
  const [selectedType, setSelectedType] = useState(PERMIT_TYPES[0]);
  const [checked, setChecked] = useState({});

  const permit = PERMIT_CHECKLISTS[selectedType];
  const checkedForType = checked[selectedType] || {};
  const completedCount = permit.documents.filter(
    (_, i) => checkedForType[i],
  ).length;

  function toggleItem(index) {
    setChecked((prev) => ({
      ...prev,
      [selectedType]: {
        ...(prev[selectedType] || {}),
        [index]: !(prev[selectedType] || {})[index],
      },
    }));
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
      title="Visa/Permit Renewal Checklist"
      description="Pick your permit type and see what documents you'll likely need for renewal."
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
        <label className="text-xs font-medium text-slate-600 mb-1 block">
          Permit type
        </label>
        <select
          className={selectClass}
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {PERMIT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <p className="text-sm text-slate-500 mt-3">{permit.description}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">
            Documents you'll likely need
          </h2>
          <span className="text-xs font-medium text-slate-500">
            {completedCount} / {permit.documents.length} ready
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-5">
          <div
            className="bg-teal-500 h-1.5 rounded-full transition-all"
            style={{
              width: `${(completedCount / permit.documents.length) * 100}%`,
            }}
          />
        </div>

        <ul className="space-y-2">
          {permit.documents.map((doc, i) => (
            <li key={i}>
              <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!checkedForType[i]}
                  onChange={() => toggleItem(i)}
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span
                  className={
                    checkedForType[i] ? "line-through text-slate-400" : ""
                  }
                >
                  {doc}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Good to know:</strong> exact requirements vary by city
          (Ausländerbehörde) and individual case. Use this as a starting
          checklist, but confirm the current requirements on your local
          Ausländerbehörde's website before your appointment.
        </p>
      </div>
    </PageShell>
  );
}
