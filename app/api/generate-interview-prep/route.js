import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateWithRetry(params, retries = 2) {
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

export async function POST(request) {
  try {
    const { jobPosting, background } = await request.json();

    const prompt = `You are helping someone prepare for a job interview in Germany. Based on the job posting below${background ? " and the candidate's background" : ""}, generate likely interview questions and practical tips for answering them, tailored to German workplace interview norms (e.g. formal tone, use of "Sie", structured answers, punctuality expectations).

Job posting:
"""
${jobPosting}
"""
${background ? `\nCandidate's background:\n"""\n${background}\n"""\n` : ""}

Include a mix of: role-specific technical/skills questions based on the posting, common behavioral questions, and — if the candidate's background shows a gap or transition — one question likely to probe that. For each question, also provide a natural German phrasing of it, since German companies often conduct interviews partly or fully in German.`;

    const response = await generateWithRetry({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roleContext: {
              type: Type.STRING,
              description:
                "A 1-2 sentence summary of what kind of role and seniority this posting is for.",
            },
            generalTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "General interview-etiquette and preparation tips relevant to this specific role and German interview norms.",
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: "The interview question, in English.",
                  },
                  germanPhrasing: {
                    type: Type.STRING,
                    description:
                      "A natural German phrasing of the same question.",
                  },
                  tip: {
                    type: Type.STRING,
                    description:
                      "A specific, practical tip for answering this question well, tied to the job posting or background provided.",
                  },
                },
                required: ["question", "germanPhrasing", "tip"],
              },
              description: "6-8 likely interview questions with tips.",
            },
          },
          required: ["roleContext", "generalTips", "questions"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return Response.json(result);
  } catch (error) {
    console.error(error);
    const isOverloaded =
      error.status === 503 || error.message?.includes("overloaded");
    const message = isOverloaded
      ? "The AI service is a bit busy right now — please try again in a moment."
      : "Something went wrong generating interview prep.";
    return Response.json({ error: message }, { status: 500 });
  }
}
