import { BarChart3, Brain, CheckCircle, FileText, Sparkles, Target } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import ReportMetric from "../components/ReportMetric";
import Section from "../components/Section";

const categories = [
  {
    icon: Brain,
    title: "HR Questions",
    detail: "Tell me about yourself, strengths, weaknesses, goals, and behavioral answers.",
  },
  {
    icon: FileText,
    title: "Resume Deep Dive",
    detail: "Prepare explanations for projects, internships, skills, and achievements.",
  },
  {
    icon: Target,
    title: "Role Alignment",
    detail: "Connect your resume keywords to the job role and company expectations.",
  },
  {
    icon: BarChart3,
    title: "Mock Readiness",
    detail: "Track confidence, structure, clarity, and examples before interviews.",
  },
];

const checklist = [
  "Prepare a 60-second introduction",
  "Write STAR answers for two projects",
  "Revise core technical skills",
  "Map resume points to target role",
  "Prepare questions for the interviewer",
];

export default function InterviewPrep() {
  return (
    <>
      <PageHeader
        eyebrow="Interview Prep"
        title="Turn your resume into confident interview answers"
        description="Use structured prompts, STAR answer planning, and role-focused practice blocks to prepare for placement interviews."
        actions={
          <Button to="/resume-builder">
            <Sparkles size={18} />
            Build Resume First
          </Button>
        }
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.title} className="p-6" variant="interactive">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
                  <Icon size={24} />
                </div>
                <h2 className="mt-6 text-xl font-black text-slate-950 dark:text-white">
                  {category.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {category.detail}
                </p>
              </Card>
            );
          })}
        </div>

        <Card className="h-fit p-6" variant="gradient">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
            Readiness Score
          </p>
          <h2 className="mt-3 text-3xl font-black">Interview Dashboard</h2>
          <div className="mt-6 space-y-5">
            <ReportMetric label="Resume Confidence" value="88%" percent={88} tone="cyan" contrast="inverse" />
            <ReportMetric label="Project Clarity" value="82%" percent={82} tone="blue" contrast="inverse" />
            <ReportMetric label="HR Readiness" value="76%" percent={76} tone="violet" contrast="inverse" />
          </div>
        </Card>
      </section>

      <Section
        eyebrow="Placement Checklist"
        title="A focused routine before every interview"
        description="Small preparation loops make your answers cleaner, more specific, and easier to remember."
      >
        <div className="grid gap-4 md:grid-cols-5">
          {checklist.map((item, index) => (
            <Card key={item} className="p-5" variant="interactive">
              <CheckCircle size={22} className="text-cyan-500" />
              <div className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">
                Step {index + 1}
              </div>
              <h3 className="mt-2 text-base font-black text-slate-950 dark:text-white">
                {item}
              </h3>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
