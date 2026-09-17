"use client";

import { useState } from "react";
import { Repeat, Trash2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import { inputClass, selectClass, buttonClass } from "@/lib/styles";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["Streaming", "Software", "Fitness", "Music", "Other"];
const CYCLES = ["monthly", "yearly", "weekly"];

const QUICK_ADD = [
  { name: "Netflix", category: "Streaming" },
  { name: "Spotify", category: "Music" },
  { name: "Amazon Prime", category: "Streaming" },
  { name: "Disney+", category: "Streaming" },
  { name: "YouTube Premium", category: "Streaming" },
  { name: "iCloud+", category: "Software" },
  { name: "Google One", category: "Software" },
  { name: "Gym Membership", category: "Fitness" },
  { name: "Adobe Creative Cloud", category: "Software" },
  { name: "ChatGPT Plus", category: "Software" },
];

function monthlyEquivalent(sub) {
  const amount = parseFloat(sub.amount) || 0;
  if (sub.billing_cycle === "yearly") return amount / 12;
  if (sub.billing_cycle === "weekly") return amount * 4.33;
  return amount;
}

export default function SubscriptionTrackerView({
  initialSubscriptions,
  userId,
}) {
  const supabase = createClient();

  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCycle, setNewCycle] = useState("monthly");
  const [newCategory, setNewCategory] = useState("Other");

  const totalMonthly = subscriptions.reduce(
    (sum, s) => sum + monthlyEquivalent(s),
    0,
  );
  const totalYearly = totalMonthly * 12;

  const byCategory = CATEGORIES.map((cat) => ({
    category: cat,
    total: subscriptions
      .filter((s) => s.category === cat)
      .reduce((sum, s) => sum + monthlyEquivalent(s), 0),
  })).filter((c) => c.total > 0);

  async function addSubscription(name, amount, cycle, category) {
    if (!name) return;
    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        name,
        amount: parseFloat(amount) || 0,
        billing_cycle: cycle,
        category,
      })
      .select()
      .single();

    if (!error && data) {
      setSubscriptions((prev) => [...prev, data]);
    }
  }

  function handleAddCustom(e) {
    e.preventDefault();
    addSubscription(newName.trim(), newAmount, newCycle, newCategory);
    setNewName("");
    setNewAmount("");
    setNewCycle("monthly");
    setNewCategory("Other");
  }

  function handleQuickAdd(item) {
    addSubscription(item.name, "", "monthly", item.category);
  }

  async function updateAmount(id, amount) {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, amount } : s)),
    );
    await supabase
      .from("subscriptions")
      .update({ amount: parseFloat(amount) || 0 })
      .eq("id", id);
  }

  async function deleteSubscription(id) {
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", id);
    if (!error) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <PageShell
      icon={<Repeat className="h-6 w-6" />}
      title="Subscription Tracker"
      description="See every subscription and recurring payment in one place, with monthly and yearly totals."
      wide
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 mb-1">
            Total per month
          </p>
          <p className="text-2xl font-bold text-violet-600">
            €{totalMonthly.toFixed(2)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 mb-1">
            Total per year
          </p>
          <p className="text-2xl font-bold text-gray-900">
            €{totalYearly.toFixed(2)}
          </p>
        </div>
      </div>

      {byCategory.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            By category (monthly)
          </h2>
          <div className="space-y-2">
            {byCategory.map((c) => (
              <div
                key={c.category}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{c.category}</span>
                <span className="font-medium text-gray-900">
                  €{c.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2">Quick add</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_ADD.filter(
            (q) => !subscriptions.some((s) => s.name === q.name),
          ).map((q) => (
            <button
              key={q.name}
              type="button"
              onClick={() => handleQuickAdd(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
            >
              + {q.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Your subscriptions
        </h2>

        {subscriptions.length === 0 ? (
          <p className="text-sm text-gray-500 mb-4">
            Nothing tracked yet — use a quick add button above or add one below.
          </p>
        ) : (
          <div className="space-y-2 mb-4">
            {subscriptions
              .slice()
              .sort((a, b) => monthlyEquivalent(b) - monthlyEquivalent(a))
              .map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 border border-gray-100 rounded-lg p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {s.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {s.category} · billed {s.billing_cycle} · €
                      {monthlyEquivalent(s).toFixed(2)}/mo
                    </p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    className={`${inputClass} w-24`}
                    value={s.amount}
                    onChange={(e) => updateAmount(s.id, e.target.value)}
                    placeholder="€"
                  />
                  <button
                    type="button"
                    onClick={() => deleteSubscription(s.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
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
              Name
            </label>
            <input
              type="text"
              className={inputClass}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Gym"
            />
          </div>
          <div className="w-24">
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
          <div className="w-32">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Billing cycle
            </label>
            <select
              className={selectClass}
              value={newCycle}
              onChange={(e) => setNewCycle(e.target.value)}
            >
              {CYCLES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Category
            </label>
            <select
              className={selectClass}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={buttonClass}>
            Add
          </button>
        </form>
      </div>
    </PageShell>
  );
}
