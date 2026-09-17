import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const form = await request.json();

    const prompt = `Write a formal, properly worded German cancellation letter (Kündigungsschreiben) using these details:

- Type of contract being cancelled: ${form.contractType}
- Sender name: ${form.yourName}
- Sender address: ${form.yourAddress}
- Company/recipient name: ${form.companyName}
- Company address: ${form.companyAddress || 'not provided, omit this line'}
- Contract/customer number: ${form.contractNumber || 'not provided, omit this line'}
- Desired cancellation date: ${form.cancelDate || 'the earliest legally possible date, and ask the company to confirm the exact date'}

Write the full letter in German, following standard formal German business letter format (sender address top left, date top right, recipient address below, subject line starting with "Kündigung", formal salutation "Sehr geehrte Damen und Herren,", a clear cancellation request, a request for written confirmation, and a formal closing "Mit freundlichen Grüßen" followed by the sender's name).

Return ONLY the letter text, nothing else — no explanation before or after.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return Response.json({ letter: response.text });

  } catch (error) {
    console.error('Generate-cancellation error:', error);
    return Response.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}