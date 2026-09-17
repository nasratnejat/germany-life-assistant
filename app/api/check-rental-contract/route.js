import { NextResponse } from "next/server";
import { Type } from "@google/genai";
import { generateJSON, friendlyError } from "@/lib/gemini";

const schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    depositAmount: { type: Type.STRING },
    depositAssessment: { type: Type.STRING },
    noticePeriod: { type: Type.STRING },
    flaggedClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
    standardClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendation: { type: Type.STRING },
  },
  required: ["summary", "flaggedClauses", "standardClauses", "recommendation"],
};

export async function POST(req) {
  try {
    const { contractText } = await req.json();

    if (!contractText || !contractText.trim()) {
      return NextResponse.json(
        { error: "Please paste your rental contract text." },
        { status: 400 },
      );
    }

    const prompt = `You are a German rental law assistant. Analyze the following Mietvertrag (rental contract) text and identify anything unusual or worth double-checking, using general German tenancy law (BGB Mietrecht) as reference.

Contract text:
"""
${contractText}
"""

Respond with:
- summary: a short 1-2 sentence overview of the contract type and key terms.
- depositAmount: the stated deposit (Kaution) amount if mentioned, or "Not specified" if not found.
- depositAssessment: whether the deposit is within the legal cap (max 3 months' cold rent / Kaltmiete) based on what's stated, or a note if it can't be determined.
- noticePeriod: the notice period (Kündigungsfrist) stated in the contract, or "Not specified".
- flaggedClauses: an array of specific clauses or terms that are unusual, potentially unenforceable under German law, or worth the tenant double-checking. Be specific.
- standardClauses: an array of clauses that are standard and generally fine, so the tenant knows what NOT to worry about.
- recommendation: a short, practical recommendation for the tenant.

If the text doesn't look like a rental contract at all, say so in the summary and leave the other arrays empty.`;

    const result = await generateJSON(prompt, schema);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: friendlyError(
          error,
          "Something went wrong analyzing your contract. Please try again.",
        ),
      },
      { status: 500 },
    );
  }
}
