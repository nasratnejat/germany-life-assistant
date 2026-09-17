import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { image, mediaType, language } = await request.json();
    const targetLanguage = language || 'English';

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType: mediaType, data: image } },
            {
              text: `This is a letter someone received in Germany. Explain in simple, plain ${targetLanguage}: 1) what this letter is about, 2) whether the person needs to do anything, and 3) any deadline mentioned. Keep it short and clear, no jargon. Write your entire response in ${targetLanguage}, including the sender field.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sender: { type: Type.STRING, description: 'Who sent this letter, translated/written in the target language' },
            summary: { type: Type.STRING, description: 'One short sentence: what this letter is about, in the target language' },
            details: { type: Type.STRING, description: 'A few sentences explaining the letter, in the target language' },
            actionNeeded: { type: Type.STRING, description: 'What the person needs to do, in the target language, or the equivalent of "No action needed"' },
            deadline: { type: Type.STRING, description: 'The deadline mentioned, in the target language, or the equivalent of "No deadline mentioned"' },
            urgent: { type: Type.BOOLEAN, description: 'true if there is a deadline within 14 days or urgent language' },
          },
          required: ['sender', 'summary', 'details', 'actionNeeded', 'deadline', 'urgent'],
        },
      },
    });

    return Response.json(JSON.parse(response.text));

  } catch (error) {
    console.error('Explain-letter error:', error);
    return Response.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}