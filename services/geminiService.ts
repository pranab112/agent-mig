import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure API key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateMarketingCopy = async (
  audience: string,
  platform: string,
  productTone: string
): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const prompt = `
      You are 'MIG AI', an expert sales copywriter and referral agent mentor for the company 'Mind is Gear'.
      Create a compelling, short, and effective referral pitch for a sales agent.
      
      Target Audience: ${audience}
      Platform: ${platform}
      Tone: ${productTone}
      
      The goal is to get the user to sign up using a referral link. Keep it under 200 words. 
      Includes placeholders like [LINK] where necessary.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are MIG AI, a top-tier sales coach. Your output should be ready-to-paste text.",
        temperature: 0.7,
      }
    });

    return response.text || "Failed to generate copy.";
  } catch (error) {
    console.error("MIG AI Error:", error);
    return "An error occurred while communicating with MIG AI.";
  }
};

export const analyzeReferralStrategy = async (
  currentStats: string
): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const prompt = `
      As MIG AI, analyze the following agent performance stats and suggest 3 concrete actions to improve conversion rates for Mind is Gear agents.
      Stats: ${currentStats}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 } // Use thinking for analysis
      }
    });

    return response.text || "Failed to analyze strategy.";
  } catch (error) {
    console.error("MIG AI Error:", error);
    return "An error occurred while analyzing strategy.";
  }
};

export const evaluateDealStructure = async (
  clientDescription: string
): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const prompt = `
      I am a sales agent for Mind is Gear deciding between offering a One-Time Payment deal or a Recurring (Long-term) subscription to a client.
      You are MIG AI, the proprietary deal architect.
      
      Client Description: "${clientDescription}"
      
      Please analyze this client and recommend which structure (One-Time or Recurring) is better for me (the agent) and for closing the deal. 
      Explain why in 3 bullet points.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });

    return response.text || "Failed to evaluate deal structure.";
  } catch (error) {
    console.error("MIG AI Error:", error);
    return "An error occurred while evaluating deal structure.";
  }
};