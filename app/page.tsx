"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, FEATURES, getCategoryFeatures } from "../lib/features";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AiBadge from "@/components/AiBadge";

const DOCUMENT_HREFS = ["/documents", "/document-vault"];

export default function Home() {
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? FEATURES.filter(
        (f) =>
          f.title.toLowerCase().includes(query.toLowerCase()) ||
          f.description.toLowerCase().includes(query.toLowerCase()) ||
          f.keywords.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const documentFeatures = FEATURES.filter((f) =>
    DOCUMENT_HREFS.includes(f.href),
  );

  return (
    <main className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">
          Welcome back 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          What do you need help with today?
        </p>
      </div>

      <Card className="mb-10 rounded-2xl border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a tool — e.g. 'rent', 'cv', 'tax'..."
              className="pl-9"
            />
          </div>

          {query.trim() && (
            <div className="mt-4 space-y-2">
              {results.length > 0 ? (
                results.map((f) => (
                  <Link key={f.href} href={f.href} className="block">
                    <div className="bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl p-4 transition-colors">
                      <p className="text-sm font-semibold text-teal-800 flex items-center gap-1.5">
                        {f.title} →{f.ai && <AiBadge />}
                      </p>
                      <p className="text-xs text-teal-700 mt-0.5">
                        {f.description}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No matches — try a different word, or browse using the
                  sidebar.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
        Your Documents
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
        {documentFeatures.map((f) => (
          <Link key={f.href} href={f.href}>
            <Card className="h-full rounded-2xl border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 [&_svg]:w-5 [&_svg]:h-5">
                    {f.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-slate-800">
                        {f.title}
                      </h3>
                      {f.ai && <AiBadge />}
                    </div>
                    <p className="text-sm text-slate-500 mt-1 leading-snug">
                      {f.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
        Browse by category
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {CATEGORIES.map((cat) => {
          const count = getCategoryFeatures(cat.slug).length;
          return (
            <Link key={cat.slug} href={`/category/${cat.slug}`}>
              <Card className="h-full rounded-2xl border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 [&_svg]:w-5 [&_svg]:h-5">
                      {cat.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-slate-800">
                          {cat.title}
                        </h3>
                        <Badge variant="secondary" className="text-[10px]">
                          {count} tools
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-1 leading-snug">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
