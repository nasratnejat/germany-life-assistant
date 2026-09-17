"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { inputClass } from "@/lib/styles";
// §622 BGB statutory notice periods (employer terminating, post-probation), in months, "to the end of a calendar month"
const EMPLOYER_TIERS = [
  { afterYears: 20, months: 7 },
  { afterYears: 15, months: 6 },
  { afterYears: 12, months: 5 },
  { afterYears: 10, months: 4 },
  { afterYears: 8, months: 3 },
  { afterYears: 5, months: 2 },
  { afterYears: 2, months: 1 },
];

function tenureYears(start, from) {
  const ms = from - start;
  return ms / (1000 * 60 * 60 * 24 * 365.25);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function fifteenthOrEndOfMonth(date) {
  return date.getDate() <= 15
    ? new Date(date.getFullYear(), date.getMonth(), 15)
    : endOfMonth(date);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function fmtDate(date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NoticePeriodPage() {
  const [startDate, setStartDate] = useState("2023-01-01");
  const [noticeDate, setNoticeDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [inProbation, setInProbation] = useState(false);
  const [whoIsTerminating, setWhoIsTerminating] = useState("employer");

  const start = new Date(startDate);
  const notice = new Date(noticeDate);
  const years = tenureYears(start, notice);

  let periodLabel = "";
  let effectiveDate = null;

  if (inProbation) {
    periodLabel = "2 weeks, effective any calendar day (not tied to month-end)";
    effectiveDate = addDays(notice, 14);
  } else if (whoIsTerminating === "employee") {
    periodLabel = "4 weeks, to the 15th or the end of a calendar month";
    effectiveDate = fifteenthOrEndOfMonth(addDays(notice, 28));
  } else {
    const tier = EMPLOYER_TIERS.find((t) => years >= t.afterYears);
    if (tier) {
      periodLabel = `${tier.months} month${tier.months > 1 ? "s" : ""}, to the end of a calendar month`;
      effectiveDate = endOfMonth(addMonths(notice, tier.months));
    } else {
      periodLabel = "4 weeks, to the 15th or the end of a calendar month";
      effectiveDate = fifteenthOrEndOfMonth(addDays(notice, 28));
    }
  }

  return (
    <PageShell
      title="Notice Period Calculator"
      description="Work out your statutory Kündigungsfrist under §622 BGB."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Employment start date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date notice is given
            </label>
            <input
              type="date"
              value={noticeDate}
              onChange={(e) => setNoticeDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="probation"
            checked={inProbation}
            onChange={(e) => setInProbation(e.target.checked)}
          />
          <label htmlFor="probation" className="text-sm text-slate-700">
            Still within the probation period (Probezeit, first 6 months)
          </label>
        </div>

        {!inProbation && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Who is giving notice?
            </label>
            <select
              value={whoIsTerminating}
              onChange={(e) => setWhoIsTerminating(e.target.value)}
              className={inputClass}
            >
              <option value="employer">Employer terminating me</option>
              <option value="employee">I'm resigning</option>
            </select>
          </div>
        )}
      </div>

      <div className="mt-4 bg-teal-600 text-white rounded-2xl p-6 text-center">
        <p className="text-sm text-teal-100">Statutory notice period</p>
        <p className="text-xl font-semibold mt-1">{periodLabel}</p>
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-sm text-slate-500">
          Earliest possible last working day
        </p>
        <p className="text-2xl font-semibold text-slate-800 mt-1">
          {fmtDate(effectiveDate)}
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Based on {years.toFixed(1)} years of employment as of the notice date.
        </p>
      </div>

      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        These are the statutory minimums under §622 BGB — the extended periods
        (beyond the base 4 weeks) only apply automatically when the{" "}
        <strong>employer</strong> gives notice. If you're resigning, your
        contract may still specify a longer notice period than the statutory 4
        weeks (many German contracts mirror the employer's extended periods for
        both sides) — check your Arbeitsvertrag's Kündigungsfrist clause, or run
        it through the{" "}
        <a href="/contractcheck" className="text-teal-600 underline">
          Employment Contract Checker
        </a>{" "}
        to see what it actually says. A collective bargaining agreement
        (Tarifvertrag), if one applies to you, can also override these defaults.
      </p>
    </PageShell>
  );
}
