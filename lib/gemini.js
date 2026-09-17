import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function callWithRetry(params, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      const isOverloaded =
        error.status === 503 || error.message?.includes("overloaded");
      if (isOverloaded && attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1500 * (attempt + 1)),
        );
        continue;
      }
      throw error;
    }
  }
}

// For routes that need structured JSON back (most of your checkers)
export async function generateJSON(prompt, schema) {
  const response = await callWithRetry({
    model: "gemini-3.6-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json", responseSchema: schema },
  });
  return JSON.parse(response.text);
}

// For routes that also send an image (explain-letter, check-utility, insurance)
export async function generateJSONWithImage(prompt, image, mediaType, schema) {
  const response = await callWithRetry({
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType: mediaType, data: image } },
        ],
      },
    ],
    config: { responseMimeType: "application/json", responseSchema: schema },
  });
  return JSON.parse(response.text);
}

// For routes that just want plain text back (cancellation letter, cover letter)
export async function generateText(prompt) {
  const response = await callWithRetry({
    model: "gemini-3.6-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  return response.text;
}

// For the chat route, which sends a full conversation history
export async function generateChat(contents, systemInstruction) {
  const response = await callWithRetry({
    model: "gemini-3.6-flash",
    contents,
    config: { systemInstruction },
  });
  return response.text;
}

// Consistent, friendly error message for every route
export function friendlyError(error, fallback) {
  const isOverloaded =
    error.status === 503 || error.message?.includes("overloaded");
  return isOverloaded
    ? "The AI service is a bit busy right now — please try again in a moment."
    : fallback;
}
