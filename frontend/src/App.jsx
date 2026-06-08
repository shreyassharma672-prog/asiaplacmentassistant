import { useState } from "react";
import "./App.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

function App() {
  const [mode, setMode] = useState("checker");
  const [reply, setReply] = useState("");
  const [template, setTemplate] = useState("ATS Friendly");
  const [jobDescription, setJobDescription] = useState("");
  const [atsData, setAtsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [existingResume, setExistingResume] = useState("");
  const [uploadedResumeName, setUploadedResumeName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    skills: "",
    projects: "",
    experience: "",
    achievements: "",
  });

  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("resumeHistory")) || []
  );

  const templates = [
    "ATS Friendly",
    "Modern Fresher",
    "Software Engineer",
    "Internship Resume",
    "Professional Clean",
    "Minimal",
    "Corporate",
    "Creative",
  ];

  const importantSkills = [
    "html", "css", "javascript", "react", "node", "express", "python",
    "java", "c++", "sql", "mysql", "mongodb", "git", "github", "api",
    "testing", "debugging", "dsa", "data structures", "algorithms",
    "communication", "teamwork", "problem solving", "machine learning", "ai",
  ];

  const stopWords = [
    "with", "this", "that", "from", "your", "have", "will", "work",
    "role", "good", "basic", "looking", "candidate", "knowledge",
    "skills", "ability", "responsibilities", "requirements", "preferred",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePhoto(URL.createObjectURL(file));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedResumeName(file.name);

    if (file.type === "text/plain") {
      const text = await file.text();
      setExistingResume(text);
    } else {
      alert("Currently direct reading supports only .txt. Paste PDF/DOCX text manually.");
    }
  };

  const calculateLocalATS = (resumeText, jdText) => {
    if (!resumeText || !jdText.trim()) return null;

    const resumeLower = resumeText.toLowerCase();
    const jdLower = jdText.toLowerCase();

    const jdWords = jdLower
      .replace(/[^\w\s+#]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.includes(word));

    const jdSkillKeywords = importantSkills.filter((skill) =>
      jdLower.includes(skill)
    );

    const uniqueKeywords = [...new Set([...jdWords, ...jdSkillKeywords])];

    const matchedKeywords = uniqueKeywords.filter((word) =>
      resumeLower.includes(word)
    );

    const missingKeywords = uniqueKeywords.filter(
      (word) => !resumeLower.includes(word)
    );

    const keywordScore =
      uniqueKeywords.length > 0
        ? Math.round((matchedKeywords.length / uniqueKeywords.length) * 70)
        : 0;

    let sectionScore = 0;

    if (resumeLower.includes("education")) sectionScore += 5;
    if (resumeLower.includes("skills")) sectionScore += 5;
    if (resumeLower.includes("projects")) sectionScore += 5;
    if (resumeLower.includes("experience")) sectionScore += 5;
    if (
      resumeLower.includes("achievement") ||
      resumeLower.includes("certification")
    )
      sectionScore += 5;

    if (resumeLower.includes("email") || formData.email) sectionScore += 3;
    if (resumeLower.includes("phone") || formData.phone) sectionScore += 2;

    const finalScore = Math.min(keywordScore + sectionScore, 100);

    let level = "";
    let recommendation = "";

    if (finalScore >= 80) {
      level = "Excellent";
      recommendation = "Your resume is strongly aligned with this job.";
    } else if (finalScore >= 65) {
      level = "Good";
      recommendation = "Good resume. Add more job-specific keywords.";
    } else if (finalScore >= 45) {
      level = "Average";
      recommendation = "Resume needs improvement for this job description.";
    } else {
      level = "Low";
      recommendation = "Resume needs stronger skills, tools, and keywords.";
    }

    const suggestions = [];

    if (missingKeywords.length > 0) {
      suggestions.push(
        `Add missing keywords like ${missingKeywords.slice(0, 5).join(", ")}.`
      );
    }

    if (!resumeLower.includes("project")) {
      suggestions.push("Add 1-2 strong projects with technologies used.");
    }

    if (!resumeLower.includes("github")) {
      suggestions.push("Add GitHub link if your project code is uploaded.");
    }

    if (!resumeLower.includes("problem")) {
      suggestions.push("Add problem-solving or DSA related keywords.");
    }

    return {
      score: finalScore,
      level,
      matchedKeywords: matchedKeywords.slice(0, 12),
      missingKeywords: missingKeywords.slice(0, 12),
      recommendation,
      suggestions,
    };
  };

  const saveHistory = (item) => {
    const updatedHistory = [item, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("resumeHistory", JSON.stringify(updatedHistory));
  };

  const generateResume = async () => {
    if (!formData.name.trim()) {
      alert("Please enter your name first");
      return;
    }

    setLoading(true);
    setReply("");
    setAtsData(null);

    const userMessage = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Education: ${formData.education}
Skills: ${formData.skills}
Projects: ${formData.projects}
Experience: ${formData.experience}
Achievements: ${formData.achievements}
`;

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, template, jobDescription }),
      });

      const data = await res.json();
      const finalReply = data.reply || data.error || "No response received";
      const localATS = calculateLocalATS(finalReply, jobDescription);

      setReply(finalReply);
      setAtsData(localATS || data.ats || null);

      saveHistory({
        id: Date.now(),
        template,
        resume: finalReply,
        ats: localATS || data.ats || null,
        mode: "Generated Resume",
        createdAt: new Date().toLocaleString(),
      });
    } catch (error) {
      console.log(error);
      setReply("Backend se connection nahi ho raha. Backend start hai kya?");
    } finally {
      setLoading(false);
    }
  };

  const checkExistingResumeATS = () => {
    if (!existingResume.trim()) {
      alert("Please paste or upload your existing resume first");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please paste job description first");
      return;
    }

    const result = calculateLocalATS(existingResume, jobDescription);

    setReply(existingResume);
    setAtsData(result);

    saveHistory({
      id: Date.now(),
      template: "Existing Resume ATS",
      resume: existingResume,
      ats: result,
      mode: "Existing Resume",
      createdAt: new Date().toLocaleString(),
    });
  };

  const improveResume = async () => {
    if (!existingResume.trim() && !reply.trim()) {
      alert("Please add resume first");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please add job description first");
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const resumeToImprove = existingResume || reply;

      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `
Improve this resume according to the job description.

Resume:
${resumeToImprove}

Job Description:
${jobDescription}

Rules:
- Keep it ATS friendly
- Add missing keywords naturally
- Improve bullet points
- Do not add fake experience
`,
          template: "ATS Improved Resume",
          jobDescription,
        }),
      });

      const data = await res.json();
      const improved = data.reply || data.error || "No response received";
      const improvedATS = calculateLocalATS(improved, jobDescription);

      setReply(improved);
      setAtsData(improvedATS);

      saveHistory({
        id: Date.now(),
        template: "ATS Improved Resume",
        resume: improved,
        ats: improvedATS,
        mode: "Improved Resume",
        createdAt: new Date().toLocaleString(),
      });
    } catch (error) {
      console.log(error);
      alert("Resume improve nahi ho paya. Backend check karo.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      education: "",
      skills: "",
      projects: "",
      experience: "",
      achievements: "",
    });

    setReply("");
    setJobDescription("");
    setAtsData(null);
    setProfilePhoto(null);
    setExistingResume("");
    setUploadedResumeName("");
  };

  const loadFromHistory = (item) => {
    setReply(item.resume);
    setAtsData(item.ats);
    setTemplate(item.template);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteHistory = (id) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("resumeHistory", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("resumeHistory");
  };

  const copyResume = () => {
    if (!reply) {
      alert("Please generate or paste resume first");
      return;
    }

    navigator.clipboard.writeText(reply);
    alert("Resume copied successfully");
  };

  const downloadTXT = () => {
    if (!reply) {
      alert("Please generate or paste resume first");
      return;
    }

    const blob = new Blob([reply], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const downloadDOCX = async () => {
    if (!reply) {
      alert("Please generate or paste resume first");
      return;
    }

    const doc = new Document({
      sections: [
        {
          children: reply.split("\n").map(
            (line) =>
              new Paragraph({
                children: [new TextRun({ text: line || " ", size: 24 })],
              })
          ),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Resume.docx");
  };

  const downloadPDF = async () => {
    if (!reply) {
      alert("Please generate or paste resume first");
      return;
    }

    const element = document.getElementById("resume-preview");

    if (!element) {
      alert("Resume preview not found");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("resume.pdf");
  };

  const scoreClass =
    atsData?.score >= 80
      ? "excellent"
      : atsData?.score >= 65
      ? "good"
      : atsData?.score >= 45
      ? "average"
      : "low";

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo">R</div>
          <div>
            <h2>ResumeAI</h2>
            <p>AI Resume Builder & ATS Checker</p>
          </div>
        </div>

        <nav className="nav">
          <a href="#checker">Checker</a>
          <a href="#results">Results</a>
          <a href="#history">History</a>
        </nav>

        <button className="clear-btn" onClick={clearAll}>Clear</button>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-text">
            <span className="badge">Free ATS Resume Checker</span>
            <h1>Build a job-ready resume with AI.</h1>
            <p>
              Upload or paste your resume, compare it with a job description,
              check ATS score, find missing keywords, and improve it instantly.
            </p>

            <div className="hero-actions">
              <a href="#checker" className="primary-link">Check Resume</a>
              <button className="secondary-link" onClick={() => setMode("builder")}>
                Build New Resume
              </button>
            </div>
          </div>

          <div className="upload-card">
            <h3>Start with your resume</h3>
            <p>Upload TXT file or paste your resume manually.</p>

            <label className="upload-box">
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
              <strong>Choose Resume File</strong>
              <span>{uploadedResumeName || "TXT supported directly"}</span>
            </label>
          </div>
        </section>

        <section className="stats">
          <div>
            <h3>{atsData ? `${atsData.score}/100` : "ATS"}</h3>
            <p>Resume Score</p>
          </div>
          <div>
            <h3>{atsData?.matchedKeywords?.length || 0}</h3>
            <p>Matched Keywords</p>
          </div>
          <div>
            <h3>{atsData?.missingKeywords?.length || 0}</h3>
            <p>Missing Keywords</p>
          </div>
          <div>
            <h3>{history.length}</h3>
            <p>Saved Versions</p>
          </div>
        </section>

        <section className="workspace" id="checker">
          <div className="editor-card">
            <div className="mode-tabs">
              <button
                className={mode === "checker" ? "active" : ""}
                onClick={() => setMode("checker")}
              >
                Check Resume
              </button>

              <button
                className={mode === "builder" ? "active" : ""}
                onClick={() => setMode("builder")}
              >
                Generate Resume
              </button>
            </div>

            {mode === "checker" ? (
              <>
                <div className="section-title">
                  <span>Resume Checker</span>
                  <h2>Analyze existing resume</h2>
                </div>

                <textarea
                  className="resume-textarea"
                  placeholder="Paste your existing resume text here..."
                  value={existingResume}
                  onChange={(e) => setExistingResume(e.target.value)}
                />

                <textarea
                  className="jd-textarea"
                  placeholder="Paste job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />

                <div className="button-row">
                  <button className="primary-btn" onClick={checkExistingResumeATS}>
                    Check ATS Score
                  </button>

                  <button
                    className="success-btn"
                    onClick={improveResume}
                    disabled={loading}
                  >
                    {loading ? "Improving..." : "Improve Resume"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="section-title">
                  <span>Resume Builder</span>
                  <h2>Create resume from details</h2>
                </div>

                <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
                <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />

                <textarea name="education" placeholder="Education" value={formData.education} onChange={handleChange} />
                <textarea name="skills" placeholder="Skills" value={formData.skills} onChange={handleChange} />
                <textarea name="projects" placeholder="Projects" value={formData.projects} onChange={handleChange} />
                <textarea name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} />
                <textarea name="achievements" placeholder="Achievements / Certifications" value={formData.achievements} onChange={handleChange} />

                <label className="mini-upload">
                  Upload Profile Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                </label>

                {profilePhoto && (
                  <img src={profilePhoto} alt="profile" className="profile-preview" />
                )}

                <h3 className="small-heading">Choose Template</h3>

                <div className="template-grid">
                  {templates.map((item) => (
                    <button
                      key={item}
                      className={template === item ? "active" : ""}
                      onClick={() => setTemplate(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <textarea
                  className="jd-textarea"
                  placeholder="Paste job description for ATS matching..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />

                <button
                  className="primary-btn full-btn"
                  onClick={generateResume}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Resume"}
                </button>
              </>
            )}
          </div>

          <div className="results-area" id="results">
            <div className="ats-card">
              {atsData ? (
                <>
                  <div className="score-row">
                    <div className={`score-circle ${scoreClass}`}>
                      <strong>{atsData.score}</strong>
                      <small>/100</small>
                    </div>

                    <div>
                      <span className={`level ${scoreClass}`}>{atsData.level}</span>
                      <h2>{atsData.recommendation}</h2>
                    </div>
                  </div>

                  <div className="score-bar">
                    <div
                      className={`score-fill ${scoreClass}`}
                      style={{ width: `${atsData.score}%` }}
                    ></div>
                  </div>

                  <div className="keyword-block">
                    <h3>Matched Keywords</h3>
                    <div className="chips">
                      {atsData.matchedKeywords?.length ? (
                        atsData.matchedKeywords.map((word, index) => (
                          <span className="chip matched" key={index}>{word}</span>
                        ))
                      ) : (
                        <span className="chip">None</span>
                      )}
                    </div>
                  </div>

                  <div className="keyword-block">
                    <h3>Missing Keywords</h3>
                    <div className="chips">
                      {atsData.missingKeywords?.length ? (
                        atsData.missingKeywords.map((word, index) => (
                          <span className="chip missing" key={index}>{word}</span>
                        ))
                      ) : (
                        <span className="chip">None</span>
                      )}
                    </div>
                  </div>

                  {atsData.suggestions?.length > 0 && (
                    <div className="suggestion-box">
                      <h3>Improvement Suggestions</h3>
                      {atsData.suggestions.map((item, index) => (
                        <p key={index}>✓ {item}</p>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-box">
                  <h2>Your ATS score will appear here</h2>
                  <p>Add resume and job description to start analysis.</p>
                </div>
              )}
            </div>

            <div className="preview-card">
              <div className="preview-header">
                <div>
                  <h2>Resume Preview</h2>
                  <p>
                    Words: {reply ? reply.trim().split(/\s+/).length : 0} · Characters: {reply.length}
                  </p>
                </div>

                <div className="export-actions">
                  <button onClick={copyResume}>Copy</button>
                  <button onClick={downloadPDF}>PDF</button>
                  <button onClick={downloadDOCX}>DOCX</button>
                  <button onClick={downloadTXT}>TXT</button>
                </div>
              </div>

              {reply ? (
                <div id="resume-preview">
                  {profilePhoto && template !== "ATS Friendly" && (
                    <img src={profilePhoto} alt="profile" className="resume-profile-photo" />
                  )}

                  <pre className={`resume-output ${template.replaceAll(" ", "-")}`}>
                    {reply}
                  </pre>
                </div>
              ) : (
                <div className="empty-preview">
                  <h2>No resume preview yet</h2>
                  <p>Your generated or checked resume will show here.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="history-section" id="history">
          <div className="history-header">
            <div>
              <span>Saved Work</span>
              <h2>Resume History</h2>
            </div>

            <button onClick={clearHistory}>Clear History</button>
          </div>

          <div className="history-grid">
            {history.length === 0 ? (
              <div className="history-empty">No saved resumes yet.</div>
            ) : (
              history.map((item) => (
                <div className="history-item" key={item.id}>
                  <strong>{item.mode || item.template}</strong>
                  <p>{item.createdAt}</p>

                  <div>
                    <button onClick={() => loadFromHistory(item)}>Load</button>
                    <button onClick={() => deleteHistory(item.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;