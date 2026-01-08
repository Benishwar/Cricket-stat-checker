
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const getCricketInsight = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are a professional world-class Cricket Statistics Analyst and Historian.
    Your goal is to provide accurate, up-to-date statistical data for International Cricket (Test, ODI, T20I) and IPL.
    
    When asked about statistics:
    1. Use Google Search grounding to ensure real-time accuracy.
    2. Format your response clearly. 
    3. If requested, provide data in a structured way that can be parsed into tables or charts.
    4. If the query is about comparisons (e.g., Kohli vs Smith), provide a side-by-side breakdown.
    5. Always include relevant context like venue-based splits or home vs away performance if available.
    6. Always cite your sources with links.
    
    Your tone should be professional, objective, and analytical.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstruction,
      },
    });

    const text = response.text || "I couldn't retrieve that information right now.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return {
      text,
      sources
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Sorry, I encountered an error while fetching the statistics. Please try again later.",
      sources: []
    };
  }
};
