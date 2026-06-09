const toneClasses = {
  blue: "from-blue-500 to-cyan-400",
  cyan: "from-cyan-400 to-blue-500",
  violet: "from-violet-500 to-blue-500",
  green: "from-emerald-400 to-cyan-400",
  red: "from-red-400 to-orange-400",
};

const widthClasses = [
  "w-0",
  "w-[10%]",
  "w-[20%]",
  "w-[30%]",
  "w-[40%]",
  "w-1/2",
  "w-[60%]",
  "w-[70%]",
  "w-4/5",
  "w-[90%]",
  "w-full",
];

function getWidthClass(percent = 0) {
  const index = Math.max(0, Math.min(10, Math.round(Number(percent) / 10)));
  return widthClasses[index];
}

export default function ReportMetric({
  label,
  value,
  percent = 0,
  tone = "blue",
  contrast = "default",
}) {
  const labelClass =
    contrast === "inverse"
      ? "text-slate-300"
      : "text-slate-600 dark:text-slate-300";
  const valueClass =
    contrast === "inverse" ? "text-white" : "text-slate-950 dark:text-white";
  const trackClass =
    contrast === "inverse" ? "bg-white/10" : "bg-slate-200 dark:bg-white/10";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className={`font-semibold ${labelClass}`}>{label}</span>
        <span className={`font-black ${valueClass}`}>{value}</span>
      </div>
      <div className={`h-2.5 overflow-hidden rounded-full ${trackClass}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${
            toneClasses[tone] || toneClasses.blue
          } ${getWidthClass(percent)}`}
        />
      </div>
    </div>
  );
}
