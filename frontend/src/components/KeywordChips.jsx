import Card from "./Card";

const typeStyles = {
  matched:
    "border-emerald-400/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
  missing:
    "border-orange-400/30 bg-orange-500/10 text-orange-700 dark:text-orange-200",
  neutral:
    "border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300",
};

export default function KeywordChips({ title, keywords = [], type = "neutral" }) {
  const chipClass = typeStyles[type] || typeStyles.neutral;

  return (
    <Card className="p-6" variant="solid">
      <h3 className="text-lg font-black text-slate-950 dark:text-white">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {keywords.length > 0 ? (
          keywords.map((keyword) => (
            <span
              key={keyword}
              className={`rounded-full border px-3 py-1 text-sm font-bold ${chipClass}`}
            >
              {keyword}
            </span>
          ))
        ) : (
          <span className={`rounded-full border px-3 py-1 text-sm font-bold ${typeStyles.neutral}`}>
            None found
          </span>
        )}
      </div>
    </Card>
  );
}
