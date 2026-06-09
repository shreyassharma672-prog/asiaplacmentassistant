import { Download, FileText } from "lucide-react";
import Button from "./Button";

export default function ExportActions({
  hasResume,
  loading,
  onGenerate,
  onCopy,
  onExport,
}) {
  return (
    <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl shadow-slate-200/40 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20 sm:grid-cols-2 lg:grid-cols-4">
      <Button className="sm:col-span-2 lg:col-span-1" onClick={onGenerate} disabled={loading}>
        <FileText size={18} className={loading ? "animate-pulse" : ""} />
        {loading ? "Generating Resume..." : "Generate Resume"}
      </Button>
      <Button variant="secondary" onClick={onCopy} disabled={!hasResume || loading}>
        <FileText size={18} />
        Copy Resume
      </Button>
      <Button variant="secondary" onClick={() => onExport("txt")} disabled={!hasResume || loading}>
        <Download size={18} />
        TXT
      </Button>
      <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
        <Button variant="secondary" onClick={() => onExport("pdf")} disabled={!hasResume || loading}>
          <Download size={18} />
          PDF
        </Button>
        <Button variant="secondary" onClick={() => onExport("docx")} disabled={!hasResume || loading}>
          <Download size={18} />
          DOCX
        </Button>
      </div>
    </div>
  );
}
