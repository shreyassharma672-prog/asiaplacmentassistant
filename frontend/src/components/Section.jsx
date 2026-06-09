export default function Section({ eyebrow, title, description, children, className = "" }) {
  return (
    <section className={`mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 ${className}`}>
      {(eyebrow || title || description) && (
        <div className="mx-auto mb-10 max-w-3xl text-center">
          {eyebrow && (
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600 dark:text-cyan-300">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
