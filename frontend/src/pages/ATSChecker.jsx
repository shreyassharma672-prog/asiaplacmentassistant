import { useState } from "react";
import { Brain, FileText, Sparkles, Target, Upload, X } from "lucide-react";
import ATSScoreCard from "../components/ATSScoreCard";
import Button from "../components/Button";
import Card from "../components/Card";
import KeywordChips from "../components/KeywordChips";
import PageHeader from "../components/PageHeader";
import Toast from "../components/Toast";
import { resumeApi } from "../api/axiosConfig";
import { IMPORTANT_SKILLS, STOP_WORDS } from "../utils/constants";
import { trackEvent } from "../utils/analytics";

const ATS_HISTORY_KEY = "atsHistory";
const ACCEPTED_RESUME_EXTENSIONS = ["pdf", "doc", "docx", "txt"];
const ACCEPTED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/octet-stream",
];

const textareaClass =
  "min-h-64 w-full resize-y rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 text-sm leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500";

const sectionRules = [
  { key: "education", label: "Education", pattern: /education|degree|bachelor|master|diploma|university|college|cgpa/i },
  { key: "skills", label: "Skills", pattern: /skills|technical skills|technologies|tools|expertise/i },
  { key: "projects", label: "Projects", pattern: /project|built|developed|created|implemented|designed/i },
  { key: "experience", label: "Experience", pattern: /experience|intern|internship|worked|employment|role|responsibilities/i },
  { key: "achievements", label: "Achievements", pattern: /achievement|award|hackathon|rank|certified|winner|recognition/i },
  { key: "certifications", label: "Certifications", pattern: /certification|certificate|course|training|workshop/i },
  { key: "contact", label: "Contact Details", pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(\+?\d[\d\s-]{8,})|linkedin|github/i },
];

function getInitialHistory() {
  try {
    const saved = localStorage.getItem(ATS_HISTORY_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeText(text) {
  return String(text || "").toLowerCase();
}

function extractKeywords(jobDescription) {
  const jdLower = normalizeText(jobDescription);
  const words = jdLower
    .replace(/[^\w\s+#.-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !STOP_WORDS.includes(word));

  const skillKeywords = IMPORTANT_SKILLS.filter((skill) => jdLower.includes(skill));
  return [...new Set([...skillKeywords, ...words])].slice(0, 80);
}

function createSuggestions({ missingKeywords, sectionChecklist, score }) {
  const suggestions = [];
  const missingSections = sectionChecklist.filter((section) => !section.present);

  if (missingKeywords.length > 0) {
    suggestions.push(`Add relevant missing keywords naturally: ${missingKeywords.slice(0, 8).join(", ")}.`);
  }
  if (missingSections.length > 0) {
    suggestions.push(`Improve resume structure by adding: ${missingSections.map((section) => section.label).join(", ")}.`);
  }
  if (score < 65) {
    suggestions.push("Quantify project and experience impact with metrics, tools used, and outcomes.");
  }
  if (score >= 80) {
    suggestions.push("Strong match. Fine-tune wording for the exact role and keep the resume concise.");
  }

  return suggestions;
}

function calculateLocalATS(resumeText, jobDescription) {
  const resumeLower = normalizeText(resumeText);
  const keywords = extractKeywords(jobDescription);
  const matchedKeywords = keywords.filter((keyword) => resumeLower.includes(keyword));
  const missingKeywords = keywords.filter((keyword) => !resumeLower.includes(keyword));

  const keywordMatch = keywords.length
    ? Math.round((matchedKeywords.length / keywords.length) * 100)
    : 0;

  const sectionChecklist = sectionRules.map((section) => ({
    ...section,
    present: section.pattern.test(resumeText),
  }));

  const sectionCompleteness = Math.round(
    (sectionChecklist.filter((section) => section.present).length / sectionChecklist.length) * 100
  );

  const contactDetails = sectionChecklist.find((section) => section.key === "contact")?.present
    ? 100
    : 0;

  const relevanceTerms = [
    ...IMPORTANT_SKILLS,
    "project",
    "projects",
    "developed",
    "built",
    "implemented",
    "api",
    "database",
    "frontend",
    "backend",
  ];
  const jdRelevantTerms = relevanceTerms.filter((term) => normalizeText(jobDescription).includes(term));
  const resumeRelevantTerms = jdRelevantTerms.filter((term) => resumeLower.includes(term));
  const relevance = jdRelevantTerms.length
    ? Math.round((resumeRelevantTerms.length / jdRelevantTerms.length) * 100)
    : sectionChecklist.find((section) => section.key === "skills")?.present &&
        sectionChecklist.find((section) => section.key === "projects")?.present
      ? 70
      : 35;

  const score = Math.min(
    100,
    Math.round(
      keywordMatch * 0.45 +
        sectionCompleteness * 0.25 +
        contactDetails * 0.15 +
        relevance * 0.15
    )
  );

  const suggestions = createSuggestions({
    missingKeywords,
    sectionChecklist,
    score,
  });

  return {
    score,
    level:
      score >= 80 ? "Excellent" : score >= 65 ? "Good" : score >= 45 ? "Average" : "Low",
    matchedKeywords: matchedKeywords.slice(0, 24),
    missingKeywords: missingKeywords.slice(0, 24),
    suggestions,
    sectionChecklist,
    breakdown: {
      keywordMatch,
      sectionCompleteness,
      contactDetails,
      relevance,
    },
    summary:
      score >= 80
        ? "Excellent match. Your resume is well aligned with the job description."
        : score >= 65
          ? "Good match. Add a few missing keywords and strengthen role-specific details."
          : score >= 45
            ? "Average match. Improve missing sections, keywords, and project relevance."
            : "Low match. Add more job-specific keywords, complete sections, and stronger project detail.",
  };
}

function saveHistoryItem(history, item) {
  const updatedHistory = [item, ...history].slice(0, 8);
  localStorage.setItem(ATS_HISTORY_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
}

function getFileExtension(fileName = "") {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

function isAllowedResumeFile(file) {
  const extension = getFileExtension(file.name);
  return (
    ACCEPTED_RESUME_EXTENSIONS.includes(extension) ||
    ACCEPTED_RESUME_MIME_TYPES.includes(file.type)
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

function formatReportForClipboard(report, aiResponse) {
  if (!report) return "";

  return [
    `ATS Score: ${report.score}% (${report.level})`,
    "",
    `Matched Keywords: ${report.matchedKeywords.join(", ") || "None"}`,
    `Missing Keywords: ${report.missingKeywords.join(", ") || "None"}`,
    "",
    "Suggestions:",
    ...report.suggestions.map((suggestion) => `- ${suggestion}`),
    "",
    "Section Checklist:",
    ...report.sectionChecklist.map((section) => `- ${section.label}: ${section.present ? "Present" : "Missing"}`),
    aiResponse ? `\nAI Improved Response:\n${aiResponse}` : "",
  ].join("\n");
}

export default function ATSChecker() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [report, setReport] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(getInitialHistory);

  const persistHistory = (
    nextReport,
    nextAiResponse = aiResponse,
    nextResumeText = resumeText,
    nextJobDescription = jobDescription
  ) => {
    if (!nextReport) return;

    const item = {
      id: Date.now(),
      resumePreview: nextResumeText.slice(0, 220),
      jobDescriptionPreview: nextJobDescription.slice(0, 220),
      atsScore: nextReport.score,
      matchedKeywords: nextReport.matchedKeywords,
      missingKeywords: nextReport.missingKeywords,
      suggestions: nextReport.suggestions,
      aiResponse: nextAiResponse,
      timestamp: new Date().toISOString(),
    };

    setHistory((current) => saveHistoryItem(current, item));
  };

  const applyExtractedText = (text, successMessage) => {
    const extractedText = String(text || "");

    if (!extractedText.trim()) {
      setError("Could not extract text from resume. The file may be empty or scanned.");
      setToast({ message: "No resume text found in file", type: "error" });
      return;
    }

    setResumeText(extractedText);
    setAiResponse("");

    if (jobDescription.trim()) {
      const nextReport = calculateLocalATS(extractedText, jobDescription);
      setReport(nextReport);
      persistHistory(nextReport, "", extractedText, jobDescription);
      setToast({ message: `${successMessage}. ATS score updated`, type: "success" });
      return;
    }

    setReport(null);
    setToast({ message: successMessage, type: "success" });
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setError("");
    setReport(null);

    const extension = getFileExtension(file.name);
    if (!isAllowedResumeFile(file)) {
      setUploadedFile(null);
      setToast({ message: "Unsupported file type. Upload PDF, DOC, DOCX, or TXT.", type: "error" });
      event.target.value = "";
      return;
    }

    if (extension === "txt" || file.type === "text/plain") {
      try {
        const text = await readTextFile(file);
        applyExtractedText(text, "TXT resume uploaded successfully");
      } catch (readError) {
        setError(readError.message);
        setToast({ message: readError.message, type: "error" });
      }
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setExtracting(true);
    try {
      const response = await resumeApi.extractResume(formData);
      applyExtractedText(response.data?.text, "Resume text extracted successfully");
    } catch (uploadError) {
      const message =
        uploadError.response?.data?.error ||
        "Unable to extract resume text. Try PDF, DOC, DOCX, or TXT.";
      setError(message);
      setToast({ message, type: "error" });
    } finally {
      setExtracting(false);
    }
  };

  const handleCheck = () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please paste resume text and job description before checking ATS score.");
      setToast({ message: "Resume text and job description are required", type: "error" });
      return;
    }

    setLoading(true);
    setError("");
    window.setTimeout(() => {
      const nextReport = calculateLocalATS(resumeText, jobDescription);
      setReport(nextReport);
      setAiResponse("");
      persistHistory(nextReport, "");
      trackEvent("ATS Checked", {
        feature: "ats_checker",
        source: "local_scoring",
      });
      setToast({ message: "ATS score calculated locally", type: "success" });
      setLoading(false);
    }, 250);
  };

  const handleImproveWithAI = async () => {
    const activeReport = report || (resumeText.trim() && jobDescription.trim()
      ? calculateLocalATS(resumeText, jobDescription)
      : null);

    if (!activeReport) {
      setError("Please check ATS score before improving with AI.");
      setToast({ message: "Run ATS check first", type: "error" });
      return;
    }

    setReport(activeReport);
    setAiLoading(true);
    setError("");

    const message = [
      "Improve this resume for ATS based on the target job description.",
      "",
      `ATS Score: ${activeReport.score}`,
      `Matched Keywords: ${activeReport.matchedKeywords.join(", ")}`,
      `Missing Keywords: ${activeReport.missingKeywords.join(", ")}`,
      `Suggestions: ${activeReport.suggestions.join(" ")}`,
      "",
      "Resume:",
      resumeText,
      "",
      "Job Description:",
      jobDescription,
    ].join("\n");

    try {
      const response = await resumeApi.generateResume({
        resumeText,
        jobDescription,
        atsScore: activeReport.score,
        matchedKeywords: activeReport.matchedKeywords,
        missingKeywords: activeReport.missingKeywords,
        suggestions: activeReport.suggestions,
        template: "ATS Friendly",
        message,
      });

      const improved = response.data?.reply || response.data?.resume || response.data || "";
      setAiResponse(String(improved));
      persistHistory(activeReport, String(improved));
      setToast({ message: "AI improvement generated", type: "success" });
    } catch (apiError) {
      setToast({
        message: apiError.response?.data?.error || "Unable to improve resume with AI",
        type: "error",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyResult = async () => {
    if (!report) {
      setToast({ message: "Run ATS check before copying results", type: "error" });
      return;
    }

    try {
      await navigator.clipboard.writeText(formatReportForClipboard(report, aiResponse));
      setToast({ message: "ATS report copied to clipboard", type: "success" });
    } catch {
      setToast({ message: "Unable to copy result", type: "error" });
    }
  };

  const handleClear = () => {
    setResumeText("");
    setJobDescription("");
    setUploadedFile(null);
    setReport(null);
    setAiResponse("");
    setError("");
    setToast({ message: "ATS checker cleared", type: "success" });
  };

  return (
    <>
      <PageHeader
        eyebrow="ATS Checker"
        title="Analyze resume fit against a job description"
        description="Paste or upload resume text, compare it locally with a job description, then optionally ask AI to improve your resume."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-black text-blue-700 dark:text-cyan-200">
            <BarChartLabel />
            Local ATS scoring
          </div>
        }
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:px-8">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
                Inputs
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                Resume and Job Description
              </h2>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
              <Upload size={18} />
              {extracting ? "Extracting..." : "Upload"}
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleUpload}
                disabled={extracting}
              />
            </label>
          </div>

          {uploadedFile && (
            <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
              Selected file: {uploadedFile.name}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-2xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-700 dark:text-orange-200">
              {error}
            </div>
          )}

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Resume Text
              </span>
              <textarea
                className={textareaClass}
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
                placeholder="Paste your resume text here..."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Job Description
              </span>
              <textarea
                className={`${textareaClass} min-h-52`}
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description here..."
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={handleCheck} disabled={loading}>
                <Sparkles size={18} className={loading ? "animate-pulse" : ""} />
                {loading ? "Checking..." : "Check ATS Score"}
              </Button>
              <Button variant="secondary" onClick={handleImproveWithAI} disabled={aiLoading || !resumeText.trim()}>
                <Brain size={18} className={aiLoading ? "animate-pulse" : ""} />
                {aiLoading ? "Improving..." : "Improve Resume with AI"}
              </Button>
              <Button variant="secondary" onClick={handleCopyResult} disabled={!report}>
                <FileText size={18} />
                Copy Result
              </Button>
              <Button variant="danger" onClick={handleClear}>
                <X size={18} />
                Clear
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid content-start gap-6">
          <ATSScoreCard report={report} />

          {report && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <KeywordChips title="Matched Keywords" keywords={report.matchedKeywords} type="matched" />
                <KeywordChips title="Missing Keywords" keywords={report.missingKeywords} type="missing" />
              </div>

              <Card className="p-6" variant="solid">
                <div className="flex items-center gap-3">
                  <Target size={22} className="text-violet-500" />
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">
                    Improvement Suggestions
                  </h3>
                </div>
                <div className="mt-4 grid gap-3">
                  {report.suggestions.map((suggestion) => (
                    <p
                      key={suggestion}
                      className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:bg-white/[0.04] dark:text-slate-300"
                    >
                      {suggestion}
                    </p>
                  ))}
                </div>
              </Card>
            </>
          )}

          {aiResponse && (
            <Card className="p-6" variant="solid">
              <div className="flex items-center gap-3">
                <Brain size={22} className="text-cyan-500" />
                <h3 className="text-lg font-black text-slate-950 dark:text-white">
                  AI Improved Resume / Suggestions
                </h3>
              </div>
              <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-100 p-5 text-sm leading-7 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                {aiResponse}
              </pre>
            </Card>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="p-6">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
              Saved Checks
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              ATS History
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {history.length > 0 ? (
              history.map((item) => (
                <Card key={item.id} className="p-5" variant="solid">
                  <div className="text-3xl font-black text-blue-600 dark:text-cyan-300">
                    {item.atsScore}%
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.jobDescriptionPreview || "No job description preview"}
                  </p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-sm font-semibold text-slate-500 dark:text-slate-400" variant="solid">
                No ATS checks saved yet. Run your first ATS score to see history here.
              </Card>
            )}
          </div>
        </Card>
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

function BarChartLabel() {
  return <FileText size={16} />;
}
