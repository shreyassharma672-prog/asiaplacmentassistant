import { Link } from "react-router-dom";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  to,
  ...props
}) {
  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-bold tracking-tight transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-offset-slate-950";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:shadow-blue-500/35",
    secondary:
      "border border-slate-200 bg-white text-slate-900 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
    outline:
      "border border-blue-400/50 bg-blue-500/5 text-blue-600 hover:-translate-y-0.5 hover:bg-blue-500/10 dark:text-blue-300",
    danger:
      "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:-translate-y-0.5 hover:bg-red-600",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  const classes = `${baseClass} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
