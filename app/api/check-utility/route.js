import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { image, mediaType } = await request.json();

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType: mediaType, data: image } },
            {
              text: 'This is a German utility/service charge bill (Nebenkostenabrechnung) from a landlord. Read the numbers and categories listed, and assess whether anything looks unusually high compared to typical German rental cost benchmarks. Explain everything in simple, plain English with no jargon.',
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'One or two sentences describing what this bill covers and the time period' },
            totalAmount: { type: Type.STRING, description: 'The total amount stated on the bill, e.g. "€1,240.50" or "not clearly stated"' },
            lineItems: {
              type: Type.ARRAY,
              description: 'The main cost categories found on the bill (heating, water, waste, etc.)',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'The cost category, e.g. "Heating"' },
                  amount: { type: Type.STRING, description: 'The amount for this category as shown on the bill' },
                  note: { type: Type.STRING, description: 'A short plain-English note if this looks unusually high or worth questioning, empty string if it looks normal' },
                },
                required: ['name', 'amount', 'note'],
              },
            },
            overallFlag: {
              type: Type.STRING,
              description: 'Overall assessment: exactly one of "normal", "worth checking", or "likely overcharged"',
            },
            recommendation: { type: Type.STRING, description: 'A short, practical next step for the tenant' },
          },
          required: ['summary', 'totalAmount', 'lineItems', 'overallFlag', 'recommendation'],
        },
      },
    });

    return Response.json(JSON.parse(response.text));

  } catch (error) {
    console.error('Check-utility error:', error);
    return Response.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}