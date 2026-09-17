"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, FEATURES } from "../lib/features";

export default function Navbar({ user }) {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const feature = FEATURES.find((f) => f.href === pathname);
  const category = feature
    ? CATEGORIES.find((c) => c.slug === feature.category)
    : null;

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Account";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-slate-100 text-slate-600 flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          </svg>
        </button>

        <div className="text-sm text-slate-700 truncate">
          <Link href="/" className="text-slate-400 hover:text-slate-600">
            Klar
          </Link>
          {category && (
            <>
              <span className="text-slate-300 mx-1.5">/</span>
              <Link
                href={`/category/${category.slug}`}
                className="text-slate-400 hover:text-slate-600"
              >
                {category.title}
              </Link>
            </>
          )}
          {feature && (
            <>
              <span className="text-slate-300 mx-1.5">/</span>
              <span className="font-medium text-slate-800">
                {feature.title}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/"
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
          aria-label="Search"
        >
          <svg
            className="w-4.5 h-4.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.7}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </Link>

        {user ? (
          <div className="flex items-center gap-1.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100"
            >
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold flex items-center justify-center">
                {displayName?.[0]?.toUpperCase() ?? "U"}
              </span>
              <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                {displayName}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-red-500 px-2 py-1"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100"
          >
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">
              G
            </span>
            <span className="text-sm font-medium text-slate-700">Log in</span>
          </Link>
        )}
      </div>
    </header>
  );
}
