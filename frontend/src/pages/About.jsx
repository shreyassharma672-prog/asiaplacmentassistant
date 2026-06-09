import { BarChart3, Brain, CheckCircle, Download, FileText, Sparkles, Target } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import FeatureCard from "../components/FeatureCard";
import PageHeader from "../components/PageHeader";
import Section from "../components/Section";

const capabilities = [
  {
    icon: FileText,
    title: "AI Resume Generation",
    description: "Transforms student profile details into structured professional resume content.",
  },
  {
    icon: BarChart3,
    title: "ATS Scoring",
    description: "Compares resume content with job descriptions and reports keyword gaps.",
  },
  {
    icon: Brain,
    title: "Resume Analysis",
    description: "Checks section completeness, structure, and quality signals before applying.",
  },
  {
    icon: Download,
    title: "Export Workflow",
    description: "Keeps final resumes portable through PDF, DOCX, and TXT export options.",
  },
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Project"
        title="AI Placement Assistant is built for smarter campus preparation"
        description="A professional resume builder and ATS checker platform that helps students turn raw details into polished, placement-ready applications."
        actions={
          <>
            <Button to="/resume-builder">
              <Sparkles size={18} />
              Try Project
            </Button>
            <Button to="/ats-checker" variant="secondary">
              <Target size={18} />
              Check ATS
            </Button>
          </>
        }
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <Card className="p-8" variant="gradient">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
            Mission
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
            Make resume preparation faster, clearer, and more placement-focused.
          </h2>
          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            The platform combines AI resume writing, ATS keyword analysis,
            completeness checks, templates, exports, and interview preparation
            into a single polished product experience.
          </p>
        </Card>

        <Card className="p-8">
          <h3 className="text-2xl font-black text-slate-950 dark:text-white">
            Portfolio-Ready Stack
          </h3>
          <div className="mt-6 grid gap-3">
            {["React + Vite", "Tailwind CSS", "React Router", "Context API", "Node.js + Express", "AI API integration"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                <CheckCircle size={18} className="text-cyan-500" />
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Section
        eyebrow="Capabilities"
        title="A complete resume preparation workflow"
        description="Each capability maps to a real placement task: build, optimize, analyze, export, and prepare."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability) => (
            <FeatureCard key={capability.title} {...capability} />
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="p-8" variant="glass">
          <div className="grid gap-6 md:grid-cols-4">
            {[
              ["01", "Enter Details"],
              ["02", "Generate Resume"],
              ["03", "Check ATS Score"],
              ["04", "Export and Prepare"],
            ].map(([number, label]) => (
              <div key={number} className="rounded-3xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <div className="text-3xl font-black text-blue-600 dark:text-cyan-300">
                  {number}
                </div>
                <div className="mt-3 font-black text-slate-950 dark:text-white">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}
