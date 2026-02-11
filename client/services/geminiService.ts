
import { GoogleGenAI, Type } from "@google/genai";
import { VideoMetadata } from "../types";

export const fetchVideoDetails = async (url: string): Promise<VideoMetadata> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract potential video metadata for this link: ${url}. If you don't recognize the exact video, generate plausible professional placeholder data for a downloader service.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          duration: { type: Type.STRING },
          platform: { type: Type.STRING },
          thumbnail: { type: Type.STRING },
          formats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                quality: { type: Type.STRING },
                size: { type: Type.STRING },
                type: { type: Type.STRING }
              },
              required: ["quality", "size", "type"]
            }
          }
        },
        required: ["title", "duration", "platform", "thumbnail", "formats"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
