"use client";

import { useState } from "react";
import { Wallet, Check } from "lucide-react";
import PageShell from "@/components/PageShell";
import { inputClass, buttonClass } from "@/lib/styles";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
  amount: string | number;
  flexible: boolean;
}

interface BudgetPlan {
  mode?: string;
  income_a?: string | number;
  income_b?: string | number;
  categories?: Category[];
  updated_at?: string;
}

interface BudgetPlannerViewProps {
  initialPlan: BudgetPlan | null;
  userId: string;
}

const SUGGESTED_CATEGORIES = [
  { name: "Rent (Miete)", flexible: false },
  { name: "Utilities (Nebenkosten)", flexible: false },
  { name: "Groceries", flexible: true },
  { name: "Transport", flexible: false },
  { name: "Insurance", flexible: false },
  { name: "Phone & Internet", flexible: false },
  { name: "Subscriptions", flexible: false },
  { name: "Savings", flexible: false },
  { name: "Fun / Discretionary", flexible: true },
];

function getDaysRemainingInMonth() {
  const now = new Date();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const remaining = daysInMonth - now.getDate() + 1;
  return { daysInMonth, remaining };
}

function withIds(categories: Category[] | undefined): Category[] {
  return (categories || []).map((c) => ({
    ...c,
    id: c.id || crypto.randomUUID(),
  }));
}

export default function BudgetPlannerView({
  initialPlan,
  userId,
}: BudgetPlannerViewProps) {
  const supabase = createClient();

  const [mode, setMode] = useState(initialPlan?.mode || "personal");
  const [incomeA, setIncomeA] = useState(initialPlan?.income_a ?? "");
  const [incomeB, setIncomeB] = useState(initialPlan?.income_b ?? "");
  const [categories, setCategories] = useState<Category[]>(
    withIds(initialPlan?.categories),
  );
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newFlexible, setNewFlexible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(
    initialPlan?.updated_at ? new Date(initialPlan.updated_at) : null,
  );

  const { remaining } = getDaysRemainingInMonth();

  const totalIncome =
    (parseFloat(String(incomeA)) || 0) +
    (mode === "shared" ? parseFloat(String(incomeB)) || 0 : 0);
  const totalAllocated = categories.reduce(
    (sum, c) => sum + (parseFloat(String(c.amount)) || 0),
    0,
  );
  const unallocated = totalIncome - totalAllocated;
  const flexibleTotal = categories
    .filter((c) => c.flexible)
    .reduce((sum, c) => sum + (parseFloat(String(c.amount)) || 0), 0);
  const dailyLimit = remaining > 0 ? flexibleTotal / remaining : 0;

  function addCategory(
    name: string,
    amount: string | number,
    flexible: boolean = false,
  ) {
    if (!name) return;
    setCategories((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, amount, flexible },
    ]);
  }

  function handleAddCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    addCategory(newName.trim(), newAmount, newFlexible);
    setNewName("");
    setNewAmount("");
    setNewFlexible(false);
  }

  function removeCategory(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function updateAmount(id: string, amount: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, amount } : c)),
    );
  }

  function toggleFlexible(id: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flexible: !c.flexible } : c)),
    );
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from("budget_plans").upsert(
      {
        user_id: userId,
        mode,
        income_a: parseFloat(String(incomeA)) || 0,
        income_b: parseFloat(String(incomeB)) || 0,
        categories: categories.map(({ id, name, amount, flexible }) => ({
          id,
          name,
          amount,
          flexible,
        })),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    setSaving(false);
    if (!error) setLastSaved(new Date());
  }

  return (
    <PageShell
      icon={<Wallet className="h-6 w-6" />}
      title="Budget Planner"
      description="Plan your monthly budget by category and see how much you can spend per day — solo or shared with a partner."
      wide
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("personal")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
              mode === "personal"
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            Personal
          </button>
          <button
            type="button"
            onClick={() => setMode("shared")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
              mode === "shared"
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            Shared / Couple
          </button>
        </div>

        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={buttonClass}
          >
            {saving ? "Saving..." : "Save budget"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Monthly income
        </h2>
        <div
          className={`grid gap-4 ${mode === "shared" ? "sm:grid-cols-2" : ""}`}
        >
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {mode === "shared"
                ? "Partner A income (€)"
                : "Monthly income (€)"}
            </label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={incomeA}
              onChange={(e) => setIncomeA(e.target.value)}
              placeholder="e.g. 2400"
            />
          </div>
          {mode === "shared" && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Partner B income (€)
              </label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={incomeB}
                onChange={(e) => setIncomeB(e.target.value)}
                placeholder="e.g. 2100"
              />
            </div>
          )}
        </div>
        {mode === "shared" && (
          <p className="text-sm text-gray-500 mt-3">
            Household income:{" "}
            <span className="font-semibold text-gray-900">
              €{totalIncome.toFixed(2)}
            </span>
          </p>
        )}
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2">Quick add</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_CATEGORIES.filter(
            (s) => !categories.some((c) => c.name === s.name),
          ).map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => addCategory(s.name, "", s.flexible)}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
            >
              + {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Budget categories
        </h2>

        {categories.length === 0 ? (
          <p className="text-sm text-gray-500 mb-4">
            No categories yet — add one below or use a quick add button above.
          </p>
        ) : (
          <div className="space-y-2 mb-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 border border-gray-100 rounded-lg p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <input
                      type="checkbox"
                      checked={c.flexible}
                      onChange={() => toggleFlexible(c.id)}
                    />
                    Flexible (counts toward daily spending limit)
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  className={`${inputClass} w-28`}
                  value={c.amount}
                  onChange={(e) => updateAmount(c.id, e.target.value)}
                  placeholder="€"
                />
                <button
                  type="button"
                  onClick={() => removeCategory(c.id)}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={handleAddCustom}
          className="flex flex-wrap gap-2 items-end pt-4 border-t border-gray-100"
        >
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Custom category
            </label>
            <input
              type="text"
              className={inputClass}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Gym"
            />
          </div>
          <div className="w-28">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Amount (€)
            </label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-1.5 text-xs text-gray-500 pb-2.5">
            <input
              type="checkbox"
              checked={newFlexible}
              onChange={(e) => setNewFlexible(e.target.checked)}
            />
            Flexible
          </label>
          <button type="submit" className={buttonClass}>
            Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Total income"
          value={`€${totalIncome.toFixed(2)}`}
        />
        <SummaryCard
          label="Total allocated"
          value={`€${totalAllocated.toFixed(2)}`}
        />
        <SummaryCard
          label="Unallocated"
          value={`€${unallocated.toFixed(2)}`}
          tone={unallocated < 0 ? "red" : "green"}
        />
        <SummaryCard
          label={`Daily spending limit (${remaining} days left)`}
          value={`€${dailyLimit.toFixed(2)}`}
          tone="violet"
        />
      </div>

      {unallocated < 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">
            You&apos;ve allocated €{Math.abs(unallocated).toFixed(2)} more than
            your income. Adjust a category or increase income.
          </p>
        </div>
      )}
    </PageShell>
  );
}

function SummaryCard({
  label,
  value,
  tone = "gray",
}: {
  label: string;
  value: string;
  tone?: "gray" | "green" | "red" | "violet";
}) {
  const toneClasses = {
    gray: "text-gray-900",
    green: "text-emerald-600",
    red: "text-red-600",
    violet: "text-violet-600",
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-bold ${toneClasses[tone] || toneClasses.gray}`}
      >
        {value}
      </p>
    </div>
  );
}
