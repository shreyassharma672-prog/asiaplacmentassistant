import { FileText, X } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

function getHistory() {
  try {
    const saved = localStorage.getItem("resumeHistory");
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function History() {
  const history = getHistory();

  const clearHistory = () => {
    localStorage.removeItem("resumeHistory");
    window.location.assign("/resume-builder");
  };

  return (
    <>
      <PageHeader
        eyebrow="Resume History"
        title="Your generated resumes"
        description="This legacy route remains available for saved resume review. The main history panel now lives inside Resume Builder."
        actions={
          history.length > 0 && (
            <Button variant="danger" onClick={clearHistory}>
              <X size={18} />
              Clear History
            </Button>
          )
        }
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {history.length === 0 ? (
          <Card className="grid min-h-80 place-items-center p-8 text-center">
            <div>
              <FileText size={44} className="mx-auto text-slate-400" />
              <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
                No Resume History Found
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                Generate your first AI resume to see saved versions here.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {history.map((item, index) => {
              const resumeText =
                typeof item === "string"
                  ? item
                  : item.resume || item.reply || item.content || JSON.stringify(item, null, 2);

              return (
                <Card key={item.id || index} className="p-6">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-white">
                      <FileText size={22} />
                    </div>
                    <div>
                      <h2 className="font-black text-slate-950 dark:text-white">
                        {item.name || `Resume ${history.length - index}`}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.template || "Saved resume"}
                      </p>
                    </div>
                  </div>
                  <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-100 p-5 text-sm leading-7 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    {resumeText}
                  </pre>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
