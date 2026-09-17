import { Type } from "@google/genai";
import { generateJSON, friendlyError } from "../../../lib/gemini";

export async function POST(request) {
  try {
    const {
      currentRent,
      proposedRent,
      increasePercent,
      cap,
      monthsSinceLastIncrease,
      letterText,
    } = await request.json();

    const prompt = `You are checking a German rent increase letter (Mieterhöhungsverlangen under §558 BGB) for a tenant. Here's the context:

Current rent: €${currentRent}
Proposed new rent: €${proposedRent}
Increase: ${increasePercent}%
Applicable Kappungsgrenze (legal cap) for this area: ${cap}% per 3-year period
${monthsSinceLastIncrease ? `Months since last increase: ${monthsSinceLastIncrease}` : ""}

The letter must, to be formally valid: be in text form and clearly state the new rent amount; justify the increase using at least one accepted method — reference to a Mietspiegel (local rent index), comparison to at least three comparable apartments (Vergleichswohnungen), a rent database (Mietdatenbank), or an expert appraisal (Gutachten); and if there are multiple landlords, be signed/sent by all of them (or clearly on behalf of all).

Justification text from the letter:
"""
${letterText}
"""

Check whether the letter's justification method is one of the accepted ones and whether it's applied clearly, and flag anything missing, vague, or that looks legally insufficient. Also factor in the numeric context given above (whether the increase exceeds the cap, and the waiting period if given).`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        assessment: {
          type: Type.STRING,
          description:
            'Overall assessment: exactly "looks valid", "questionable", or "likely invalid".',
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
            "Specific problems found with this rent increase letter or its justification.",
        },
        goodPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Specific things this letter does correctly.",
        },
        recommendation: {
          type: Type.STRING,
          description:
            "One short, practical next step — e.g. whether to consent, object, or seek advice from a Mieterverein.",
        },
      },
      required: [
        "assessment",
        "summary",
        "issues",
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
          "Something went wrong checking this rent increase.",
        ),
      },
      { status: 500 },
    );
  }
}
