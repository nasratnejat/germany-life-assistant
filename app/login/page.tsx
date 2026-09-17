"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { inputClass, buttonClass } from "@/lib/styles";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email to confirm your account, then log in.");
      }
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white text-sm font-bold flex items-center justify-center">
            K
          </div>
          <span className="font-semibold text-slate-800">Klar</span>
        </div>

        <h1 className="text-lg font-semibold text-slate-800 mb-1">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-slate-500 mb-5">
          {mode === "login"
            ? "Log in to sync your saved data."
            : "Sign up to save your data across devices."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Email
            </label>
            <input
              type="email"
              required
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
          {message && <p className="text-xs text-emerald-600">{message}</p>}

          <button type="submit" className={buttonClass} disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Log in"
                : "Sign up"}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-4 text-center">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-teal-600 font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-teal-600 font-medium"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
