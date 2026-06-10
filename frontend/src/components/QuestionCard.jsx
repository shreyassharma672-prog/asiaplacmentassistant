import { FileText } from "lucide-react";
import Button from "./Button";
import Card from "./Card";

export default function QuestionCard({ question, answer, tips = [], onCopy }) {
  return (
    <Card className="p-6" variant="interactive">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
            Interview Question
          </p>
          <h3 className="mt-3 text-xl font-black leading-snug text-slate-950 dark:text-white">
            {question}
          </h3>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => onCopy?.(`${question}\n\n${answer}`)}
          className="shrink-0"
        >
          <FileText size={16} />
          Copy
        </Button>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-sm font-black text-slate-950 dark:text-white">Sample Answer</p>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          {answer}
        </p>
      </div>

      {tips.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-black text-slate-950 dark:text-white">Tips</p>
          <ul className="mt-3 grid gap-2">
            {tips.map((tip) => (
              <li key={tip} className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
