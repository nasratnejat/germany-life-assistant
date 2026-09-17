export default function ResultList({ title, items, icon, tone = "neutral" }) {
  if (!items || items.length === 0) return null;
  const tones = {
    neutral: {
      wrap: "bg-white border-slate-200",
      title: "text-slate-800",
      bullet: "text-slate-400",
    },
    good: {
      wrap: "bg-white border-slate-200",
      title: "text-slate-800",
      bullet: "text-emerald-600",
    },
    warning: {
      wrap: "bg-amber-50 border-amber-200",
      title: "text-amber-800",
      bullet: "text-amber-600",
    },
    danger: {
      wrap: "bg-white border-slate-200",
      title: "text-slate-800",
      bullet: "text-red-500",
    },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <div className={`rounded-2xl border p-6 ${t.wrap}`}>
      <h3 className={`text-sm font-semibold mb-3 ${t.title}`}>
        {icon ? `${icon} ` : ""}
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-600 flex gap-2">
            <span className={t.bullet}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
