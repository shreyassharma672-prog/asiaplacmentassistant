import { CheckCircle, FileText, Sparkles } from "lucide-react";
import Button from "./Button";
import Card from "./Card";

export default function TemplateCard({
  title,
  name,
  category,
  description,
  preview,
  features = [],
  tags = [],
  active,
  onSelect,
}) {
  const displayName = name || title;
  const displayTags = tags.length > 0 ? tags : features;

  return (
    <Card
      className={`h-full overflow-hidden p-5 ${
        active ? "ring-2 ring-blue-400 dark:ring-cyan-300" : ""
      }`}
      variant="interactive"
    >
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <FileText size={16} />
            {category || "Resume"}
          </div>
          {active && <CheckCircle size={18} className="text-cyan-400" />}
        </div>
        {preview && (
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-blue-700 shadow-sm dark:bg-white/10 dark:text-cyan-200">
            <Sparkles size={14} />
            {preview}
          </div>
        )}
        <div className="space-y-2">
          <div className="h-3 w-3/4 rounded-full bg-slate-300 dark:bg-white/20" />
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10" />
          <div className="h-2 w-5/6 rounded-full bg-slate-200 dark:bg-white/10" />
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-blue-300/80 dark:bg-blue-400/40" />
              <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-violet-300/80 dark:bg-violet-400/40" />
              <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      <h3 className="mt-5 text-lg font-extrabold text-slate-950 dark:text-white">
        {displayName}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>
      {onSelect && (
        <Button
          type="button"
          variant={active ? "secondary" : "primary"}
          className="mt-5 w-full"
          onClick={onSelect}
        >
          {active ? "Selected" : "Use Template"}
        </Button>
      )}
    </Card>
  );
}
