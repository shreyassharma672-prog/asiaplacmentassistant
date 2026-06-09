import { CheckCircle, FileText, Sparkles } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import Section from "../components/Section";
import TemplateCard from "../components/TemplateCard";
import { RESUME_TEMPLATES } from "../utils/constants";

const descriptions = {
  "ATS Friendly": "A clean, parser-safe resume for online application systems.",
  "Modern Fresher": "Designed for students with education, projects, and achievements.",
  "Software Engineer": "Optimized for technical skills, projects, tools, and measurable impact.",
  "Internship Resume": "A sharp layout for internships, training programs, and early roles.",
  "Professional Clean": "A polished structure for business, operations, and general roles.",
  Minimal: "A lean template that keeps attention on content and readability.",
  Corporate: "A formal format for enterprise applications and professional programs.",
  Creative: "A refined layout with controlled personality and strong section flow.",
};

export default function Templates() {
  return (
    <>
      <PageHeader
        eyebrow="Resume Templates"
        title="Choose a resume style built for placement workflows"
        description="Every template keeps the content readable for recruiters while staying structured enough for ATS parsing."
        actions={
          <Button to="/resume-builder">
            <Sparkles size={18} />
            Build With Template
          </Button>
        }
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {RESUME_TEMPLATES.map((template) => (
          <TemplateCard
            key={template}
            title={template}
            description={descriptions[template]}
            tags={template.includes("Engineer") ? ["Tech", "Projects"] : ["ATS-safe", "Clean"]}
          />
        ))}
      </section>

      <Section
        eyebrow="Why These Templates"
        title="Premium visual polish without breaking ATS readability"
        description="The layout system is intentionally restrained: strong spacing, clear sections, recruiter-first hierarchy, and export-friendly structure."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            "Readable section hierarchy",
            "Balanced spacing for scanning",
            "Works with PDF, DOCX, and TXT exports",
          ].map((item) => (
            <Card key={item} className="p-6" variant="interactive">
              <CheckCircle size={24} className="text-cyan-500" />
              <h3 className="mt-5 text-lg font-black text-slate-950 dark:text-white">
                {item}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Built for the realities of campus applications, recruiter review,
                and applicant tracking systems.
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="grid items-center gap-6 p-8 lg:grid-cols-[1fr_auto]" variant="gradient">
          <div>
            <div className="flex items-center gap-3 text-cyan-200">
              <FileText size={22} />
              <span className="text-sm font-black uppercase tracking-[0.22em]">
                Template Studio
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
              Pick a template, then let AI shape the content.
            </h2>
          </div>
          <Button to="/resume-builder" size="lg">
            <Sparkles size={20} />
            Start Building
          </Button>
        </Card>
      </section>
    </>
  );
}
