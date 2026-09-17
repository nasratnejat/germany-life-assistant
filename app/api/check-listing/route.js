import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { listingText, city, price } = await request.json();

    const context = [
      city ? `City: ${city}` : null,
      price ? `Advertised monthly rent: €${price}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `You are helping someone in Germany check a rental apartment listing for common scam patterns. Analyze the listing text and any landlord messages below for known German rental-scam red flags, such as: price significantly below market rate for the area, landlord claiming to be currently abroad or unavailable to meet in person, requests to pay a deposit or first month's rent before viewing the apartment or signing a contract, requests for payment via wire transfer, gift cards, or unusual payment methods, urgency/pressure tactics ("many people interested, decide now"), poor or inconsistent grammar mixed with oddly formal language, requests for personal documents (passport, ID) very early with no clear reason, no option for an in-person or verified video viewing, and mismatched contact details.

${context ? context + "\n\n" : ""}Listing text and messages:
"""
${listingText}
"""

Also note any genuinely reassuring signs if present (e.g. willing to meet in person, has a real Hausverwaltung/Makler, normal pricing, standard contract terms).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: {
              type: Type.STRING,
              description:
                'Overall assessment: "low", "medium", or "high" scam risk.',
            },
            summary: {
              type: Type.STRING,
              description:
                "A 2-3 sentence plain-English summary of the overall assessment.",
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "Specific scam-pattern red flags found in this listing/text, based on its actual content.",
            },
            goodSigns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "Specific reassuring signs found in this listing/text, if any.",
            },
            recommendation: {
              type: Type.STRING,
              description:
                "One short, practical piece of advice for this specific situation.",
            },
          },
          required: [
            "riskLevel",
            "summary",
            "redFlags",
            "goodSigns",
            "recommendation",
          ],
        },
      },
    });

    const result = JSON.parse(response.text);
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Something went wrong analyzing this listing." },
      { status: 500 },
    );
  }
}
