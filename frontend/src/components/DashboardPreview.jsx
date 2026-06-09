import { BarChart3, Brain, CheckCircle, Target } from "lucide-react";
import Card from "./Card";
import ReportMetric from "./ReportMetric";

export default function DashboardPreview() {
  const keywords = ["React", "JavaScript", "APIs", "Projects", "Git"];
  const missing = ["Testing", "System Design"];

  return (
    <Card className="relative overflow-hidden p-6" variant="gradient">
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-200">Live ATS Report</p>
            <h3 className="mt-1 text-2xl font-black tracking-tight">Resume Health</h3>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-cyan-200">
            <BarChart3 size={24} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
          <div className="grid place-items-center rounded-3xl border border-white/10 bg-white/10 p-5">
            <div className="grid h-28 w-28 place-items-center rounded-full border-8 border-cyan-300 bg-slate-950/70">
              <div className="text-center">
                <div className="text-3xl font-black">91%</div>
                <div className="text-xs font-bold text-cyan-200">ATS Score</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ReportMetric label="Keyword Match" value="87%" percent={87} tone="cyan" contrast="inverse" />
            <ReportMetric label="Resume Strength" value="Excellent" percent={92} tone="blue" contrast="inverse" />
            <ReportMetric label="Skill Coverage" value="78%" percent={78} tone="violet" contrast="inverse" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-cyan-200">
              <CheckCircle size={16} />
              Matched Keywords
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-bold text-cyan-100"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-violet-200">
              <Target size={16} />
              Missing Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {missing.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-violet-300/15 px-3 py-1 text-xs font-bold text-violet-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200">
          <Brain size={20} className="text-cyan-200" />
          AI suggests adding measurable project outcomes and two missing role keywords.
        </div>
      </div>
    </Card>
  );
}
