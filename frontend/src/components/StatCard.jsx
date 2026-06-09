import Card from "./Card";

export default function StatCard({ value, label, detail }) {
  return (
    <Card className="p-6" variant="interactive">
      <div className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
        {value}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </div>
      {detail && (
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {detail}
        </p>
      )}
    </Card>
  );
}
