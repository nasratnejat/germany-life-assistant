import { Type } from "@google/genai";
import { generateJSON, friendlyError } from "../../../lib/gemini";

export async function POST(request) {
  try {
    const { cvText, targetRole } = await request.json();

    const prompt = `You are reviewing a CV (Lebenslauf) against German CV conventions. Germans expect: a tabular, clearly-structured format (not a flowing narrative); reverse-chronological work and education history with no gaps left unexplained; no "objective" or "summary" statement at the top (not customary in Germany); a professional photo is still common though not mandatory; consistent, precise dates (month + year); a skills section listing language levels (e.g. "Deutsch: C1") and relevant technical skills; a signature and location/date at the bottom is traditional but increasingly optional.

${targetRole ? `The candidate is targeting a "${targetRole}" role — flag anything that seems mismatched or missing for that specifically.\n\n` : ""}CV text:
"""
${cvText}
"""`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        assessment: {
          type: Type.STRING,
          description:
            'Overall assessment: exactly "strong", "needs work", or "major issues".',
        },
        summary: {
          type: Type.STRING,
          description:
            "A 2-3 sentence plain-English summary of the overall assessment.",
        },
        issues: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "Specific things to fix, based on the actual CV content and German conventions.",
        },
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Specific things this CV already does well.",
        },
        recommendation: {
          type: Type.STRING,
          description:
            "One short, practical next step for improving this specific CV.",
        },
      },
      required: [
        "assessment",
        "summary",
        "issues",
        "strengths",
        "recommendation",
      ],
    };

    const result = await generateJSON(prompt, schema);
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: friendlyError(error, "Something went wrong checking your CV.") },
      { status: 500 },
    );
  }
}
