import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Sparkles, X } from "lucide-react";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Resume Builder", to: "/resume-builder" },
  { label: "ATS Checker", to: "/ats-checker" },
  { label: "Resume Analyzer", to: "/resume-analyzer" },
  { label: "Analyzer", to: "/analyzer" },
  { label: "Templates", to: "/templates" },
  { label: "Interview Prep", to: "/interview-prep" },
  { label: "About", to: "/about" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 font-black text-white shadow-lg shadow-blue-500/25">
            PA
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-base">
              Placement Assistant
            </span>
            <span className="hidden truncate text-xs font-medium text-slate-500 dark:text-slate-400 sm:block">
              AI Resume Builder & ATS Checker
            </span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-slate-200 bg-white/70 p-1 shadow-sm dark:border-white/10 dark:bg-white/5 xl:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <ThemeToggle />
          <Button to="/resume-builder" size="sm">
            <Sparkles size={16} />
            Get Started
          </Button>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setIsOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-4 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95 xl:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button
              to="/resume-builder"
              className="mt-2 w-full"
              onClick={() => setIsOpen(false)}
            >
              <Sparkles size={16} />
              Start Building
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
