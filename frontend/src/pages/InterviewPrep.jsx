import { useEffect, useState } from "react";
import { Brain, FileText, Sparkles, Target } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import InterviewCategoryTabs from "../components/InterviewCategoryTabs";
import MockInterview from "../components/MockInterview";
import PageHeader from "../components/PageHeader";
import PlacementChecklist from "../components/PlacementChecklist";
import QuestionCard from "../components/QuestionCard";
import StarMethodCard from "../components/StarMethodCard";
import Toast from "../components/Toast";
import { resumeApi } from "../api/axiosConfig";
import {
  checklistItems,
  hrQuestions,
  mockRoles,
  starExample,
  technicalCategories,
} from "../data/interviewPrepData";
import { trackEvent } from "../utils/analytics";

export default function InterviewPrep() {
  const technicalCategoryNames = Object.keys(technicalCategories);
  const roleNames = Object.keys(mockRoles);
  const [activeTechCategory, setActiveTechCategory] = useState(technicalCategoryNames[0]);
  const [aiTopic, setAiTopic] = useState(roleNames[0]);
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    trackEvent("Interview Prep Opened", {
      feature: "interview_prep",
    });
  }, []);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: "Answer copied to clipboard", type: "success" });
    } catch {
      setToast({ message: "Unable to copy answer", type: "error" });
    }
  };

  const handleGenerateAIQuestions = async () => {
    const message = `Generate 10 interview questions with short answers for ${aiTopic}.`;

    setAiLoading(true);
    setAiResponse("");
    try {
      const response = await resumeApi.generateResume({
        message,
        template: "Interview Prep",
        jobDescription: "",
      });
      const text = response.data?.reply || response.data?.resume || response.data || "";
      setAiResponse(String(text));
      setToast({ message: "AI interview questions generated", type: "success" });
    } catch (error) {
      setToast({
        message: error.response?.data?.error || "Unable to generate AI questions",
        type: "error",
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Interview Prep"
        title="Practice HR, technical, and mock interviews in one place"
        description="Prepare real answers, revise technical fundamentals, practice role-based mock interviews, and keep your placement checklist on track."
        actions={
          <Button to="/resume-builder">
            <Sparkles size={18} />
            Build Resume First
          </Button>
        }
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["HR Bank", "8 common questions with sample answers and tips.", Brain],
            ["Technical Prep", "Category-wise questions for software and ECE basics.", FileText],
            ["Mock Flow", "Practice one question at a time with feedback.", Target],
          ].map(([title, detail, Icon]) => (
            <Card key={title} className="p-6" variant="interactive">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
                <Icon size={24} />
              </div>
              <h2 className="mt-6 text-xl font-black text-slate-950 dark:text-white">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {detail}
              </p>
            </Card>
          ))}
        </div>

        <Card className="h-fit p-6" variant="gradient">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
            AI Interview Help
          </p>
          <h2 className="mt-3 text-3xl font-black">Generate focused questions</h2>
          <label className="mt-6 grid gap-2">
            <span className="text-sm font-bold text-slate-200">Role or category</span>
            <select
              value={aiTopic}
              onChange={(event) => setAiTopic(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300"
            >
              {[...roleNames, ...technicalCategoryNames].map((item) => (
                <option key={item} value={item} className="bg-slate-900">
                  {item}
                </option>
              ))}
            </select>
          </label>
          <Button
            type="button"
            onClick={handleGenerateAIQuestions}
            disabled={aiLoading}
            className="mt-4 w-full"
          >
            <Sparkles size={18} className={aiLoading ? "animate-pulse" : ""} />
            {aiLoading ? "Generating..." : "Generate AI Interview Questions"}
          </Button>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
            HR Questions
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Common HR answers you can practice and personalize
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {hrQuestions.map((item) => (
            <QuestionCard
              key={item.question}
              question={item.question}
              answer={item.answer}
              tips={item.tips}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
            Technical Questions
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Switch categories and revise short technical answers
          </h2>
        </div>

        <InterviewCategoryTabs
          categories={technicalCategoryNames}
          activeCategory={activeTechCategory}
          onChange={setActiveTechCategory}
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {technicalCategories[activeTechCategory].map((item) => (
            <Card key={item.question} className="p-5" variant="interactive">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
                {activeTechCategory}
              </p>
              <h3 className="mt-3 text-lg font-black text-slate-950 dark:text-white">
                {item.question}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {item.answer}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <MockInterview roles={mockRoles} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <StarMethodCard example={starExample} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <PlacementChecklist items={checklistItems} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="p-6" variant="solid">
          <div className="flex items-center gap-3">
            <Brain size={22} className="text-cyan-500" />
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
              AI Generated Questions
            </h2>
          </div>
          {aiResponse ? (
            <pre className="mt-5 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-100 p-5 text-sm leading-7 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
              {aiResponse}
            </pre>
          ) : (
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Choose a role or category above and generate AI interview questions
              when you want extra practice.
            </p>
          )}
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
