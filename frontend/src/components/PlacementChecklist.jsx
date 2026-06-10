import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import Card from "./Card";

const STORAGE_KEY = "interviewPrepChecklist";

function getInitialState(items) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    return items.reduce(
      (state, item) => ({
        ...state,
        [item]: Boolean(parsed[item]),
      }),
      {}
    );
  } catch {
    return items.reduce((state, item) => ({ ...state, [item]: false }), {});
  }
}

export default function PlacementChecklist({ items }) {
  const [checked, setChecked] = useState(() => getInitialState(items));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const completed = Object.values(checked).filter(Boolean).length;
  const percent = Math.round((completed / items.length) * 100);

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
            Placement Checklist
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            Preparation progress
          </h2>
        </div>
        <div className="rounded-full bg-blue-500/10 px-4 py-2 text-sm font-black text-blue-700 dark:text-cyan-200">
          {percent}% ready
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <label
            key={item}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5 ${
              checked[item]
                ? "border-emerald-400/30 bg-emerald-500/10"
                : "border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/[0.04]"
            }`}
          >
            <input
              type="checkbox"
              checked={checked[item]}
              onChange={(event) =>
                setChecked((current) => ({
                  ...current,
                  [item]: event.target.checked,
                }))
              }
              className="h-5 w-5 accent-blue-500"
            />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {item}
            </span>
            {checked[item] && <CheckCircle size={18} className="ml-auto text-emerald-500" />}
          </label>
        ))}
      </div>
    </Card>
  );
}
