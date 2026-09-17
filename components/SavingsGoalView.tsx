"use client";

import { useState } from "react";
import { PiggyBank, Plus, Trash2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import { inputClass, buttonClass } from "@/lib/styles";
import { createClient } from "@/lib/supabase/client";

interface Goal {
  id: string;
  name: string;
  target_amount: number | string;
  current_amount: number | string;
  monthly_contribution: number | string;
}

interface SavingsGoalViewProps {
  initialGoals: Goal[];
  userId: string;
}

export default function SavingsGoalView({
  initialGoals,
  userId,
}: SavingsGoalViewProps) {
  const supabase = createClient();

  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newContribution, setNewContribution] = useState("");
  const [contributionInputs, setContributionInputs] = useState<
    Record<string, string>
  >({});

  const [efExpenses, setEfExpenses] = useState("");
  const [efMonths, setEfMonths] = useState(3);
  const efTarget = (parseFloat(efExpenses) || 0) * efMonths;

  async function addGoal(
    name: string,
    target: string | number,
    monthlyContribution: string | number = 0,
  ) {
    if (!name || !target) return;
    const { data, error } = await supabase
      .from("savings_goals")
      .insert({
        user_id: userId,
        name,
        target_amount: parseFloat(String(target)) || 0,
        current_amount: 0,
        monthly_contribution: parseFloat(String(monthlyContribution)) || 0,
      })
      .select()
      .single();

    if (!error && data) {
      setGoals((prev) => [...prev, data]);
    }
  }

  function handleAddCustom(e: React.FormEvent) {
    e.preventDefault();
    addGoal(newName.trim(), newTarget, newContribution);
    setNewName("");
    setNewTarget("");
    setNewContribution("");
  }

  async function handleAddEmergencyFund() {
    if (!efTarget) return;
    await addGoal("Emergency Fund", efTarget, 0);
    setEfExpenses("");
  }

  async function addContribution(goalId: string) {
    const amount = parseFloat(contributionInputs[goalId]) || 0;
    if (!amount) return;
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const newAmount = (parseFloat(String(goal.current_amount)) || 0) + amount;

    const { error } = await supabase
      .from("savings_goals")
      .update({
        current_amount: newAmount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", goalId);

    if (!error) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goalId ? { ...g, current_amount: newAmount } : g,
        ),
      );
      setContributionInputs((prev) => ({ ...prev, [goalId]: "" }));
    }
  }

  async function deleteGoal(goalId: string) {
    const { error } = await supabase
      .from("savings_goals")
      .delete()
      .eq("id", goalId);
    if (!error) {
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    }
  }

  return (
    <PageShell
      icon={<PiggyBank className="h-6 w-6" />}
      title="Savings Goal Tracker"
      description="Set savings targets and log your progress toward them — including a ready-made Emergency Fund calculator."
      wide
    >
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">
          Quick start: Emergency Fund
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          A common rule of thumb is to keep 3–6 months of essential expenses
          saved.
        </p>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Monthly essential expenses (€)
            </label>
            <input
              type="number"
              min="0"
              className={`${inputClass} w-40`}
              value={efExpenses}
              onChange={(e) => setEfExpenses(e.target.value)}
              placeholder="e.g. 1500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Buffer
            </label>
            <select
              className={inputClass}
              value={efMonths}
              onChange={(e) => setEfMonths(parseInt(e.target.value, 10))}
            >
              <option value={3}>3 months</option>
              <option value={4}>4 months</option>
              <option value={5}>5 months</option>
              <option value={6}>6 months</option>
            </select>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Suggested target</p>
            <p className="text-lg font-bold text-violet-700">
              €{efTarget.toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddEmergencyFund}
            disabled={!efTarget}
            className={buttonClass}
          >
            Create goal
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {goals.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500">
              No savings goals yet — add one below.
            </p>
          </div>
        ) : (
          goals.map((goal) => {
            const target = parseFloat(String(goal.target_amount)) || 0;
            const current = parseFloat(String(goal.current_amount)) || 0;
            const contribution =
              parseFloat(String(goal.monthly_contribution)) || 0;
            const percent =
              target > 0 ? Math.min(100, (current / target) * 100) : 0;
            const monthsLeft =
              contribution > 0 && current < target
                ? Math.ceil((target - current) / contribution)
                : null;

            return (
              <div
                key={goal.id}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {goal.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      €{current.toFixed(2)} of €{target.toFixed(2)}
                      {monthsLeft !== null &&
                        ` · ~${monthsLeft} mo. left at current contribution`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteGoal(goal.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-violet-600 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    className={`${inputClass} w-32`}
                    placeholder="Add €"
                    value={contributionInputs[goal.id] || ""}
                    onChange={(e) =>
                      setContributionInputs((prev) => ({
                        ...prev,
                        [goal.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => addContribution(goal.id)}
                    className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700"
                  >
                    <Plus className="h-4 w-4" /> Add contribution
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          New savings goal
        </h2>
        <form
          onSubmit={handleAddCustom}
          className="flex flex-wrap gap-3 items-end"
        >
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Goal name
            </label>
            <input
              type="text"
              className={inputClass}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Vacation"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Target (€)
            </label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
            />
          </div>
          <div className="w-40">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Monthly contribution (€)
            </label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={newContribution}
              onChange={(e) => setNewContribution(e.target.value)}
              placeholder="optional"
            />
          </div>
          <button type="submit" className={buttonClass}>
            Add goal
          </button>
        </form>
      </div>
    </PageShell>
  );
}
