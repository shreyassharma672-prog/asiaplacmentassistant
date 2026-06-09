import { CheckCircle, X } from "lucide-react";

export default function Toast({ message, type = "info", visible = true, onClose }) {
  if (!visible) return null;

  const styles = {
    success: "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
    error: "border-red-400/40 bg-red-500/10 text-red-700 dark:text-red-200",
    warning: "border-amber-400/40 bg-amber-500/10 text-amber-700 dark:text-amber-200",
    info: "border-blue-400/40 bg-blue-500/10 text-blue-700 dark:text-blue-200",
  };

  return (
    <div
      className={`fixed right-4 top-4 z-[70] flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-2xl ${
        styles[type] || styles.info
      }`}
    >
      <CheckCircle size={20} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-sm font-semibold leading-6">{message}</p>
      {onClose && (
        <button type="button" aria-label="Close toast" onClick={onClose}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}
