import { FileText } from "lucide-react";
import Card from "./Card";

const previewClasses = {
  "ATS Friendly": "border-l-4 border-blue-500",
  "Modern Fresher": "border-t-4 border-cyan-400",
  "Software Engineer": "border-l-4 border-violet-500 font-mono",
  "Internship Resume": "border-t-4 border-blue-500",
  "Professional Clean": "border-l-4 border-slate-400",
};

function buildDraftPreview(formData, template, jobDescription) {
  const lines = [
    formData.name || "Your Name",
    [formData.email, formData.phone].filter(Boolean).join(" | "),
    [formData.linkedin, formData.github].filter(Boolean).join(" | "),
    "",
    "Professional Summary",
    jobDescription
      ? `Targeting a role aligned with: ${jobDescription.slice(0, 180)}${jobDescription.length > 180 ? "..." : ""}`
      : "AI-generated professional summary will appear after resume generation.",
    "",
    "Education",
    formData.education || "Add your education details.",
    "",
    "Skills",
    formData.skills || "Add your technical and soft skills.",
    "",
    "Projects",
    formData.projects || "Add your projects with tech stack and measurable impact.",
    "",
    "Experience",
    formData.experience || "Add internship, work, or leadership experience.",
    "",
    "Achievements",
    formData.achievements || "Add achievements, awards, and accomplishments.",
    "",
    "Certifications",
    formData.certifications || "Add certifications and relevant courses.",
    "",
    `Template: ${template}`,
  ];

  return lines.filter((line, index) => line || lines[index - 1] !== "").join("\n");
}

export default function ResumePreview({
  generatedResume,
  formData,
  template,
  jobDescription,
  profilePhoto,
}) {
  const previewText =
    generatedResume || buildDraftPreview(formData, template, jobDescription);
  const isGenerated = Boolean(generatedResume);

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
            Live Preview
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {isGenerated ? "Generated Resume" : "Draft Preview"}
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
        {profilePhoto && (
          <img
            src={profilePhoto}
            alt="Profile"
            className="mx-auto mb-5 h-24 w-24 rounded-3xl object-cover"
          />
        )}

        <pre
          className={`min-h-[650px] whitespace-pre-wrap rounded-2xl bg-white p-6 text-sm leading-8 text-slate-900 ${
            previewClasses[template] || previewClasses["ATS Friendly"]
          }`}
        >
          {previewText}
        </pre>
      </div>

      {!isGenerated && (
        <div className="mt-4 flex items-start gap-3 rounded-3xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm leading-6 text-blue-700 dark:text-cyan-200">
          <FileText size={18} className="mt-0.5 shrink-0" />
          This preview updates as you type. Generate the resume to replace it
          with AI-written content.
        </div>
      )}
    </Card>
  );
}
