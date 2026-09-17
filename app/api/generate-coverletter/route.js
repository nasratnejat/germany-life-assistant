import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const form = await request.json();

    const prompt = `Write a formal German-style cover letter (Anschreiben) for this job application.

Applicant name: ${form.yourName}

Job posting:
${form.jobPosting}

Applicant's background:
${form.background}

Follow standard German Anschreiben conventions: a brief, confident opening stating the position being applied for, 2-3 short paragraphs connecting the applicant's real background to what the job posting is asking for (use specific details from their background, don't invent experience they didn't mention), a closing paragraph expressing interest in an interview, and a formal closing "Mit freundlichen Grüßen" followed by the applicant's name.

Write it in German. Keep it professional, concise (no more than one page worth of text), and grounded only in the background information given — do not fabricate qualifications, companies, or dates not mentioned.

Return ONLY the letter text, nothing else — no explanation before or after.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return Response.json({ letter: response.text });

  } catch (error) {
    console.error('Generate-coverletter error:', error);
    return Response.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}