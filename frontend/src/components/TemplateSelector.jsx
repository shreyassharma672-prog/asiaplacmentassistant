import { CheckCircle, FileText } from "lucide-react";
import Card from "./Card";

const descriptions = {
  "ATS Friendly": "Parser-safe layout for application portals.",
  "Modern Fresher": "Balanced layout for students and campus placements.",
  "Software Engineer": "Project-heavy structure for technical roles.",
  "Internship Resume": "Focused format for early career applications.",
  "Professional Clean": "Polished format for broad job applications.",
};

export default function TemplateSelector({ templates, selectedTemplate, onSelect }) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
          Template Options
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
          Choose Resume Style
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {templates.map((template) => {
          const active = selectedTemplate === template;

          return (
            <button
              key={template}
              type="button"
              onClick={() => onSelect(template)}
              className={`group rounded-3xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 ${
                active
                  ? "border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/10 dark:border-cyan-300/60 dark:bg-cyan-300/10"
                  : "border-slate-200 bg-white/60 hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-300/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-white">
                  <FileText size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-black text-slate-950 dark:text-white">
                      {template}
                    </h3>
                    {active && <CheckCircle size={18} className="shrink-0 text-cyan-500" />}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {descriptions[template]}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
