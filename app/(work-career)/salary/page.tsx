"use client";

import { useState } from "react";
import PageShell from "../../components/PageShell";
import { inputClass } from "../../lib/styles";

// 2026 figures
const RV_RATE_EMPLOYEE = 0.093; // Rentenversicherung (pension)
const AV_RATE_EMPLOYEE = 0.013; // Arbeitslosenversicherung (unemployment)
const KV_BASE_RATE_EMPLOYEE = 0.073; // Krankenversicherung base
const KV_ZUSATZ_AVG = 0.029; // average Zusatzbeitrag, split half/half
const PV_RATE_EMPLOYEE = 0.018; // Pflegeversicherung (care)
const PV_CHILDLESS_SURCHARGE = 0.006;

const RV_AV_CEILING_MONTHLY = 8450;
const KV_PV_CEILING_MONTHLY = 5812.5;

const WERBUNGSKOSTENPAUSCHALE = 1230;
const SONDERAUSGABENPAUSCHALE = 36;
const ENTLASTUNGSBETRAG_ALLEINERZIEHEND = 4260;
const ENTLASTUNGSBETRAG_PRO_KIND = 240;

function estimateIncomeTax(zve) {
  if (zve <= 12348) return 0;
  const taxZone2 = (zve) => {
    const rate = 0.14 + ((0.2397 - 0.14) * (zve - 12348)) / (17799 - 12348);
    return ((0.14 + rate) / 2) * (zve - 12348);
  };
  if (zve <= 17799) return taxZone2(zve);
  const taxAt17799 = taxZone2(17799);
  if (zve <= 69878) {
    const rate = 0.2397 + ((0.42 - 0.2397) * (zve - 17799)) / (69878 - 17799);
    return taxAt17799 + ((0.2397 + rate) / 2) * (zve - 17799);
  }
  const taxAt69878 = taxAt17799 + ((0.2397 + 0.42) / 2) * (69878 - 17799);
  if (zve <= 277825) return taxAt69878 + 0.42 * (zve - 69878);
  const taxAt277825 = taxAt69878 + 0.42 * (277825 - 69878);
  return taxAt277825 + 0.45 * (zve - 277825);
}

// Approximates Steuerklasse V/VI: no tax-free allowance, tax starts from the first euro
function estimateIncomeTaxNoAllowance(zve) {
  if (zve <= 0) return 0;
  const z2w = 17799 - 12348;
  const z3w = 69878 - 17799;
  if (zve <= z2w) {
    const rate = 0.14 + ((0.2397 - 0.14) * zve) / z2w;
    return ((0.14 + rate) / 2) * zve;
  }
  const taxAtZ2 = ((0.14 + 0.2397) / 2) * z2w;
  if (zve <= z2w + z3w) {
    const rate = 0.2397 + ((0.42 - 0.2397) * (zve - z2w)) / z3w;
    return taxAtZ2 + ((0.2397 + rate) / 2) * (zve - z2w);
  }
  const taxAtZ4start = taxAtZ2 + ((0.2397 + 0.42) / 2) * z3w;
  const z4w = 277825 - 69878;
  if (zve <= z2w + z3w + z4w) return taxAtZ4start + 0.42 * (zve - z2w - z3w);
  const taxAtZ5start = taxAtZ4start + 0.42 * z4w;
  return taxAtZ5start + 0.45 * (zve - z2w - z3w - z4w);
}

export default function SalaryPage() {
  const [grossInput, setGrossInput] = useState("3500");
  const [period, setPeriod] = useState("monthly");
  const [steuerklasse, setSteuerklasse] = useState("I");
  const [additionalChildren, setAdditionalChildren] = useState(0);
  const [noChildren, setNoChildren] = useState(false);
  const [churchTax, setChurchTax] = useState(false);
  const [churchTaxRate, setChurchTaxRate] = useState(0.09);
  const [insuranceType, setInsuranceType] = useState("public");
  const [privatePremium, setPrivatePremium] = useState("300");

  const gross = parseFloat(grossInput) || 0;
  const grossAnnual = period === "monthly" ? gross * 12 : gross;
  const grossMonthly = grossAnnual / 12;

  const rvBase = Math.min(grossMonthly, RV_AV_CEILING_MONTHLY);
  const kvBase = Math.min(grossMonthly, KV_PV_CEILING_MONTHLY);

  const rvMonthly = rvBase * RV_RATE_EMPLOYEE;
  const avMonthly = rvBase * AV_RATE_EMPLOYEE;

  let kvMonthly = 0;
  let pvMonthly = 0;
  if (insuranceType === "public") {
    kvMonthly = kvBase * (KV_BASE_RATE_EMPLOYEE + KV_ZUSATZ_AVG / 2);
    const pvRate = PV_RATE_EMPLOYEE + (noChildren ? PV_CHILDLESS_SURCHARGE : 0);
    pvMonthly = kvBase * pvRate;
  } else {
    kvMonthly = parseFloat(privatePremium) || 0;
    pvMonthly = 0;
  }

  const socialAnnual = (rvMonthly + avMonthly + kvMonthly + pvMonthly) * 12;

  let taxableIncome =
    grossAnnual -
    WERBUNGSKOSTENPAUSCHALE -
    SONDERAUSGABENPAUSCHALE -
    socialAnnual;
  if (steuerklasse === "II") {
    taxableIncome -=
      ENTLASTUNGSBETRAG_ALLEINERZIEHEND +
      additionalChildren * ENTLASTUNGSBETRAG_PRO_KIND;
  }
  taxableIncome = Math.max(0, taxableIncome);

  let incomeTax = 0;
  if (steuerklasse === "III") {
    incomeTax = 2 * estimateIncomeTax(taxableIncome / 2);
  } else if (steuerklasse === "V" || steuerklasse === "VI") {
    incomeTax = estimateIncomeTaxNoAllowance(taxableIncome);
  } else {
    incomeTax = estimateIncomeTax(taxableIncome);
  }

  const churchTaxAmount = churchTax ? incomeTax * churchTaxRate : 0;

  const netAnnual = grossAnnual - socialAnnual - incomeTax - churchTaxAmount;
  const netMonthly = netAnnual / 12;

  const fmt = (n) =>
    n.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €";

  return (
    <PageShell
      title="Brutto-Netto Calculator"
      description="Estimate your take-home pay from a gross salary."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Gross salary
            </label>
            <input
              type="number"
              value={grossInput}
              onChange={(e) => setGrossInput(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className={inputClass}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Steuerklasse
          </label>
          <select
            value={steuerklasse}
            onChange={(e) => setSteuerklasse(e.target.value)}
            className={inputClass}
          >
            <option value="I">I — Single</option>
            <option value="II">II — Single parent</option>
            <option value="III">III — Married, higher earner</option>
            <option value="IV">IV — Married, similar earners</option>
            <option value="V">V — Married, lower earner</option>
            <option value="VI">VI — Second job</option>
          </select>
        </div>

        {steuerklasse === "II" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Additional children (beyond the first)
            </label>
            <input
              type="number"
              min="0"
              value={additionalChildren}
              onChange={(e) =>
                setAdditionalChildren(parseInt(e.target.value) || 0)
              }
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Health insurance
          </label>
          <select
            value={insuranceType}
            onChange={(e) => setInsuranceType(e.target.value)}
            className={inputClass}
          >
            <option value="public">Public (GKV)</option>
            <option value="private">Private (PKV)</option>
          </select>
        </div>

        {insuranceType === "private" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Your monthly private premium (€)
            </label>
            <input
              type="number"
              value={privatePremium}
              onChange={(e) => setPrivatePremium(e.target.value)}
              className={inputClass}
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="noChildren"
            checked={noChildren}
            onChange={(e) => setNoChildren(e.target.checked)}
            disabled={insuranceType === "private"}
          />
          <label htmlFor="noChildren" className="text-sm text-slate-700">
            I have no children (childless care-insurance surcharge applies)
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="churchTax"
            checked={churchTax}
            onChange={(e) => setChurchTax(e.target.checked)}
          />
          <label htmlFor="churchTax" className="text-sm text-slate-700">
            I pay church tax
          </label>
        </div>

        {churchTax && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Church tax rate
            </label>
            <select
              value={churchTaxRate}
              onChange={(e) => setChurchTaxRate(parseFloat(e.target.value))}
              className={inputClass}
            >
              <option value="0.08">8% (Bavaria, Baden-Württemberg)</option>
              <option value="0.09">9% (all other states)</option>
            </select>
          </div>
        )}
      </div>

      <div className="mt-6 bg-teal-600 text-white rounded-2xl p-6 text-center">
        <p className="text-sm text-teal-100">Estimated net pay</p>
        <p className="text-3xl font-semibold mt-1">
          {fmt(netMonthly)}{" "}
          <span className="text-lg font-normal text-teal-100">/ month</span>
        </p>
        <p className="text-sm text-teal-100 mt-1">{fmt(netAnnual)} / year</p>
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Monthly breakdown
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Gross</span>
            <span className="text-slate-800 font-medium">
              {fmt(grossMonthly)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Pension insurance (RV)</span>
            <span className="text-slate-600">− {fmt(rvMonthly)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Unemployment insurance (AV)</span>
            <span className="text-slate-600">− {fmt(avMonthly)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Health insurance (KV)</span>
            <span className="text-slate-600">− {fmt(kvMonthly)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Care insurance (PV)</span>
            <span className="text-slate-600">− {fmt(pvMonthly)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Income tax (est.)</span>
            <span className="text-slate-600">− {fmt(incomeTax / 12)}</span>
          </div>
          {churchTax && (
            <div className="flex justify-between">
              <span className="text-slate-500">Church tax</span>
              <span className="text-slate-600">
                − {fmt(churchTaxAmount / 12)}
              </span>
            </div>
          )}
          <div className="border-t border-slate-200 pt-2 flex justify-between font-semibold">
            <span className="text-slate-800">Net</span>
            <span className="text-teal-700">{fmt(netMonthly)}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        This is a rough estimate using 2026 contribution rates and income tax
        brackets, not an exact payroll calculation. It doesn't account for the
        solidarity surcharge (only applies to very high incomes now),
        employer-specific benefits, or the precise official Lohnsteuer tables —
        especially for Steuerklasse V/VI, which are approximated. Use it to get
        a ballpark figure, not a final number.
      </p>
    </PageShell>
  );
}
