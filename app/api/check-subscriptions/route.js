import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { subscriptions } = await request.json();

    const listText = subscriptions
      .map((s) => `- ${s.name}: €${s.cost}/month, usage: ${s.usage || 'not specified'}`)
      .join('\n');

    const prompt = `Here is a list of someone's monthly subscriptions:

${listText}

Calculate the total monthly and yearly cost of all of them combined. Then identify which ones seem worth reconsidering based on how rarely they say they use them (be reasonable — only flag ones described as rarely/barely used, not ones used regularly). Write everything in simple, plain English.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalMonthly: { type: Type.STRING, description: 'Total monthly cost of all subscriptions, e.g. "€45.98"' },
            totalYearly: { type: Type.STRING, description: 'Total yearly cost, e.g. "€551.76"' },
            summary: { type: Type.STRING, description: 'One or two sentence overall takeaway' },
            flagged: {
              type: Type.ARRAY,
              description: 'Subscriptions worth reconsidering, empty array if none stand out',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  monthlyCost: { type: Type.STRING },
                  reason: { type: Type.STRING, description: 'Short plain-English reason this is flagged' },
                },
                required: ['name', 'monthlyCost', 'reason'],
              },
            },
          },
          required: ['totalMonthly', 'totalYearly', 'summary', 'flagged'],
        },
      },
    });

    return Response.json(JSON.parse(response.text));

  } catch (error) {
    console.error('Check-subscriptions error:', error);
    return Response.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}