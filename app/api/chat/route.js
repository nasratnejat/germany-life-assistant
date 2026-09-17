import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateWithRetry(params, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      const isOverloaded = error.status === 503 || error.message?.includes('overloaded');
      if (isOverloaded && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
        continue;
      }
      throw error;
    }
  }
}

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const contents = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await generateWithRetry({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction:
          'You are the Klar Assistant, a friendly helper for people living in Germany dealing with paperwork, bureaucracy, contracts, and everyday life admin. Keep answers clear, practical, and in simple English unless asked otherwise. You can also chat about general topics if asked.',
      },
    });

    return Response.json({ reply: response.text });

  } catch (error) {
    console.error('Chat error:', error);
    const friendlyMessage = error.status === 503
      ? 'The AI service is a bit busy right now — please try again in a moment.'
      : error.message || 'Something went wrong';
    return Response.json({ error: friendlyMessage }, { status: 500 });
  }
}