import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { image, mediaType, language } = await request.json();
    const targetLanguage = language || 'English';

    const prompt = `You are analyzing a German insurance policy document (Versicherungspolice, Versicherungsschein, or similar). Read it carefully and explain it to someone who may not be fluent in German or familiar with German insurance terms. Be specific — use real details from the document, not generic insurance advice. Respond entirely in ${targetLanguage}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { mimeType: mediaType, data: image } },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentType: {
              type: Type.STRING,
              description: `What kind of insurance this is (e.g. health, car, liability/Haftpflicht, household/Hausrat, legal), in ${targetLanguage}.`,
            },
            summary: {
              type: Type.STRING,
              description: `A 2-3 sentence plain-language summary of this policy, in ${targetLanguage}.`,
            },
            covered: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `Specific things this policy covers, based on the document, in ${targetLanguage}.`,
            },
            excluded: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `Specific things this policy does NOT cover or exclusions mentioned in the document, in ${targetLanguage}.`,
            },
            importantNumbers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: `e.g. "Monthly premium", "Deductible", "Coverage limit", in ${targetLanguage}.` },
                  value: { type: Type.STRING, description: 'The actual figure from the document.' },
                },
                required: ['label', 'value'],
              },
              description: 'Key monetary figures, limits, and dates found in the document (premium, deductible/Selbstbeteiligung, coverage limits, renewal date, etc).',
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `Confusing clauses, unusual restrictions, waiting periods, or things the person should pay close attention to, in ${targetLanguage}.`,
            },
            recommendation: {
              type: Type.STRING,
              description: `One short, practical piece of advice for this specific policy, in ${targetLanguage}.`,
            },
          },
          required: ['documentType', 'summary', 'covered', 'excluded', 'importantNumbers', 'redFlags', 'recommendation'],
        },
      },
    });

    const result = JSON.parse(response.text);
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Something went wrong analyzing the document.' }, { status: 500 });
  }
}