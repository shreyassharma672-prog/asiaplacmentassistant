export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600 dark:text-cyan-300">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}
