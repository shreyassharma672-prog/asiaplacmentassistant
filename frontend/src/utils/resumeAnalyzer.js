import { IMPORTANT_SKILLS, STOP_WORDS } from './constants';

export const calculateATS = (resumeText, jdText) => {
  if (!resumeText || !jdText?.trim()) return null;

  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  const jdWords = jdLower
    .replace(/[^\w\s+#]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.includes(word));

  const jdSkillKeywords = IMPORTANT_SKILLS.filter((skill) =>
    jdLower.includes(skill)
  );

  const uniqueKeywords = [...new Set([...jdWords, ...jdSkillKeywords])];

  const matchedKeywords = uniqueKeywords.filter((word) =>
    resumeLower.includes(word)
  );

  const score = uniqueKeywords.length > 0
    ? Math.round((matchedKeywords.length / uniqueKeywords.length) * 100)
    : 0;

  const missingKeywords = uniqueKeywords.filter(
    (word) => !matchedKeywords.includes(word)
  );

  return {
    score: Math.min(score, 100),
    matchedKeywords: matchedKeywords.slice(0, 20),
    missingKeywords: missingKeywords.slice(0, 20),
    recommendation: getATSRecommendation(score),
  };
};

const getATSRecommendation = (score) => {
  if (score >= 80) return "Excellent! Your resume is well-optimized for ATS systems.";
  if (score >= 60) return "Good! Your resume matches most keywords. Consider adding more relevant skills.";
  if (score >= 40) return "Moderate. Review missing keywords and add more relevant skills to improve.";
  return "Poor match. Add more keywords from the job description to improve your ATS score.";
};

export const analyzeResume = (resumeText) => {
  if (!resumeText) return null;

  const sections = {
    hasContact: /email|phone|linkedin|github|portfolio/i.test(resumeText),
    hasEducation: /education|degree|bachelor|master|diploma|university|college/i.test(resumeText),
    hasExperience: /experience|worked|employed|position|role|intern|led/i.test(resumeText),
    hasSkills: /skills|technical|proficiency|expertise|competencies/i.test(resumeText),
    hasProjects: /project|built|developed|created|designed|implemented/i.test(resumeText),
  };

  const completeness = Object.values(sections).filter(Boolean).length;
  const completenessScore = Math.round((completeness / Object.keys(sections).length) * 100);

  return {
    sections,
    completenessScore,
    suggestions: generateSuggestions(sections),
  };
};

const generateSuggestions = (sections) => {
  const suggestions = [];
  
  if (!sections.hasContact) suggestions.push("Add contact information (email, phone, LinkedIn)");
  if (!sections.hasEducation) suggestions.push("Include your education details");
  if (!sections.hasExperience) suggestions.push("Add your work experience");
  if (!sections.hasSkills) suggestions.push("List your technical skills");
  if (!sections.hasProjects) suggestions.push("Include your projects and achievements");
  
  return suggestions;
};
