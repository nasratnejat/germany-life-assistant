"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PanelLeftClose } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, FEATURES } from "@/lib/features";

export default function Navbar({ user }) {
  const { open, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const feature = FEATURES.find((f) => f.href === pathname);
  const category = feature
    ? CATEGORIES.find((c) => c.slug === feature.category)
    : null;

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Account";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200/60 px-4 sm:px-5 py-3">
      {" "}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors flex-shrink-0"
        >
          <PanelLeftClose
            className={`w-4.5 h-4.5 transition-transform duration-300 ease-in-out ${
              open ? "" : "rotate-180"
            }`}
          />
        </button>

        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-slate-800 flex-shrink-0"
        >
          Klar
        </Link>

        <div className="text-sm text-slate-700 truncate hidden sm:block">
          {feature && (
            <>
              <span className="text-slate-300 mx-1.5">/</span>
              {category && (
                <>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {category.title}
                  </Link>
                  <span className="text-slate-300 mx-1.5">/</span>
                </>
              )}
              <span className="font-medium text-slate-800">
                {feature.title}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 text-sm font-bold flex items-center justify-center hover:ring-2 hover:ring-teal-200 transition-all"
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              {displayName?.[0]?.toUpperCase() ?? "U"}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center hover:bg-slate-300 transition-colors"
            aria-label="Log in"
          >
            G
          </Link>
        )}
      </div>
    </header>
  );
}
