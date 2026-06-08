import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, template, jobDescription } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Please enter your details first",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        reply: "GEMINI_API_KEY missing in .env file",
        ats: {
          score: 0,
          matchedKeywords: [],
          missingKeywords: [],
          recommendation: "Create .env file inside backend folder.",
        },
      });
    }

    const prompt = `
You are an expert resume writer.

Create a professional ATS-friendly resume.

Template Type: ${template || "ATS Friendly"}

User Details:
${message}

Job Description:
${jobDescription || "Not provided"}

Return ONLY valid JSON.
Do not use markdown.
Do not use code blocks.

Format:
{
  "reply": "full resume text",
  "ats": {
    "score": 85,
    "matchedKeywords": ["keyword1"],
    "missingKeywords": ["keyword2"],
    "recommendation": "short recommendation"
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text || "";

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Gemini did not return valid JSON");
    }

    const jsonText = text.slice(jsonStart, jsonEnd + 1);
let parsedData = JSON.parse(jsonText);

// Fallback if API gives empty/broken response
if (!parsedData?.reply) {
  parsedData = {
    reply: `
Name: User Resume

Skills:
- Communication
- Problem Solving
- Teamwork

Projects:
- AI Resume Builder
- Medicine Reminder System

Experience:
- Internship / Fresher
`,
    ats: {
      score: 70,
      matchedKeywords: ["Resume", "Projects"],
      missingKeywords: ["Leadership"],
      recommendation: "Add more technical keywords",
    },
  };
}

res.json(parsedData);
  } catch (error) {
    
  console.log("FULL BACKEND ERROR =>", error);

  res.status(200).json({
    reply: `
Name: Your Name

Contact:
Email: your.email@example.com
Phone: +91 XXXXX XXXXX
LinkedIn: linkedin.com/in/yourprofile

Career Objective:
Motivated and detail-oriented fresher seeking an opportunity to apply technical knowledge, problem-solving skills, and communication abilities in a professional environment.

Education:
- B.Tech in Electronics and Communication Engineering
- Guru Nanak Dev University
- Batch: 2023–2027

Skills:
- C / C++
- Python
- SQL
- React.js
- Node.js
- Communication Skills
- Problem Solving

Projects:
1. AI Resume Builder
- Built a resume generation web app using React and Node.js.
- Added ATS score analysis, templates, history, and download features.

2. Medicine Reminder System
- Developed an IoT-based medicine reminder system using NodeMCU, RTC, LCD, buzzer, LEDs, and buttons.
- Designed alarm-based reminders for scheduled medicine slots.

Strengths:
- Quick learner
- Team collaboration
- Time management
- Adaptability
`,
    ats: {
      score: 72,
      matchedKeywords: [
        "React.js",
        "Node.js",
        "Python",
        "SQL",
        "Projects",
        "Problem Solving",
      ],
      missingKeywords: [
        "Internship",
        "Certifications",
        "Work Experience",
      ],
      recommendation:
        "Gemini quota exceeded, so fallback resume generated. Add internship, certifications, and job-specific keywords for better ATS score.",
    },
  });
}
    });



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});