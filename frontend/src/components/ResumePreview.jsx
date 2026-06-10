import { FileText } from "lucide-react";
import Card from "./Card";

const previewClasses = {
  "ATS Friendly": "border-l-4 border-blue-500",
  "Modern Fresher": "border-t-4 border-cyan-400",
  "Software Engineer": "border-l-4 border-violet-500 font-mono",
  "Internship Resume": "border-t-4 border-blue-500",
  "Professional Clean": "border-l-4 border-slate-400",
};

export default function ResumePreview({
  generatedResume = "",
  template = "ATS Friendly",
  profilePhoto = null,
}) {
  const safeResume =
    typeof generatedResume === "string"
      ? generatedResume
      : String(generatedResume || "");

  const isGenerated = Boolean(safeResume.trim());

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
            Resume Preview
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {isGenerated ? "Generated Resume" : "Waiting for AI Resume"}
          </h2>
        </div>

        <div className="hidden rounded-full border border-slate-200 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-500 dark:border-white/10 dark:text-slate-400 sm:block">
          {template}
        </div>
      </div>

      <div
        id="resume-preview"
        className="min-h-[720px] rounded-3xl border border-slate-200 bg-white p-5 text-slate-950 shadow-xl dark:border-slate-800"
      >
        {profilePhoto && typeof profilePhoto === "string" && (
          <img
            src={profilePhoto}
            alt="Profile"
            className="mx-auto mb-5 h-24 w-24 rounded-3xl object-cover"
          />
        )}

        {isGenerated ? (
          <pre
            className={`min-h-[650px] whitespace-pre-wrap rounded-2xl bg-white p-6 text-sm leading-8 text-slate-900 ${
              previewClasses[template] || previewClasses["ATS Friendly"]
            }`}
          >
            {safeResume}
          </pre>
        ) : (
          <div className="flex min-h-[650px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <FileText size={42} className="mb-4 text-blue-500" />

            <h3 className="text-xl font-black text-slate-900">
              Fill your details and click Generate Resume
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              AI will correct spelling, improve grammar, and generate a polished
              ATS-friendly resume after you click generate.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}