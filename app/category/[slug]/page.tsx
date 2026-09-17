import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryFeatures } from "../../../lib/features";
import AiBadge from "@/components/AiBadge";

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const items = getCategoryFeatures(slug);

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-teal-600 inline-flex items-center gap-1 mb-6"
        >
          ← Back to Klar
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            {category.icon}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              {category.title}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {category.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {items.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-slate-800 text-sm">
                  {feature.title}
                </h3>
                {feature.ai && <AiBadge />}
              </div>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed flex-1">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
