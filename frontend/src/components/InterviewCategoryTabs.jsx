export default function InterviewCategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-3xl border border-slate-200 bg-white/70 p-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
      {categories.map((category) => {
        const active = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-black transition ${
              active
                ? "bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
