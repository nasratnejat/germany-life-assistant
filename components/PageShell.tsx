"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FEATURES, CATEGORIES } from "@/lib/features";

interface PageShellProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}

export default function PageShell({
  title,
  description,
  icon,
  wide = false,
  children,
}: PageShellProps) {
  const pathname = usePathname();
  const feature = FEATURES.find((f) => f.href === pathname);
  const category = feature
    ? CATEGORIES.find((c) => c.slug === feature.category)
    : null;

  const backHref = category ? `/category/${category.slug}` : "/";
  const backLabel = category ? `Back to ${category.title}` : "Back to Klar";

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className={`w-full ${wide ? "max-w-3xl" : "max-w-2xl"} mx-auto`}>
        <Link
          href={backHref}
          className="text-sm text-slate-500 hover:text-teal-600 inline-flex items-center gap-1 mb-6"
        >
          ← {backLabel}
        </Link>

        <div className="mb-8 flex items-start gap-4">
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
            {description && (
              <p className="text-slate-500 text-sm mt-1">{description}</p>
            )}
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}
