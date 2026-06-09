import {
  BarChart3,
  Brain,
  CheckCircle,
  Download,
  FileText,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import DashboardPreview from "../components/DashboardPreview";
import FeatureCard from "../components/FeatureCard";
import ReportMetric from "../components/ReportMetric";
import Section from "../components/Section";
import StatCard from "../components/StatCard";
import TemplateCard from "../components/TemplateCard";

const stats = [
  { value: "50K+", label: "Resumes Generated", detail: "Structured for campus and fresher hiring workflows." },
  { value: "10K+", label: "ATS Checks", detail: "Keyword matching against real job descriptions." },
  { value: "95%", label: "Optimization Accuracy", detail: "Actionable signals for better shortlisting odds." },
  { value: "24/7", label: "AI Assistance", detail: "Always-on help for resume and interview prep." },
];

const features = [
  {
    icon: FileText,
    title: "AI Resume Builder",
    description: "Generate polished resumes from your profile, projects, skills, and target job description.",
  },
  {
    icon: BarChart3,
    title: "ATS Score Checker",
    description: "Compare your resume with a role description and uncover keyword match gaps instantly.",
  },
  {
    icon: Brain,
    title: "Resume Analyzer",
    description: "Audit completeness, structure, missing sections, and content quality before applying.",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description: "See which skills, tools, and keywords should be added for your target role.",
  },
  {
    icon: Sparkles,
    title: "Multiple Templates",
    description: "Choose from modern, fresher-friendly, technical, and professional resume layouts.",
  },
  {
    icon: Download,
    title: "Export PDF/DOCX/TXT",
    description: "Download your final resume in recruiter-friendly formats without leaving the platform.",
  },
];

const steps = [
  "Enter or Upload Resume",
  "AI Analyzes Resume",
  "Get ATS Score",
  "Improve Missing Keywords",
  "Download Final Resume",
];

const templates = [
  {
    title: "Modern",
    description: "A crisp profile-first layout with strong visual hierarchy.",
    tags: ["Freshers", "Projects"],
  },
  {
    title: "Professional",
    description: "A clean recruiter-ready format for broad applications.",
    tags: ["ATS", "Corporate"],
  },
  {
    title: "Software Engineer",
    description: "Built around skills, projects, tooling, and measurable impact.",
    tags: ["Tech", "GitHub"],
  },
  {
    title: "Fresher",
    description: "Education, internship, projects, and achievements balanced cleanly.",
    tags: ["Campus", "Entry Level"],
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur dark:text-cyan-200">
            <Sparkles size={16} />
            AI-powered placement workspace
          </div>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            Build ATS-Optimized Resumes & Get Placement Ready with AI
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Create professional resumes, check ATS scores, analyze skill gaps,
            improve missing keywords, and prepare for interviews from one
            premium AI platform.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/resume-builder" size="lg">
              <FileText size={20} />
              Build My Resume
            </Button>
            <Button to="/ats-checker" variant="secondary" size="lg">
              <BarChart3 size={20} />
              Check ATS Score
            </Button>
          </div>
        </div>

        <DashboardPreview />
      </section>

      <Section className="pt-2">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Core Features"
        title="Everything you need to become placement-ready"
        description="The product is structured around the complete resume workflow: create, analyze, optimize, export, and prepare."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="How It Works"
        title="From raw resume to recruiter-ready in minutes"
        description="Each step is designed to turn unclear resume content into measurable, ATS-friendly application material."
      >
        <div className="grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <Card key={step} className="p-5" variant="interactive">
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white dark:bg-white dark:text-slate-950">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
                {step}
              </h3>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Template Preview"
        title="Resume layouts that look sharp and stay ATS-safe"
        description="Use clean structure, strong spacing, and role-specific emphasis without sacrificing parser readability."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <TemplateCard key={template.title} {...template} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="ATS Report Demo"
        title="A clear dashboard for every resume decision"
        description="See the score, keyword match, missing terms, suggestions, and overall resume quality in one view."
      >
        <Card className="grid gap-8 p-6 lg:grid-cols-[0.9fr_1.1fr]" variant="glass">
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-cyan-200">Overall ATS Score</p>
                <div className="mt-2 text-6xl font-black">91%</div>
              </div>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10">
                <Target size={28} />
              </div>
            </div>
            <div className="mt-8 space-y-5">
              <ReportMetric label="Keyword Match" value="88%" percent={88} tone="cyan" contrast="inverse" />
              <ReportMetric label="Resume Quality" value="A Grade" percent={92} tone="blue" contrast="inverse" />
              <ReportMetric label="Skill Coverage" value="81%" percent={81} tone="violet" contrast="inverse" />
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="p-5" variant="solid">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-cyan-500" />
                <h3 className="font-extrabold text-slate-950 dark:text-white">Matched Keywords</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["React", "REST API", "JavaScript", "MongoDB", "Projects"].map((item) => (
                  <span key={item} className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-700 dark:text-cyan-200">
                    {item}
                  </span>
                ))}
              </div>
            </Card>
            <Card className="p-5" variant="solid">
              <div className="flex items-center gap-3">
                <Target size={20} className="text-violet-500" />
                <h3 className="font-extrabold text-slate-950 dark:text-white">Suggestions</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Add testing keywords, quantify project outcomes, and include a
                concise technical summary aligned to the target role.
              </p>
            </Card>
          </div>
        </Card>
      </Section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="overflow-hidden p-8 sm:p-10" variant="gradient">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
                Final Step
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Ready to build your placement-ready resume?
              </h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                Start from scratch or upload an existing resume and let the AI
                guide your next improvement.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/resume-builder" size="lg">
                <Sparkles size={20} />
                Start Now
              </Button>
              <Button to="/ats-checker" variant="secondary" size="lg">
                <Upload size={20} />
                Upload Resume
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
