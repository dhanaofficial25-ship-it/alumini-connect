
import { GoogleGenAI } from "@google/genai";

// Fix: Always initialize GoogleGenAI exactly as per guidelines using process.env.API_KEY directly.
export const geminiService = {
  async getCareerAdvice(studentProfile: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given this student profile: "${studentProfile}", provide 3 specific career path recommendations and 3 skills they should learn to improve their employability. Format as a clean summary.`,
    });
    return response.text;
  },

  async analyzeJobMatch(studentSkills: string[], jobDescription: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Compare these student skills: [${studentSkills.join(', ')}] with this job description: "${jobDescription}". Rate the match from 0-100% and provide a brief explanation of why.`,
    });
    return response.text;
  },

  async optimizeProfile(profileData: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Review this professional bio/profile: "${profileData}". Suggest 3 improvements to make it more professional and attractive to recruiters.`,
    });
    return response.text;
  }
};
