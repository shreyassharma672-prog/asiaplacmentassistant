import { CheckCircle, FileText, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import Section from "../components/Section";
import TemplateCard from "../components/TemplateCard";
import { SELECTED_TEMPLATE_STORAGE_KEY } from "../utils/constants";

const TEMPLATE_DATA = [
  {
    name: "ATS Friendly",
    category: "ATS",
    preview: "Single-column parser safe",
    description: "A clean, parser-safe resume for online application systems.",
    features: ["Keyword-ready", "Simple headings", "Portal safe"],
  },
  {
    name: "Modern Fresher",
    category: "Campus",
    preview: "Education and projects first",
    description: "Designed for students with education, projects, and achievements.",
    features: ["Fresher focused", "Project space", "Achievements"],
  },
  {
    name: "Software Engineer",
    category: "Tech",
    preview: "Skills and impact layout",
    description: "Optimized for technical skills, projects, tools, and measurable impact.",
    features: ["Tech stack", "Projects", "Metrics"],
  },
  {
    name: "Internship Resume",
    category: "Internship",
    preview: "Compact early-career profile",
    description: "A sharp layout for internships, training programs, and early roles.",
    features: ["Training", "Coursework", "Potential"],
  },
  {
    name: "Professional Clean",
    category: "Professional",
    preview: "Polished recruiter scan",
    description: "A polished structure for business, operations, and general roles.",
    features: ["Balanced", "Readable", "Formal"],
  },
  {
    name: "Minimal",
    category: "Minimal",
    preview: "Lean content-first format",
    description: "A lean template that keeps attention on content and readability.",
    features: ["Concise", "Whitespace", "Fast scan"],
  },
  {
    name: "Corporate",
    category: "Corporate",
    preview: "Formal enterprise style",
    description: "A formal format for enterprise applications and professional programs.",
    features: ["Structured", "Executive", "Classic"],
  },
  {
    name: "Creative",
    category: "Creative",
    preview: "Refined visual personality",
    description: "A refined layout with controlled personality and strong section flow.",
    features: ["Distinct", "Portfolio", "Modern"],
  },
];

export default function Templates() {
  const navigate = useNavigate();

  const handleUseTemplate = (templateName) => {
    localStorage.setItem(SELECTED_TEMPLATE_STORAGE_KEY, templateName);
    navigate("/resume-builder", { state: { selectedTemplate: templateName } });
  };

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
        {TEMPLATE_DATA.map((template) => (
          <TemplateCard
            key={template.name}
            name={template.name}
            category={template.category}
            preview={template.preview}
            description={template.description}
            features={template.features}
            onSelect={() => handleUseTemplate(template.name)}
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
