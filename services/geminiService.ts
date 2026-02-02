
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const askAIAboutProfile = async (userMessage: string) => {
  if (!API_KEY) return "AI 서비스를 현재 이용할 수 없습니다.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: userMessage,
    config: {
      systemInstruction: `You are an AI assistant for a professional educator named Kim Kyeongsu (김경수 강사님). 
      He is an AI spreader and economic instructor with 30 years of experience at DB Insurance.
      He graduated from Pusan National University (Accounting).
      He teaches ChatGPT, Prompt Engineering, NotebookLM, and Nano Banana.
      He also teaches finance/economy to seniors and students.
      His philosophy is "Life without borders".
      Answer in Korean, polite and professional. Keep answers concise.`,
    },
  });

  return response.text || "죄송합니다. 답변을 생성하지 못했습니다.";
};
