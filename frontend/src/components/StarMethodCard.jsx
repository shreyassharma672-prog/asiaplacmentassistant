import { Target } from "lucide-react";
import Card from "./Card";

const blocks = [
  ["Situation", "Set the context. What was happening?"],
  ["Task", "Explain your responsibility or goal."],
  ["Action", "Describe what you specifically did."],
  ["Result", "Share the outcome, impact, or learning."],
];

export default function StarMethodCard({ example }) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-white">
          <Target size={22} />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
            STAR Method
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
            Structure behavioral answers
          </h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {blocks.map(([title, detail]) => (
          <div
            key={title}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]"
          >
            <h3 className="text-lg font-black text-slate-950 dark:text-white">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {detail}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-blue-400/20 bg-blue-500/10 p-5">
        <p className="text-sm font-black text-blue-700 dark:text-cyan-200">
          Example Answer
        </p>
        <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
          <p><strong>Situation:</strong> {example.situation}</p>
          <p><strong>Task:</strong> {example.task}</p>
          <p><strong>Action:</strong> {example.action}</p>
          <p><strong>Result:</strong> {example.result}</p>
        </div>
      </div>
    </Card>
  );
}
