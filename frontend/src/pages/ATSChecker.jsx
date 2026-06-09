import { useState } from "react";
import { BarChart3, CheckCircle, Sparkles, Target, Upload } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import ReportMetric from "../components/ReportMetric";
import Toast from "../components/Toast";
import { calculateATS } from "../utils/resumeAnalyzer";

const textareaClass =
  "min-h-72 w-full resize-y rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 text-sm leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500";

function getLevel(score) {
  if (score >= 80) return { label: "Excellent", tone: "green" };
  if (score >= 60) return { label: "Good", tone: "blue" };
  if (score >= 40) return { label: "Average", tone: "violet" };
  return { label: "Needs Work", tone: "red" };
}

function KeywordChips({ title, keywords, type }) {
  const color =
    type === "matched"
      ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-200"
      : "bg-violet-500/10 text-violet-700 dark:text-violet-200";

  return (
    <Card className="p-6" variant="solid">
      <h3 className="text-lg font-black text-slate-950 dark:text-white">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {keywords.length > 0 ? (
          keywords.map((keyword) => (
            <span key={keyword} className={`rounded-full px-3 py-1 text-sm font-bold ${color}`}>
              {keyword}
            </span>
          ))
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400">
            None found
          </span>
        )}
      </div>
    </Card>
  );
}

export default function ATSChecker() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [atsData, setAtsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleCheck = () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setToast({ message: "Please fill resume and job description", type: "error" });
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      try {
        const result = calculateATS(resume, jobDescription);
        setAtsData(result);
        setToast({ message: "ATS analysis complete", type: "success" });
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

  const level = atsData ? getLevel(atsData.score) : null;

  return (
    <>
      <PageHeader
        eyebrow="ATS Checker"
        title="Measure how well your resume matches a job"
        description="Paste your resume and a target job description to see keyword match, missing skills, and a clear ATS compatibility score."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
                Inputs
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                Resume and JD
              </h2>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
              <Upload size={18} />
              Upload TXT
              <input type="file" accept=".txt" className="hidden" onChange={handleResumeUpload} />
            </label>
          </div>

          <div className="grid gap-4">
            <textarea
              className={textareaClass}
              value={resume}
              onChange={(event) => setResume(event.target.value)}
              placeholder="Paste your resume text here..."
            />
            <textarea
              className={`${textareaClass} min-h-52`}
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job description here..."
            />
            <Button onClick={handleCheck} disabled={loading} className="w-full">
              <Sparkles size={18} className={loading ? "animate-pulse" : ""} />
              {loading ? "Analyzing..." : "Check ATS Score"}
            </Button>
          </div>
        </Card>

        <div className="grid gap-6">
          {atsData ? (
            <>
              <Card className="grid gap-6 p-6 md:grid-cols-[180px_1fr]" variant="gradient">
                <div className="grid place-items-center rounded-3xl border border-white/10 bg-white/10 p-5">
                  <div className="grid h-32 w-32 place-items-center rounded-full border-8 border-cyan-300 bg-slate-950/70">
                    <div className="text-center">
                      <div className="text-4xl font-black">{atsData.score}%</div>
                      <div className="text-xs font-bold text-cyan-200">ATS Score</div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-cyan-200">
                    {level.label}
                  </span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight">
                    Your resume has {atsData.score}% ATS compatibility.
                  </h2>
                  <p className="mt-4 leading-7 text-slate-300">{atsData.recommendation}</p>
                  <div className="mt-6 space-y-4">
                    <ReportMetric label="Keyword Match" value={`${atsData.score}%`} percent={atsData.score} tone={level.tone} contrast="inverse" />
                    <ReportMetric label="Resume Quality" value={atsData.score >= 70 ? "Strong" : "Improve"} percent={atsData.score >= 70 ? 82 : 48} tone="blue" contrast="inverse" />
                  </div>
                </div>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <KeywordChips title="Matched Keywords" keywords={atsData.matchedKeywords} type="matched" />
                <KeywordChips title="Missing Keywords" keywords={atsData.missingKeywords} type="missing" />
              </div>

              <Card className="p-6" variant="solid">
                <div className="flex items-center gap-3">
                  <Target size={22} className="text-violet-500" />
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">Suggestions</h3>
                </div>
                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                  Add missing job-related keywords naturally in your skills,
                  experience, and project sections. Prioritize terms that match
                  your actual experience and include measurable outcomes where possible.
                </p>
              </Card>
            </>
          ) : (
            <Card className="grid min-h-[620px] place-items-center p-8 text-center" variant="glass">
              <div className="max-w-md">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
                  <BarChart3 size={28} />
                </div>
                <h2 className="mt-6 text-2xl font-black text-slate-950 dark:text-white">
                  ATS Report Will Appear Here
                </h2>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                  Paste your resume and job description to check keyword match,
                  missing skills, suggestions, and ATS score.
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
