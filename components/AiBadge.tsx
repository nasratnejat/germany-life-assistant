import { Sparkles } from "lucide-react";

export default function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-1.5 py-0.5 flex-shrink-0">
      <Sparkles className="w-2.5 h-2.5" />
      AI
    </span>
  );
}
