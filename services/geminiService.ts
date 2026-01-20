
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getPropertyAIInsights = async (propertyDetails: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this property listing for the Nigerian market. Provide a suggested market price range in Naira, a fraud risk score (0-100), and 3 improvement tips: ${propertyDetails}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedPriceRange: { type: Type.STRING },
          fraudRiskScore: { type: Type.NUMBER },
          tips: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["suggestedPriceRange", "fraudRiskScore", "tips"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getSmartRecommendations = async (preferences: string, availableProperties: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on user preferences: ${preferences}, select the top 3 best matching properties from this list: ${availableProperties}. Explain why for each.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            propertyId: { type: Type.STRING },
            matchReason: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};
