"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PageShell from "@/components/PageShell";
import { inputClass, buttonClass } from "@/lib/styles";

export default function AccountView({ user }) {
  const router = useRouter();
  const supabase = createClient();

  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);

  const memberSince = new Date(user.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleLogout() {
    setLogoutLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwError("");
    setPwMessage("");
    if (newPassword.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwError(error.message);
    } else {
      setPwMessage("Password updated.");
      setNewPassword("");
    }
    setPwLoading(false);
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
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      }
      title="Your Account"
      description="View your account details, change your password, and log out."
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 text-2xl font-bold flex items-center justify-center flex-shrink-0">
          {user.email?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-slate-800 truncate">
            {user.email}
          </p>
          <p className="text-sm text-slate-500">Member since {memberSince}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Account details
        </h2>
        <dl className="text-sm text-slate-600 space-y-2">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400 flex-shrink-0">Email</dt>
            <dd className="truncate">{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400 flex-shrink-0">Email verified</dt>
            <dd>{user.email_confirmed_at ? "Yes" : "No"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400 flex-shrink-0">Account ID</dt>
            <dd className="font-mono text-xs text-slate-500 truncate">
              {user.id}
            </dd>
          </div>
        </dl>
      </div>

      <form
        onSubmit={handlePasswordChange}
        className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 space-y-3"
      >
        <h2 className="text-sm font-semibold text-slate-700">
          Change password
        </h2>
        <input
          type="password"
          className={inputClass}
          placeholder="New password"
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {pwError && <p className="text-xs text-red-600">{pwError}</p>}
        {pwMessage && <p className="text-xs text-emerald-600">{pwMessage}</p>}
        <button type="submit" className={buttonClass} disabled={pwLoading}>
          {pwLoading ? "Updating..." : "Update password"}
        </button>
      </form>

      <button
        onClick={handleLogout}
        disabled={logoutLoading}
        className="w-full sm:w-auto bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-100 disabled:opacity-50"
      >
        {logoutLoading ? "Logging out..." : "Log out"}
      </button>
    </PageShell>
  );
}
