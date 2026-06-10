import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

const RESUME_STORAGE_KEY = "resumeHistory";
const ATS_CHECKER_KEY = "atsHistory";
const INTERVIEW_PREP_KEY = "interviewPrepProgress";

function getStorageData(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalATSChecks: 0,
    bestAtsScore: 0,
    interviewSessions: 0,
  });
  const [recentResumes, setRecentResumes] = useState([]);
  const [recentATSChecks, setRecentATSChecks] = useState([]);
  const [interviewProgress, setInterviewProgress] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    // Load resume history
    const resumeHistory = getStorageData(RESUME_STORAGE_KEY, []);
    const atsChecksData = getStorageData(ATS_CHECKER_KEY, []);
    const interviewData = getStorageData(INTERVIEW_PREP_KEY, {});

    // Calculate stats
    const bestScore = resumeHistory.length > 0
      ? Math.max(...resumeHistory.map(r => r.atsScore || 0))
      : 0;

    setStats({
      totalResumes: resumeHistory.length,
      totalATSChecks: atsChecksData.length,
      bestAtsScore: bestScore,
      interviewSessions: Object.keys(interviewData).length,
    });

    // Set recent items
    setRecentResumes(resumeHistory.slice(0, 5));
    setRecentATSChecks(atsChecksData.slice(0, 5));

    // Interview progress
    const completed = Object.values(interviewData).filter(v => v?.completed).length;
    setInterviewProgress({
      completed,
      total: Object.keys(interviewData).length || 1,
    });
  }, []);

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/30';
    if (score >= 65) return 'bg-cyan-500/10 text-cyan-600 border-cyan-200 dark:border-cyan-900/30';
    if (score >= 45) return 'bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-900/30';
    return 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900/30';
  };

  return (
    <>
      <PageHeader
        eyebrow="Your Activity"
        title="Dashboard"
        description="Overview of your resume building, ATS checking, and interview preparation progress."
      />

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            value={stats.totalResumes}
            label="Resumes Generated"
            detail={stats.totalResumes > 0 ? "Your recent work" : "Start creating"}
          />
          <StatCard
            value={stats.totalATSChecks}
            label="ATS Checks Performed"
            detail={stats.totalATSChecks > 0 ? "Optimize further" : "Check your resume"}
          />
          <StatCard
            value={`${stats.bestAtsScore}%`}
            label="Best ATS Score"
            detail={stats.bestAtsScore >= 70 ? "Excellent match" : "Room to improve"}
          />
          <StatCard
            value={stats.interviewSessions}
            label="Interview Sessions"
            detail={stats.interviewSessions > 0 ? "Keep practicing" : "Start preparing"}
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link to="/resume-builder">
            <Button variant="primary" className="w-full" size="lg">
              Create New Resume
            </Button>
          </Link>
          <Link to="/ats-checker">
            <Button variant="primary" className="w-full" size="lg">
              Check ATS Score
            </Button>
          </Link>
          <Link to="/interview-prep">
            <Button variant="primary" className="w-full" size="lg">
              Interview Prep
            </Button>
          </Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Resumes */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
                  Recently Generated
                </p>
                <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                  Resumes
                </h3>
              </div>
              <Link to="/resume-builder" className="text-blue-600 hover:underline dark:text-cyan-300">
                View all
              </Link>
            </div>

            {recentResumes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center dark:border-white/10">
                <p className="text-slate-600 dark:text-slate-400">No resumes yet. Create your first resume!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-950 dark:text-white">
                          {resume.template}
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          {new Date(resume.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      {resume.atsScore !== undefined && (
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${getScoreBadgeColor(
                            resume.atsScore
                          )}`}
                        >
                          {resume.atsScore}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent ATS Checks */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
                  Recently Checked
                </p>
                <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                  ATS Scores
                </h3>
              </div>
              <Link to="/ats-checker" className="text-blue-600 hover:underline dark:text-cyan-300">
                View all
              </Link>
            </div>

            {recentATSChecks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center dark:border-white/10">
                <p className="text-slate-600 dark:text-slate-400">No ATS checks yet. Check your resume!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentATSChecks.map((check) => (
                  <div
                    key={check.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-950 dark:text-white">
                          ATS Check
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          {new Date(check.timestamp).toLocaleDateString()}
                        </p>
                        {check.missingKeywords && (
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                            {check.missingKeywords.length} missing keywords
                          </p>
                        )}
                      </div>
                      {check.score !== undefined && (
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${getScoreBadgeColor(
                            check.score
                          )}`}
                        >
                          {check.score}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* Interview Preparation Progress */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="p-6">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
              Interview Readiness
            </p>
            <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              Your Progress
            </h3>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-baseline justify-between">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Preparation Modules
                </p>
                <span className="text-2xl font-black text-slate-950 dark:text-white">
                  {interviewProgress.completed}/{interviewProgress.total}
                </span>
              </div>
              <div className="overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div
                  className="h-3 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                  style={{
                    width: interviewProgress.total > 0
                      ? `${(interviewProgress.completed / interviewProgress.total) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>

            <Link to="/interview-prep">
              <Button variant="primary" className="h-full w-full" size="lg">
                <Zap size={20} />
                Continue Preparation
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </>
  );
}
