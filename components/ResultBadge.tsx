export default function ResultBadge({ text, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700",
    good: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    brand: "bg-teal-50 text-teal-700",
  };
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${tones[tone] || tones.neutral}`}
    >
      {text}
    </span>
  );
}
