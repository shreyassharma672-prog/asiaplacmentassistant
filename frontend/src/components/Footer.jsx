import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    ["Resume Builder", "/resume-builder"],
    ["ATS Checker", "/ats-checker"],
    ["Analyzer", "/analyzer"],
    ["Templates", "/templates"],
    ["Interview Prep", "/interview-prep"],
  ];

  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 font-black text-white shadow-lg shadow-blue-500/25">
              PA
            </span>
            <span>
              <span className="block font-extrabold text-slate-950 dark:text-white">
                Placement Assistant
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                AI Resume Builder & ATS Checker
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-400">
            A premium AI placement workspace for resume generation, ATS scoring,
            skill gap insights, templates, exports, and interview preparation.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-white">
            Product
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-400">
            {links.map(([label, to]) => (
              <Link key={to} to={to} className="transition hover:text-blue-500">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-white">
            Capabilities
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span>AI resume writing</span>
            <span>ATS optimization</span>
            <span>Resume quality analysis</span>
            <span>PDF, DOCX, and TXT export</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-white">
            Built For
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span>Campus placements</span>
            <span>Freshers</span>
            <span>Software roles</span>
            <span>Portfolio showcases</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-5 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400 sm:flex-row">
          <span>Copyright {currentYear} Placement Assistant. All rights reserved.</span>
          <span className="inline-flex items-center gap-2">
            <Sparkles size={16} className="text-blue-500" />
            Built as an AI-powered placement platform.
          </span>
        </div>
      </div>
    </footer>
  );
}
