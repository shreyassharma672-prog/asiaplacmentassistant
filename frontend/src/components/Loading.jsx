import { Sparkles } from "lucide-react";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-4 grid h-14 w-14 animate-pulse place-items-center rounded-3xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
        <Sparkles size={24} />
      </div>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}
