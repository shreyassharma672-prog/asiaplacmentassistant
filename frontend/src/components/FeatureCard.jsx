import Card from "./Card";

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="group h-full p-6" variant="interactive">
      <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25 transition duration-300 group-hover:scale-105">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </Card>
  );
}
