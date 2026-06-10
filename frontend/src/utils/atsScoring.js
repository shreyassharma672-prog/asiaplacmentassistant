/**
 * ATS Scoring Utility
 * Calculates ATS compatibility score based on keywords, sections, and resume quality
 */

import { IMPORTANT_SKILLS, STOP_WORDS } from './constants';

/**
 * Extract keywords from text
 */
export function extractKeywords(text) {
  if (!text) return [];
  
  const lowerText = text.toLowerCase();
  const words = lowerText
    .replace(/[^\w\s+#]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.includes(word));
  
  return [...new Set(words)];
}

/**
 * Check which resume sections are present
 */
export function checkResumeSections(resumeText) {
  const lowerResume = resumeText.toLowerCase();
  
  return {
    hasContact: /email|phone|linkedin|github|portfolio|website/i.test(resumeText),
    hasEducation: /education|degree|bachelor|master|diploma|university|college|school/i.test(resumeText),
    hasExperience: /experience|worked|employed|position|role|intern|led|managed|developed/i.test(resumeText),
    hasSkills: /skills?|technical|proficiency|expertise|competencies|programming/i.test(resumeText),
    hasProjects: /project|built|developed|created|designed|implemented|contributed/i.test(resumeText),
    hasAchievements: /achievement|award|honor|winner|recognized|accomplishment|certified|certification/i.test(resumeText),
  };
}

/**
 * Get skill keywords from resume
 */
export function getResumeSkills(resumeText) {
  const lowerResume = resumeText.toLowerCase();
  return IMPORTANT_SKILLS.filter(skill => lowerResume.includes(skill));
}

/**
 * Calculate ATS score when job description exists
 */
export function calculateATSScoreWithJD(resumeText, jobDescription) {
  if (!resumeText?.trim() || !jobDescription?.trim()) return null;

  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // Extract JD keywords
  const jdKeywords = extractKeywords(jobDescription);
  const jdSkills = IMPORTANT_SKILLS.filter(skill => jdLower.includes(skill));
  const uniqueJDKeywords = [...new Set([...jdKeywords, ...jdSkills])];

  // Find matched keywords in resume
  const matchedKeywords = uniqueJDKeywords.filter(word => resumeLower.includes(word));
  const missingKeywords = uniqueJDKeywords.filter(word => !resumeLower.includes(word));

  // Calculate keyword score (60% of total)
  const keywordScore = uniqueJDKeywords.length > 0
    ? Math.round((matchedKeywords.length / uniqueJDKeywords.length) * 60)
    : 0;

  // Check resume sections (40% of total)
  const sections = checkResumeSections(resumeText);
  const sectionScore = Object.values(sections).filter(Boolean).length * 6; // 6 sections * 6 = 36 points max

  const totalScore = Math.min(keywordScore + sectionScore, 100);

  return {
    score: totalScore,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 15),
    sections,
    keywords: {
      jdKeywords: uniqueJDKeywords.length,
      matched: matchedKeywords.length,
      missing: missingKeywords.length,
    },
  };
}

/**
 * Calculate ATS score based on resume quality alone
 */
export function calculateATSScoreWithoutJD(resumeText) {
  if (!resumeText?.trim()) return null;

  const sections = checkResumeSections(resumeText);
  const resumeSkills = getResumeSkills(resumeText);
  const wordCount = resumeText.trim().split(/\s+/).length;
  
  // Section score (60% max)
  const sectionScore = Object.values(sections).filter(Boolean).length * 10; // 6 sections * 10 = 60 max

  // Skills score (20% max)
  const skillsScore = Math.min(resumeSkills.length * 2, 20);

  // Content quality (20% max)
  let contentScore = 0;
  if (wordCount >= 200) contentScore += 10;
  if (wordCount >= 400) contentScore += 5;
  if (resumeText.includes('•') || resumeText.includes('-') || resumeText.includes('*')) contentScore += 5; // Has bullet points

  const totalScore = Math.min(sectionScore + skillsScore + contentScore, 100);

  const suggestions = [];
  if (!sections.hasContact) suggestions.push('Add contact information (email, phone, LinkedIn)');
  if (!sections.hasEducation) suggestions.push('Include your education details');
  if (!sections.hasExperience) suggestions.push('Add your work experience');
  if (!sections.hasSkills) suggestions.push('List your technical skills');
  if (!sections.hasProjects) suggestions.push('Include your projects and achievements');
  if (resumeSkills.length < 5) suggestions.push('Add more technical skills');

  return {
    score: totalScore,
    sections,
    resumeSkills: resumeSkills.slice(0, 15),
    wordCount,
    suggestions,
    matchedKeywords: [],
    missingKeywords: [],
  };
}

/**
 * Calculate overall ATS report
 */
export function calculateATSScore(resumeText, jobDescription) {
  if (!resumeText?.trim()) return null;

  const hasJD = jobDescription?.trim();
  const report = hasJD
    ? calculateATSScoreWithJD(resumeText, jobDescription)
    : calculateATSScoreWithoutJD(resumeText);

  return {
    ...report,
    level: getScoreLevel(report.score),
    recommendation: getScoreRecommendation(report.score),
    hasJobDescription: !!hasJD,
  };
}

/**
 * Get score level label
 */
export function getScoreLevel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 45) return 'Average';
  return 'Low';
}

/**
 * Get score recommendation
 */
export function getScoreRecommendation(score) {
  if (score >= 80) return 'Excellent! Your resume is well-optimized for ATS systems.';
  if (score >= 65) return 'Good! Your resume matches most requirements. Consider enhancing weak areas.';
  if (score >= 45) return 'Moderate. Review suggestions and improve missing sections and keywords.';
  return 'Low match. Add more relevant keywords and ensure all sections are complete.';
}
