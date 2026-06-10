import { useMemo, useState } from "react";
import { Brain, CheckCircle, Target } from "lucide-react";
import Button from "./Button";
import Card from "./Card";

export default function MockInterview({ roles }) {
  const roleNames = Object.keys(roles);
  const [selectedRole, setSelectedRole] = useState(roleNames[0]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = roles[selectedRole] || [];
  const attempted = useMemo(
    () => Object.values(answers).filter((answer) => answer.trim()).length,
    [answers]
  );

  const startInterview = () => {
    setStarted(true);
    setFinished(false);
    setCurrentIndex(0);
    setAnswers({});
  };

  const finishInterview = () => {
    setFinished(true);
    setStarted(false);
  };

  const averageLength = attempted
    ? Math.round(
        Object.values(answers).reduce((sum, answer) => sum + answer.trim().length, 0) /
          attempted
      )
    : 0;

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
            Mock Interview
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            Practice one question at a time
          </h2>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-white">
          <Brain size={22} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <div>
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Select Role
            </span>
            <select
              value={selectedRole}
              onChange={(event) => {
                setSelectedRole(event.target.value);
                setStarted(false);
                setFinished(false);
                setCurrentIndex(0);
                setAnswers({});
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-bold text-slate-950 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
            >
              {roleNames.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <Button type="button" onClick={startInterview} className="mt-4 w-full">
            <Target size={18} />
            Start Mock Interview
          </Button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
          {started ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-700 dark:text-cyan-200">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {selectedRole}
                </span>
              </div>
              <h3 className="text-xl font-black leading-snug text-slate-950 dark:text-white">
                {questions[currentIndex]}
              </h3>
              <textarea
                value={answers[currentIndex] || ""}
                onChange={(event) =>
                  setAnswers((current) => ({
                    ...current,
                    [currentIndex]: event.target.value,
                  }))
                }
                placeholder="Type your answer here..."
                className="mt-5 min-h-40 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-950 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                >
                  Previous Question
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={currentIndex === questions.length - 1}
                  onClick={() =>
                    setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))
                  }
                >
                  Next Question
                </Button>
                <Button type="button" onClick={finishInterview}>
                  Finish Interview
                </Button>
              </div>
            </>
          ) : finished ? (
            <div>
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-emerald-500" />
                <h3 className="text-xl font-black text-slate-950 dark:text-white">
                  Mock Interview Feedback
                </h3>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 dark:bg-slate-950">
                  <div className="text-2xl font-black text-blue-600 dark:text-cyan-300">
                    {attempted}/{questions.length}
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                    Attempted
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 dark:bg-slate-950">
                  <div className="text-2xl font-black text-blue-600 dark:text-cyan-300">
                    {averageLength}
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                    Avg. characters
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 dark:bg-slate-950">
                  <div className="text-2xl font-black text-blue-600 dark:text-cyan-300">
                    {attempted >= Math.ceil(questions.length * 0.8) ? "Good" : "Practice"}
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                    Readiness
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p>Use specific examples from projects, internships, or coursework.</p>
                <p>Improve answers by adding situation, action, result, and measurable impact.</p>
                <p>Revise weak areas where answers were short, vague, or missing examples.</p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-60 place-items-center text-center">
              <div>
                <Target size={36} className="mx-auto text-blue-500 dark:text-cyan-300" />
                <h3 className="mt-4 text-xl font-black text-slate-950 dark:text-white">
                  Select a role and start practicing.
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  You will answer one question at a time and receive simple feedback at the end.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
