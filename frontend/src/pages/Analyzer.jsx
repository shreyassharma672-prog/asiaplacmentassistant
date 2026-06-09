import { useState } from "react";
import { Brain, CheckCircle, Sparkles, Target, Upload } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import ReportMetric from "../components/ReportMetric";
import Toast from "../components/Toast";
import { analyzeResume } from "../utils/resumeAnalyzer";

const textareaClass =
  "min-h-[420px] w-full resize-y rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 text-sm leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500";

function getLevel(score) {
  if (score >= 80) return { label: "Excellent", tone: "green" };
  if (score >= 60) return { label: "Good", tone: "blue" };
  if (score >= 40) return { label: "Average", tone: "violet" };
  return { label: "Needs Work", tone: "red" };
}

export default function Analyzer() {
  const [resume, setResume] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleAnalyze = () => {
    if (!resume.trim()) {
      setToast({ message: "Please enter your resume text", type: "error" });
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      try {
        setAnalysis(analyzeResume(resume));
        setToast({ message: "Resume analysis complete", type: "success" });
      } catch {
        setToast({ message: "Error analyzing resume", type: "error" });
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const text = await file.text();
      setResume(text);
      setToast({ message: "Resume uploaded successfully", type: "success" });
    } else {
      setToast({ message: "Only TXT upload is supported here. Paste PDF or DOCX text manually.", type: "error" });
    }
  };

  const score = analysis?.completenessScore || 0;
  const level = analysis ? getLevel(score) : null;

  return (
    <>
      <PageHeader
        eyebrow="Resume Analyzer"
        title="Audit structure, completeness, and resume quality"
        description="Use AI-assisted scoring to identify missing sections, weak structure, and improvement areas before applying."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
                Resume Input
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                Paste or Upload
              </h2>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
              <Upload size={18} />
              Upload TXT
              <input type="file" accept=".txt" className="hidden" onChange={handleResumeUpload} />
            </label>
          </div>
          <textarea
            className={textareaClass}
            value={resume}
            onChange={(event) => setResume(event.target.value)}
            placeholder="Paste your resume text here..."
          />
          <Button className="mt-5 w-full" onClick={handleAnalyze} disabled={loading}>
            <Sparkles size={18} className={loading ? "animate-pulse" : ""} />
            {loading ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </Card>

        <div className="grid gap-6">
          {analysis ? (
            <>
              <Card className="p-6" variant="gradient">
                <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                  <div className="grid place-items-center rounded-3xl border border-white/10 bg-white/10 p-5">
                    <div className="grid h-32 w-32 place-items-center rounded-full border-8 border-cyan-300 bg-slate-950/70">
                      <div className="text-center">
                        <div className="text-4xl font-black">{score}%</div>
                        <div className="text-xs font-bold text-cyan-200">Quality</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-cyan-200">
                      {level.label}
                    </span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight">
                      Your resume completeness score is {score}%.
                    </h2>
                    <p className="mt-4 leading-7 text-slate-300">
                      The score reflects section coverage, content availability,
                      and overall resume structure.
                    </p>
                    <div className="mt-6">
                      <ReportMetric label="Completeness" value={`${score}%`} percent={score} tone={level.tone} contrast="inverse" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6" variant="solid">
                <div className="flex items-center gap-3">
                  <CheckCircle size={22} className="text-cyan-500" />
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">Sections Found</h3>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {Object.entries(analysis.sections).map(([key, value]) => (
                    <div
                      key={key}
                      className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                        value
                          ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200"
                          : "border-violet-400/30 bg-violet-500/10 text-violet-700 dark:text-violet-200"
                      }`}
                    >
                      {key.replace("has", "")}: {value ? "Yes" : "No"}
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6" variant="solid">
                <div className="flex items-center gap-3">
                  <Target size={22} className="text-violet-500" />
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">Suggestions</h3>
                </div>
                <div className="mt-4 grid gap-3">
                  {analysis.suggestions.length > 0 ? (
                    analysis.suggestions.map((suggestion) => (
                      <p key={suggestion} className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
                        {suggestion}
                      </p>
                    ))
                  ) : (
                    <p className="rounded-2xl bg-cyan-500/10 p-4 text-sm font-semibold leading-7 text-cyan-700 dark:text-cyan-200">
                      Your resume looks complete and well structured.
                    </p>
                  )}
                </div>
              </Card>
            </>
          ) : (
            <Card className="grid min-h-[620px] place-items-center p-8 text-center">
              <div className="max-w-md">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
                  <Brain size={28} />
                </div>
                <h2 className="mt-6 text-2xl font-black text-slate-950 dark:text-white">
                  Resume Report Will Appear Here
                </h2>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                  Paste your resume to check completeness, missing sections,
                  and improvement suggestions.
                </p>
              </div>
            </Card>
          )}
        </div>
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
