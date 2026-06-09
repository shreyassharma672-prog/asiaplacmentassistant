const variants = {
  glass:
    "border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20",
  solid:
    "border border-slate-200 bg-white shadow-lg shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20",
  gradient:
    "border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white shadow-2xl shadow-blue-950/20",
  interactive:
    "border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20",
};

export default function Card({ children, className = "", variant = "glass" }) {
  return (
    <div className={`rounded-3xl ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
