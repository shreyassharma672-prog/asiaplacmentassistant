import Card from "./Card";

export default function ATSScoreCard({ report }) {
  if (!report || typeof report !== "object") return null;

  const score = Number(report.score) || 0;

  const matchedKeywords = Array.isArray(report.matchedKeywords)
    ? report.matchedKeywords
    : [];

  const missingKeywords = Array.isArray(report.missingKeywords)
    ? report.missingKeywords
    : [];

  const recommendation =
    typeof report.recommendation === "string"
      ? report.recommendation
      : "Add more job-specific keywords, measurable achievements, and relevant skills.";

  return (
    <Card className="p-6">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
        ATS Analysis
      </p>

      <h2 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">
        {score}%
      </h2>

      <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
        Resume ATS compatibility score
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <h3 className="font-black text-green-800">Matched Keywords</h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map((keyword, index) => (
                <span
                  key={`${keyword}-${index}`}
                  className="rounded-full bg-white px-3 py-1 text-xs font-bold text-green-700"
                >
                  {String(keyword)}
                </span>
              ))
            ) : (
              <p className="text-sm font-semibold text-green-700">
                No matched keywords found.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <h3 className="font-black text-red-800">Missing Keywords</h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((keyword, index) => (
                <span
                  key={`${keyword}-${index}`}
                  className="rounded-full bg-white px-3 py-1 text-xs font-bold text-red-700"
                >
                  {String(keyword)}
                </span>
              ))
            ) : (
              <p className="text-sm font-semibold text-red-700">
                No missing keywords found.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-700">
        {recommendation}
      </div>
    </Card>
  );
}