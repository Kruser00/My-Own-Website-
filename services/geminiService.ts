import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize Gemini with the provided environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash-latest"; // Using a fast model for chat interactions

export const generateGeminiResponse = async (
  prompt: string,
  context?: string
): Promise<string> => {
  try {
    const systemInstruction = `
      شما "هوش مصنوعی فیلمنتو" هستید. یک دستیار هوشمند و مودب برای عاشقان سینما به زبان فارسی.
      وظیفه شما پاسخ دادن به سوالات کاربران درباره فیلم‌ها، سریال‌ها، بازیگران و پیشنهادات فیلم است.
      پاسخ‌هایتان باید کوتاه، جذاب و به زبان فارسی روان باشد.
      اگر کاربری درباره فیلم خاصی سوال کرد، از اطلاعات ارائه شده در متن استفاده کنید.
      ${context ? `اطلاعات فیلم فعلی: ${context}` : ''}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "متاسفانه نتوانستم پاسخی تولید کنم.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "خطایی در ارتباط با هوش مصنوعی رخ داد. لطفا بعدا تلاش کنید.";
  }
};
