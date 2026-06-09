import { useState } from "react";
import { CheckCircle, FileText, Sparkles, X } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import ExportActions from "../components/ExportActions";
import PageHeader from "../components/PageHeader";
import ResumeForm from "../components/ResumeForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import Toast from "../components/Toast";
import { resumeApi } from "../api/axiosConfig";
import { downloadAsText, exportToDOCX, exportToPDF } from "../utils/exporters";
import { RESUME_TEMPLATES } from "../utils/constants";

const RESUME_STORAGE_KEY = "resumeHistory";
const TEMPLATE_OPTIONS = RESUME_TEMPLATES.filter((template) =>
  [
    "ATS Friendly",
    "Modern Fresher",
    "Software Engineer",
    "Internship Resume",
    "Professional Clean",
  ].includes(template)
);

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  education: "",
  skills: "",
  projects: "",
  experience: "",
  achievements: "",
  certifications: "",
};

function getInitialHistory() {
  try {
    const saved = localStorage.getItem(RESUME_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function hasFormContent(formData) {
  return Object.values(formData).some((value) => String(value).trim());
}

function serializeFormData(formData) {
  return Object.entries(formData)
    .filter(([, value]) => String(value).trim())
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function getResumeText(data) {
  if (typeof data === "string") return data;
  return data?.reply || data?.resume || "";
}

export default function ResumeBuilder() {
  const [formData, setFormData] = useState(initialFormData);
  const [template, setTemplate] = useState("ATS Friendly");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedResume, setGeneratedResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [history, setHistory] = useState(getInitialHistory);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) setProfilePhoto(URL.createObjectURL(file));
  };

  const saveHistory = (resumeText) => {
    const item = {
      id: Date.now(),
      resume: resumeText,
      generatedResume: resumeText,
      template,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleString(),
      formData,
      jobDescription,
    };

    const updatedHistory = [item, ...history].slice(0, 6);
    setHistory(updatedHistory);
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const handleGenerate = async () => {
    if (!hasFormContent(formData)) {
      setToast({ message: "Please enter at least one resume detail first", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await resumeApi.generateResume({
        formData,
        template,
        jobDescription,
        message: serializeFormData(formData),
      });

      const resumeText = getResumeText(response.data);
      if (!resumeText.trim()) {
        throw new Error("Backend returned an empty resume");
      }

      setGeneratedResume(resumeText);
      saveHistory(resumeText);
      setToast({ message: "Resume generated and saved", type: "success" });
    } catch (error) {
      setToast({
        message: error.response?.data?.error || error.message || "Error generating resume",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedResume) return;

    try {
      await navigator.clipboard.writeText(generatedResume);
      setToast({ message: "Resume copied to clipboard", type: "success" });
    } catch {
      setToast({ message: "Unable to copy resume", type: "error" });
    }
  };

  const handleExport = async (format) => {
    if (!generatedResume) return;

    try {
      if (format === "pdf") await exportToPDF("resume-preview", "resume.pdf");
      else if (format === "docx") exportToDOCX(generatedResume, "resume.docx");
      else downloadAsText(generatedResume, "resume.txt");

      setToast({ message: `Resume exported as ${format.toUpperCase()}`, type: "success" });
    } catch {
      setToast({ message: "Error exporting resume", type: "error" });
    }
  };

  const loadHistory = (item) => {
    const resumeText = item.resume || item.generatedResume || "";
    setGeneratedResume(resumeText);
    setTemplate(item.template || "ATS Friendly");
    if (item.formData) setFormData({ ...initialFormData, ...item.formData });
    if (typeof item.jobDescription === "string") setJobDescription(item.jobDescription);
    setToast({ message: "Resume loaded from history", type: "success" });
  };

  const deleteHistory = (id) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(updatedHistory));
    setToast({ message: "Resume deleted", type: "success" });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(RESUME_STORAGE_KEY);
    setToast({ message: "Resume history cleared", type: "success" });
  };

  return (
    <>
      <PageHeader
        eyebrow="AI Resume Builder"
        title="Create and export a placement-ready resume"
        description="Enter your details manually, choose a template, generate an AI-powered resume, preview it live, save it to history, and export it."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-black text-blue-700 dark:text-cyan-200">
            <Sparkles size={16} />
            AI-powered builder
          </div>
        }
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 sm:px-6 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:px-8">
        <div className="grid gap-6">
          <ResumeForm
            formData={formData}
            jobDescription={jobDescription}
            profilePhoto={profilePhoto}
            onChange={handleChange}
            onJobDescriptionChange={(event) => setJobDescription(event.target.value)}
            onPhotoUpload={handlePhotoUpload}
          />

          <TemplateSelector
            templates={TEMPLATE_OPTIONS}
            selectedTemplate={template}
            onSelect={setTemplate}
          />
        </div>

        <div className="grid content-start gap-6">
          <ResumePreview
            generatedResume={generatedResume}
            formData={formData}
            template={template}
            jobDescription={jobDescription}
            profilePhoto={profilePhoto}
          />

          <ExportActions
            hasResume={Boolean(generatedResume)}
            loading={loading}
            onGenerate={handleGenerate}
            onCopy={handleCopy}
            onExport={handleExport}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
                Saved Resumes
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                Resume History
              </h2>
            </div>
            {history.length > 0 && (
              <Button variant="danger" size="sm" onClick={clearHistory}>
                <X size={16} />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {history.length > 0 ? (
              history.map((item) => (
                <Card key={item.id} className="p-5" variant="solid">
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-white">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-black text-slate-950 dark:text-white">
                        {item.formData?.name || formData.name || "Generated Resume"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {item.template} - {item.date || new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => loadHistory(item)}>
                      <CheckCircle size={16} />
                      Load
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => deleteHistory(item.id)}>
                      <X size={16} />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-sm font-semibold text-slate-500 dark:text-slate-400" variant="solid">
                No saved resumes yet. Generate your first AI resume to see history here.
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
