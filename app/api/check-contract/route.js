import { Type } from "@google/genai";
import { generateJSON, friendlyError } from "../../../lib/gemini";

export async function POST(request) {
  try {
    const { contractText } = await request.json();

    const prompt = `You are reviewing a German employment contract (Arbeitsvertrag) for a non-lawyer employee. Check it against common German employment law norms and flag anything unusual or worth questioning, such as: a probation period (Probezeit) longer than 6 months, a notice period (Kündigungsfrist) during probation longer than 2 weeks, vacation days (Urlaubstage) below the legal minimum of 20 days for a 5-day work week (24 for a 6-day week), a non-compete clause (nachvertragliches Wettbewerbsverbot) with no compensation payment specified (these are only enforceable with compensation, usually at least 50% of last salary), unclear or missing overtime (Überstunden) compensation terms, unusually long fixed-term duration or unclear renewal terms, unclear salary payment date or unusually vague job description, and any clause that looks like it could be void under German law (e.g. waiving statutory minimum notice periods).

Also note standard or favorable terms found in the contract.

Contract text:
"""
${contractText}
"""`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        assessment: {
          type: Type.STRING,
          description:
            'Overall assessment: exactly "looks standard", "some concerns", or "significant concerns".',
        },
        summary: {
          type: Type.STRING,
          description:
            "A 2-3 sentence plain-English summary of the overall assessment.",
        },
        keyTerms: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: {
                type: Type.STRING,
                description:
                  'e.g. "Probezeit", "Kündigungsfrist", "Urlaubstage", "Gehalt", "Arbeitszeit".',
              },
              value: {
                type: Type.STRING,
                description:
                  "The actual value found in the contract for this term.",
              },
            },
            required: ["label", "value"],
          },
          description:
            "The key terms found in the contract, extracted directly from its text.",
        },
        redFlags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "Specific things worth questioning or having checked, based on the actual contract content.",
        },
        goodPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "Specific standard or favorable terms found in the contract.",
        },
        recommendation: {
          type: Type.STRING,
          description:
            "One short, practical next step for this specific contract.",
        },
      },
      required: [
        "assessment",
        "summary",
        "keyTerms",
        "redFlags",
        "goodPoints",
        "recommendation",
      ],
    };

    const result = await generateJSON(prompt, schema);
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error: friendlyError(
          error,
          "Something went wrong checking your contract.",
        ),
      },
      { status: 500 },
    );
  }
}
