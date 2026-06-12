import { useMemo, useState } from "react";
import {
  Brain,
  Clipboard,
  Download,
  FileText,
  Lightbulb,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";
import { resumeApi } from "../api/axiosConfig";
import Button from "../components/Button";
import Card from "../components/Card";
import KeywordChips from "../components/KeywordChips";
import PageHeader from "../components/PageHeader";
import Toast from "../components/Toast";
import { trackEvent } from "../utils/analytics";

const ACCEPTED_EXTENSIONS = ["pdf", "doc", "docx", "txt"];
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/octet-stream",
];

const textareaClass =
  "min-h-52 w-full resize-y rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 text-sm leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500";

function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean).map(String) : [];
}

function asScore(value) {
  const score = Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getFileExtension(fileName = "") {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

function isAllowedResumeFile(file) {
  const extension = getFileExtension(file.name);
  return (
    ACCEPTED_EXTENSIONS.includes(extension) ||
    ACCEPTED_MIME_TYPES.includes(file.type)
  );
}

function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read TXT file"));
    reader.readAsText(file);
  });
}

function downloadTextFile(fileName, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function InsightList({ title, items, icon: Icon = Lightbulb, tone = "blue" }) {
  const safeItems = asArray(items);
  const toneClass =
    tone === "green"
      ? "text-emerald-500"
      : tone === "orange"
        ? "text-orange-500"
        : "text-blue-500";

  return (
    <Card className="p-6" variant="solid">
      <div className="flex items-center gap-3">
        <Icon size={22} className={toneClass} />
        <h3 className="text-lg font-black text-slate-950 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="mt-4 grid gap-3">
        {safeItems.length > 0 ? (
          safeItems.map((item, index) => (
            <p
              key={`${item}-${index}`}
              className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:bg-white/[0.04] dark:text-slate-300"
            >
              {item}
            </p>
          ))
        ) : (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-500 dark:bg-white/[0.04] dark:text-slate-400">
            Nothing flagged yet.
          </p>
        )}
      </div>
    </Card>
  );
}

export default function ResumeAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [improvedResume, setImprovedResume] = useState("");
  const [changesMade, setChangesMade] = useState([]);
  const [newAtsScore, setNewAtsScore] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");

  const normalizedAnalysis = useMemo(() => {
    if (!analysis || typeof analysis !== "object") return null;

    return {
      score: asScore(analysis.score ?? analysis.atsScore),
      matchedKeywords: asArray(analysis.matchedKeywords),
      missingKeywords: asArray(analysis.missingKeywords),
      missingSkills: asArray(analysis.missingSkills),
      strengths: asArray(analysis.strengths),
      improvements: asArray(analysis.improvements ?? analysis.suggestions),
      resumeText: String(analysis.resumeText || resumeText || ""),
    };
  }, [analysis, resumeText]);

  const activeScore =
    newAtsScore !== null ? asScore(newAtsScore) : normalizedAnalysis?.score || 0;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isAllowedResumeFile(file)) {
      setSelectedFile(null);
      setError("Unsupported file type. Upload PDF, DOC, DOCX, or TXT.");
      setToast({
        message: "Upload PDF, DOC, DOCX, or TXT only.",
        type: "error",
      });
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setAnalysis(null);
    setImprovedResume("");
    setChangesMade([]);
    setNewAtsScore(null);
    setResumeText("");
    setError("");
    setToast({ message: `${file.name} selected`, type: "success" });
  };

  const extractSelectedResumeText = async () => {
    const extension = getFileExtension(selectedFile.name);

    if (extension === "txt" || selectedFile.type === "text/plain") {
      const text = await readTextFile(selectedFile);
      setResumeText(text);
      return text;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    const response = await resumeApi.extractResume(formData);
    const text = String(response.data?.text || "");
    setResumeText(text);
    return text;
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please upload a PDF, DOC, DOCX, or TXT resume.");
      setToast({ message: "Please upload a resume file", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("jobDescription", jobDescription);

    setLoading(true);
    setAnalysis(null);
    setImprovedResume("");
    setChangesMade([]);
    setNewAtsScore(null);
    setError("");

    try {
      const extractedText = await extractSelectedResumeText();

      if (!extractedText.trim()) {
        throw new Error("Could not extract text from resume. The file may be empty or scanned.");
      }

      const response = await resumeApi.analyzeUploadedResume(formData);
      setAnalysis(response.data || null);
      trackEvent("Resume Analyzed", {
        feature: "resume_analyzer",
        source: "uploaded_resume",
        has_job_description: Boolean(jobDescription.trim()),
      });
      setToast({ message: "Resume analysis complete", type: "success" });
    } catch (error) {
      const message =
        error.response?.data?.error ||
        "Unable to analyze resume. Check backend and Gemini setup.";
      setError(message);
      setToast({
        message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    const resumeText = normalizedAnalysis?.resumeText || "";

    if (!resumeText.trim()) {
      setToast({ message: "Analyze an uploaded resume first", type: "error" });
      return;
    }

    setImproving(true);

    try {
      const response = await resumeApi.improveUploadedResume({
        resumeText,
        jobDescription,
        missingKeywords: normalizedAnalysis?.missingKeywords || [],
        missingSkills: normalizedAnalysis?.missingSkills || [],
      });

      const data = response.data || {};
      setImprovedResume(String(data.improvedResume || ""));
      setNewAtsScore(asScore(data.newAtsScore));
      setChangesMade(asArray(data.changesMade));
      setToast({ message: "AI improved resume generated", type: "success" });
    } catch (error) {
      setToast({
        message:
          error.response?.data?.error || "Unable to improve resume with AI",
        type: "error",
      });
    } finally {
      setImproving(false);
    }
  };

  const handleCopyImprovedResume = async () => {
    if (!improvedResume.trim()) {
      setToast({ message: "No improved resume to copy yet", type: "error" });
      return;
    }

    try {
      await navigator.clipboard.writeText(improvedResume);
      setToast({ message: "Improved resume copied", type: "success" });
    } catch {
      setToast({ message: "Unable to copy improved resume", type: "error" });
    }
  };

  const handleDownloadImprovedResume = () => {
    if (!improvedResume.trim()) {
      setToast({ message: "No improved resume to download yet", type: "error" });
      return;
    }

    downloadTextFile("improved-resume.txt", improvedResume);
    setToast({ message: "Improved resume downloaded", type: "success" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Resume Analyzer"
        title="Upload resume, find ATS gaps, improve with AI"
        description="Upload a PDF, DOC, DOCX, or TXT resume, optionally add a job description, then get ATS scoring, missing skills, and a Gemini-powered rewrite that preserves your real experience."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-black text-blue-700 dark:text-cyan-200">
            <FileText size={16} />
            PDF, DOC, DOCX, TXT
          </div>
        }
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:px-8">
        <Card className="p-6">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
              Inputs
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              Resume and Role Context
            </h2>
          </div>

          <div className="grid gap-4">
            <label className="grid cursor-pointer place-items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/60 dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]">
              <Upload size={28} className="text-blue-500 dark:text-cyan-300" />
              <span className="mt-3 text-sm font-black text-slate-950 dark:text-white">
                Upload Resume File
              </span>
              <span className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                {selectedFile?.name || "Choose a resume file to analyze"}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {error && (
              <div className="rounded-2xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-700 dark:text-orange-200">
                {error}
              </div>
            )}

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Job Description Optional
              </span>
              <textarea
                className={textareaClass}
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the target job description here..."
              />
            </label>

            <Button onClick={handleAnalyze} disabled={loading}>
              <Sparkles size={18} className={loading ? "animate-pulse" : ""} />
              {loading ? "Analyzing..." : "Analyze Uploaded Resume"}
            </Button>
          </div>
        </Card>

        <div className="grid content-start gap-6">
          {normalizedAnalysis ? (
            <>
              <Card className="p-6" variant="gradient">
                <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                  <div className="grid place-items-center rounded-3xl border border-white/10 bg-white/10 p-5">
                    <div className="grid h-32 w-32 place-items-center rounded-full border-8 border-cyan-300 bg-slate-950/70">
                      <div className="text-center">
                        <div className="text-4xl font-black">{activeScore}%</div>
                        <div className="text-xs font-bold text-cyan-200">
                          ATS Score
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-cyan-200">
                      {newAtsScore !== null ? "Improved Score" : "Current Score"}
                    </span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight">
                      Your resume scores {activeScore}% for ATS alignment.
                    </h2>
                    <p className="mt-4 leading-7 text-slate-300">
                      Review missing keywords and skills, then use AI improvement
                      to polish wording without adding fake experience.
                    </p>
                    <Button
                      className="mt-6"
                      variant="secondary"
                      onClick={handleImprove}
                      disabled={improving}
                    >
                      <Brain size={18} className={improving ? "animate-pulse" : ""} />
                      {improving ? "Improving..." : "Improve Resume With AI"}
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <KeywordChips
                  title="Matched Keywords"
                  keywords={normalizedAnalysis.matchedKeywords}
                  type="matched"
                />
                <KeywordChips
                  title="Missing Keywords"
                  keywords={normalizedAnalysis.missingKeywords}
                  type="missing"
                />
                <KeywordChips
                  title="Missing Skills"
                  keywords={normalizedAnalysis.missingSkills}
                  type="missing"
                />
                <InsightList
                  title="Strengths"
                  items={normalizedAnalysis.strengths}
                  icon={Target}
                  tone="green"
                />
              </div>

              <InsightList
                title="Improvement Suggestions"
                items={normalizedAnalysis.improvements}
                icon={Lightbulb}
                tone="orange"
              />
            </>
          ) : (
            <Card className="grid min-h-[520px] place-items-center p-8 text-center">
              <div className="max-w-md">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
                  <Brain size={28} />
                </div>
                <h2 className="mt-6 text-2xl font-black text-slate-950 dark:text-white">
                  Your ATS Report Will Appear Here
                </h2>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                  Upload a PDF, DOC, DOCX, or TXT resume to see ATS score, matched
                  keywords, missing skills, strengths, and suggestions.
                </p>
              </div>
            </Card>
          )}

          {improvedResume && (
            <Card className="p-6" variant="solid">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
                    AI Improved Resume
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                    New ATS Score: {activeScore}%
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={handleCopyImprovedResume}>
                    <Clipboard size={16} />
                    Copy
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleDownloadImprovedResume}>
                    <Download size={16} />
                    Download TXT
                  </Button>
                </div>
              </div>

              {changesMade.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {changesMade.map((change, index) => (
                    <span
                      key={`${change}-${index}`}
                      className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-700 dark:text-cyan-200"
                    >
                      {change}
                    </span>
                  ))}
                </div>
              )}

              <pre className="mt-5 max-h-[640px] overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-100 p-5 text-sm leading-7 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                {improvedResume}
              </pre>
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
