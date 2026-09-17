"use client";

import { useState } from "react";
import { inputClass } from "../lib/styles";

export default function SearchList({
  placeholder,
  items,
  filterFn,
  renderItem,
  emptyMessage,
}) {
  const [query, setQuery] = useState("");
  const filtered = items.filter((item) => filterFn(item, query));

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`${inputClass} mb-6`}
      />
      <div className="space-y-3">
        {filtered.map((item, i) => (
          <div key={i}>{renderItem(item)}</div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">
            {emptyMessage || "No matches."}
          </p>
        )}
      </div>
    </div>
  );
}
