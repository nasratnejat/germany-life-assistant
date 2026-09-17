"use client";

import { useState } from "react";
import Link from "next/link";

const BINS = {
  gelber: {
    label: "Gelber Sack / Gelbe Tonne",
    color: "bg-yellow-100 text-yellow-800",
  },
  blaue: { label: "Blaue Tonne (Paper)", color: "bg-blue-100 text-blue-800" },
  bio: { label: "Biotonne (Organic)", color: "bg-amber-100 text-amber-800" },
  rest: { label: "Restmüll", color: "bg-slate-200 text-slate-700" },
  glas: { label: "Glascontainer", color: "bg-emerald-100 text-emerald-800" },
  pfand: {
    label: "Return to store (Pfand)",
    color: "bg-teal-100 text-teal-800",
  },
  wertstoffhof: {
    label: "Wertstoffhof / take-back point",
    color: "bg-red-100 text-red-800",
  },
  sperrmuell: {
    label: "Sperrmüll / Altkleider collection",
    color: "bg-purple-100 text-purple-800",
  },
};

const ITEMS = [
  {
    name: "Pizza box (clean, no grease)",
    bin: "blaue",
    note: "Only if it's not soaked through with grease or cheese.",
  },
  {
    name: "Pizza box (greasy)",
    bin: "rest",
    note: "Grease-stained cardboard can't be recycled as paper.",
  },
  {
    name: "Yogurt cup",
    bin: "gelber",
    note: "Give it a quick rinse first — it doesn't need to be spotless.",
  },
  { name: "Tin can (empty)", bin: "gelber", note: "" },
  { name: "Aluminum foil", bin: "gelber", note: "" },
  { name: "Plastic bottle (no Pfand symbol)", bin: "gelber", note: "" },
  {
    name: "Plastic bottle (with Pfand symbol)",
    bin: "pfand",
    note: "Take it back to any supermarket with a Pfandautomat for your deposit.",
  },
  {
    name: "Beer bottle (Pfand)",
    bin: "pfand",
    note: "Return to the store — most beer bottles carry a deposit.",
  },
  {
    name: "Wine bottle (no Pfand)",
    bin: "glas",
    note: "Sort by color into the correct container: white, green, or brown glass.",
  },
  {
    name: "Jam jar (glass)",
    bin: "glas",
    note: "Rinse it out; the metal lid goes in the Gelber Sack separately.",
  },
  { name: "Newspaper", bin: "blaue", note: "" },
  { name: "Magazine", bin: "blaue", note: "" },
  {
    name: "Cardboard box",
    bin: "blaue",
    note: "Flatten it first to save space.",
  },
  { name: "Egg carton (cardboard)", bin: "blaue", note: "" },
  {
    name: "Wrapping paper",
    bin: "blaue",
    note: "Unless it's glittery, foil-coated, or plastic-laminated — then it's Restmüll.",
  },
  { name: "Banana peel / fruit scraps", bin: "bio", note: "" },
  { name: "Coffee grounds + paper filter", bin: "bio", note: "" },
  { name: "Tea bag", bin: "bio", note: "" },
  { name: "Eggshells", bin: "bio", note: "" },
  { name: "Small meat or fish scraps", bin: "bio", note: "" },
  { name: "Diaper (Windel)", bin: "rest", note: "" },
  { name: "Cigarette butts", bin: "rest", note: "" },
  { name: "Vacuum cleaner bag", bin: "rest", note: "" },
  {
    name: "Broken drinking glass",
    bin: "rest",
    note: "Different melting point than bottle glass — never put it in the Glascontainer.",
  },
  { name: "Broken ceramic or porcelain", bin: "rest", note: "" },
  {
    name: "Window glass or mirror",
    bin: "rest",
    note: "Not accepted at the Glascontainer.",
  },
  { name: "Used tissue or paper towel", bin: "rest", note: "" },
  { name: "Chewing gum", bin: "rest", note: "" },
  { name: "Candle stub with wax", bin: "rest", note: "" },
  {
    name: "Thermal paper receipt",
    bin: "rest",
    note: "The coating means it can't go with regular paper.",
  },
  {
    name: "CDs / DVDs",
    bin: "rest",
    note: "Small enough amounts go in Restmüll; a large batch can go to the Wertstoffhof.",
  },
  { name: "Incandescent light bulb", bin: "rest", note: "" },
  { name: "Styrofoam packaging", bin: "gelber", note: "" },
  { name: "Toothpaste tube", bin: "gelber", note: "" },
  { name: "Chip bag / crisp packet", bin: "gelber", note: "" },
  { name: "Milk or juice carton (Tetra Pak)", bin: "gelber", note: "" },
  { name: "Bubble wrap", bin: "gelber", note: "" },
  {
    name: "Energy-saving bulb / LED / fluorescent tube",
    bin: "wertstoffhof",
    note: "Contains materials that can't go in household waste — most supermarkets also take these back.",
  },
  {
    name: "Batteries",
    bin: "wertstoffhof",
    note: "Never in the bin — drop them at the small collection boxes in most supermarkets and drugstores.",
  },
  {
    name: "Old phone / small electronics",
    bin: "wertstoffhof",
    note: "Retailers above a certain size are legally required to take back old electronics.",
  },
  {
    name: "Paint cans with leftover paint",
    bin: "wertstoffhof",
    note: "Fully dried, empty paint cans can go in Restmüll instead.",
  },
  {
    name: "Old clothes / textiles",
    bin: "sperrmuell",
    note: "Use a dedicated Altkleider-Container, not the regular bins.",
  },
  {
    name: "Old furniture",
    bin: "sperrmuell",
    note: "Schedule a Sperrmüll pickup with your city, or drop it at the Wertstoffhof.",
  },
];

export default function RecyclingPage() {
  const [query, setQuery] = useState("");
  const filtered = ITEMS.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-teal-600 inline-flex items-center gap-1 mb-6"
        >
          ← Back to Klar
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">
            Recycling Sorting Guide
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Search any item to find out which German bin it goes in.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search an item, e.g. 'pizza box' or 'battery'..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white text-slate-900 mb-6"
        />

        <div className="space-y-3">
          {filtered.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium text-slate-800 text-sm">
                  {item.name}
                </h3>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${BINS[item.bin].color}`}
                >
                  {BINS[item.bin].label}
                </span>
              </div>
              {item.note && (
                <p className="text-xs text-slate-500 mt-2">{item.note}</p>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">
              No matches. Try a different word, or check with your local
              Wertstoffhof for unusual items.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
