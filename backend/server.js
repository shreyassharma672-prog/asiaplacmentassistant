import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";

import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const resumeUpload = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (!error) {
      return next();
    }

    const message =
      error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
        ? "Resume file is too large. Upload a file under 5MB."
        : "Resume upload failed. Upload PDF, DOC, DOCX, or TXT.";

    return res.status(400).json({ error: message });
  });
};

const SUPPORTED_RESUME_MIMETYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
  "application/octet-stream",
]);

const SUPPORTED_RESUME_EXTENSIONS = new Set(["pdf", "doc", "docx", "txt"]);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/api/extract-resume", resumeUpload, async (req, res) => {
  try {
    const resumeText = await extractResumeText(req.file);

    if (!resumeText.trim()) {
      return res.status(400).json({
        error: "Could not extract text from resume. The file may be scanned or empty.",
      });
    }

    res.json({
      success: true,
      text: resumeText,
      resumeText,
      fileName: req.file?.originalname || "",
    });
  } catch (error) {
    logResumeParseError("EXTRACT RESUME ERROR", error, req.file);

    res.status(getUploadErrorStatus(error)).json({
      error: error.message || "Resume extraction failed",
    });
  }
});

function cleanGeminiJson(text = "") {
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Gemini did not return valid JSON");
  }

  return JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
}

async function getGeminiText(response) {
  if (typeof response?.text === "function") {
    return await response.text();
  }

  if (typeof response?.text === "string") {
    return response.text;
  }

  const parts = response?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    return parts.map((part) => part?.text || "").join("").trim();
  }

  return "";
}

function parseGeminiJsonOrFallback(text, fallback) {
  try {
    return cleanGeminiJson(text);
  } catch (error) {
    console.log("GEMINI JSON PARSE ERROR =>", error.message);
    return fallback(text);
  }
}

function getFileExtension(fileName = "") {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

async function pdfParse(buffer) {
  const parser = new PDFParse({ data: buffer });

  try {
    return await parser.getText();
  } finally {
    await parser.destroy();
  }
}

function logResumeParseError(label, error, file) {
  console.error(label, {
    message: error?.message,
    name: error?.name,
    stack: error?.stack,
    fileName: file?.originalname,
    mimetype: file?.mimetype,
    size: file?.size,
  });
}

async function extractResumeText(file) {
  if (!file) {
    throw new Error("No resume file uploaded");
  }

  if (!file.buffer?.length) {
    throw new Error("Uploaded resume file is empty");
  }

  const fileName = file.originalname || "";
  const extension = getFileExtension(fileName);
  const mimetype = file.mimetype || "";

  if (
    !SUPPORTED_RESUME_MIMETYPES.has(mimetype) &&
    !SUPPORTED_RESUME_EXTENSIONS.has(extension)
  ) {
    throw new Error("Unsupported resume file type. Upload PDF, DOC, DOCX, or TXT.");
  }

  try {
    if (mimetype === "application/pdf" || extension === "pdf") {
      const data = await pdfParse(file.buffer);
      return data.text || "";
    }

    if (
      mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimetype === "application/msword" ||
      extension === "docx" ||
      extension === "doc"
    ) {
      const data = await mammoth.extractRawText({ buffer: file.buffer });
      return data.value || "";
    }

    if (mimetype === "text/plain" || extension === "txt") {
      return file.buffer.toString("utf-8");
    }
  } catch (error) {
    logResumeParseError("RESUME PARSE ERROR", error, file);
    throw new Error("Could not parse resume file. Try a text-based PDF, DOCX, or TXT file.");
  }

  throw new Error("Unsupported resume file type. Upload PDF, DOC, DOCX, or TXT.");
}

function getUploadErrorStatus(error) {
  if (
    error.message?.includes("Unsupported") ||
    error.message?.includes("empty") ||
    error.message?.includes("No resume") ||
    error.message?.includes("Could not parse")
  ) {
    return 400;
  }

  return 500;
}

const RESUME_TEMPLATE_INSTRUCTIONS = {
  "ATS Friendly":
    "Use a simple one-column ATS-safe layout with clear section headings.",
  "Modern Fresher":
    "Prioritize education, skills, projects, achievements, and certifications for a fresher.",
  "Software Engineer":
    "Emphasize technical skills, projects, tools, APIs, databases, and measurable engineering impact.",
  "Internship Resume":
    "Keep the resume concise and highlight education, training, projects, and internship readiness.",
  "Professional Clean":
    "Use a polished, formal structure suitable for general professional roles.",
  Minimal:
    "Use a minimal content-first layout with short section headings and concise bullets.",
  Corporate:
    "Use a formal corporate layout with professional wording and structured sections.",
  Creative:
    "Use a refined creative layout in plain text while keeping it ATS-readable and professional.",
};

function getSafeTemplate(template) {
  return RESUME_TEMPLATE_INSTRUCTIONS[template] ? template : "ATS Friendly";
}

function normalizeLine(line = "") {
  return String(line).replace(/\s+/g, " ").trim();
}

function parseUserDetails(message = "") {
  const details = {};

  String(message)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [rawKey, ...rest] = line.split(":");
      if (!rawKey || rest.length === 0) return;
      const key = rawKey.trim().toLowerCase();
      const value = rest.join(":").trim();
      if (value) details[key] = value;
    });

  return details;
}

function createResumeFallback({ message, template, jobDescription }) {
  const details = parseUserDetails(message);
  const name = normalizeLine(details.name) || "Your Name";
  const email = normalizeLine(details.email);
  const phone = normalizeLine(details.phone);
  const linkedin = normalizeLine(details.linkedin);
  const github = normalizeLine(details.github);
  const safeTemplate = getSafeTemplate(template);

  const contact = [email, phone, linkedin, github].filter(Boolean).join(" | ");
  const sections = [
    name,
    contact,
    "",
    "Professional Summary",
    "Motivated candidate with strong problem-solving ability, clear communication, and a commitment to building reliable, placement-ready work.",
    "",
    "Education",
    normalizeLine(details.education) || "Add your degree, college, year, and academic details.",
    "",
    "Technical Skills",
    normalizeLine(details.skills) || "Add programming languages, tools, frameworks, and relevant technical skills.",
    "",
    "Projects",
    normalizeLine(details.projects) || "Add 2-3 projects with technologies used, your role, and measurable outcomes.",
    "",
    "Experience",
    normalizeLine(details.experience) || "Add internships, training, volunteering, or relevant practical experience.",
    "",
    "Achievements",
    normalizeLine(details.achievements) || "Add awards, hackathons, leadership work, or notable accomplishments.",
    "",
    "Certifications",
    normalizeLine(details.certifications) || "Add relevant certifications, courses, or workshops.",
  ].filter((line) => line !== undefined);

  const targetTerms = String(jobDescription || "")
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 12);

  return {
    reply: sections.join("\n"),
    ats: {
      score: targetTerms.length ? 68 : 64,
      matchedKeywords: [],
      missingKeywords: [...new Set(targetTerms)].slice(0, 8),
      recommendation: `${safeTemplate} fallback generated locally. Add role-specific keywords, measurable outcomes, and verified project details before exporting.`,
    },
  };
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, template, jobDescription } = req.body;
    const safeTemplate = getSafeTemplate(template);

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Please enter your details first",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY missing in .env file",
      });
    }

    const prompt = `
You are an expert ATS-friendly resume writer and career mentor.

Your main task:
- Do NOT copy user details as-is.
- Correct spelling mistakes.
- Correct grammar mistakes.
- Rewrite weak or casual lines professionally.
- Improve sentence structure.
- Convert rough points into resume-ready bullet points.
- Keep the user's original facts same.
- Do NOT invent fake company names, fake internships, fake marks, or fake achievements.
- Use strong action verbs.
- Make the resume professional, clean, polished, and ATS-friendly.

Template Type:
${safeTemplate}

Template Layout Instruction:
${RESUME_TEMPLATE_INSTRUCTIONS[safeTemplate]}

User Details:
${message}

Job Description:
${jobDescription || "Not provided"}

Return ONLY valid JSON.
Do not use markdown.
Do not use code blocks.

JSON Format:
{
  "reply": "full polished professional resume text",
  "ats": {
    "score": 85,
    "matchedKeywords": ["keyword1"],
    "missingKeywords": ["keyword2"],
    "recommendation": "short useful recommendation"
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = await getGeminiText(response);
    const parsedData = parseGeminiJsonOrFallback(responseText, (text) => ({
      reply: String(text || "").trim(),
      ats: {
        score: 70,
        matchedKeywords: [],
        missingKeywords: [],
        recommendation:
          "AI generated the resume, but ATS JSON metadata could not be parsed. Review and export the resume normally.",
      },
    }));

    if (!parsedData?.reply?.trim()) {
      console.log("GEMINI EMPTY RESPONSE => using fallback", {
        template: safeTemplate,
      });
      return res.json(
        createResumeFallback({ message, template: safeTemplate, jobDescription })
      );
    }

    res.json(parsedData);
  } catch (error) {
    console.log("FULL BACKEND ERROR =>", error);

    res.json(
      createResumeFallback({
        message: req.body?.message || "",
        template: req.body?.template || "ATS Friendly",
        jobDescription: req.body?.jobDescription || "",
      })
    );
  }
});

app.post(
  "/api/analyze-uploaded-resume",
  resumeUpload,
  async (req, res) => {
    try {
      const { jobDescription } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: "GEMINI_API_KEY missing in .env file",
        });
      }

      const resumeText = await extractResumeText(req.file);

      if (!resumeText.trim()) {
        return res.status(400).json({
          error: "Could not extract text from resume",
        });
      }

      const prompt = `
You are an expert ATS resume analyzer.

Analyze this uploaded resume.

Resume Text:
${resumeText}

Job Description:
${jobDescription || "Not provided"}

Tasks:
- Give ATS score out of 100.
- Identify matched keywords.
- Identify missing keywords and missing skills.
- Identify resume strengths.
- Give improvement suggestions.
- Do not invent fake information.
- If job description is not provided, analyze against general ATS best practices.
- Return every list field as an array of strings.

Return ONLY valid JSON.
Do not use markdown.
Do not use code blocks.

JSON Format:
{
  "score": 82,
  "matchedKeywords": ["React", "JavaScript"],
  "missingKeywords": ["Redux", "Docker"],
  "missingSkills": ["Testing", "CI/CD"],
  "strengths": ["Good projects", "Clear skills section"],
  "improvements": ["Add measurable achievements", "Add job-specific keywords"],
  "extractedText": "short extracted resume text summary"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = await getGeminiText(response);
      const data = parseGeminiJsonOrFallback(responseText, () => ({
        score: 0,
        matchedKeywords: [],
        missingKeywords: [],
        missingSkills: [],
        strengths: [],
        improvements: [
          "AI analysis metadata could not be parsed. Try again or add a clearer job description.",
        ],
        extractedText: resumeText.slice(0, 500),
      }));

      res.json({
        ...data,
        resumeText,
      });
    } catch (error) {
      logResumeParseError("UPLOAD ANALYSIS ERROR", error, req.file);

      res.status(getUploadErrorStatus(error)).json({
        error: error.message || "Uploaded resume analysis failed",
      });
    }
  }
);

app.post("/api/improve-uploaded-resume", async (req, res) => {
  try {
    const { resumeText, jobDescription, missingKeywords, missingSkills } =
      req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        error: "Resume text missing",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY missing in .env file",
      });
    }

    const prompt = `
You are an expert ATS-friendly resume writer.

Improve this resume for ATS.

Original Resume:
${resumeText}

Job Description:
${jobDescription || "Not provided"}

Missing Keywords:
${Array.isArray(missingKeywords) ? missingKeywords.join(", ") : "Not provided"}

Missing Skills:
${Array.isArray(missingSkills) ? missingSkills.join(", ") : "Not provided"}

Rules:
- Correct grammar and spelling.
- Improve weak lines.
- Add relevant missing keywords only when supported by the user's actual resume.
- Do not claim skills, tools, companies, projects, internships, degrees, marks, metrics, or achievements that are not present or clearly implied in the original resume.
- Do NOT invent fake internships, fake companies, fake marks, or fake achievements.
- Use strong action verbs.
- Keep it professional and ATS-friendly.
- Calculate the new ATS score out of 100 from the improved resume and job description.
- Return changesMade as an array of strings.

Return ONLY valid JSON.
Do not use markdown.
Do not use code blocks.

JSON Format:
{
  "improvedResume": "full improved resume text",
  "newAtsScore": 90,
  "changesMade": ["Improved summary", "Added stronger project bullets"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = await getGeminiText(response);
    const data = parseGeminiJsonOrFallback(responseText, (text) => ({
      improvedResume: String(text || "").trim(),
      newAtsScore: 75,
      changesMade: [
        "AI returned resume text, but score metadata could not be parsed.",
      ],
    }));

    if (!data?.improvedResume?.trim()) {
      throw new Error("Gemini returned an empty improved resume");
    }

    res.json(data);
  } catch (error) {
    console.log("IMPROVE RESUME ERROR =>", error);

    res.status(500).json({
      error: "AI resume improvement failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
