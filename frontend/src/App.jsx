import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import ATSChecker from "./pages/ATSChecker";
import Analyzer from "./pages/Analyzer";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Templates from "./pages/Templates";
import InterviewPrep from "./pages/InterviewPrep";
import About from "./pages/About";
import History from "./pages/History";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.22),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_44%,#f8fafc_44%,#f8fafc_100%)] opacity-0 dark:opacity-100" />
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_28%)] dark:hidden" />

          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/ats-checker" element={<ATSChecker />} />
              <Route path="/analyzer" element={<Analyzer />} />
              <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/interview-prep" element={<InterviewPrep />} />
              <Route path="/about" element={<About />} />
              <Route path="/history" element={<History />} />
              <Route path="/builder" element={<Navigate to="/resume-builder" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
