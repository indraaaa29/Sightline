import { NextResponse } from "next/server";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `You are a strict document comparison engine for Sightline Legal Advisor.
Your job is to compare Version A and Version B of a document and extract meaningful, substantive changes.

Output strictly valid JSON matching this schema exactly:
{
  "changes": [
    {
      "topic": "string",
      "versionA": { "text": "string", "pageNumber": 1 },
      "versionB": { "text": "string", "pageNumber": 1 },
      "whyItMatters": "string"
    }
  ]
}

EXTRACTION FOCUS:
- Identify meaningful changes in: payment, dates, term, renewal, termination, obligations, confidentiality, liability, indemnification, restrictions, governing law, and other material clauses.
- 'topic': A short name for what changed (e.g., "Payment", "Notice period").
- 'versionA': The exact text and page from Document A.
- 'versionB': The exact text and page from Document B.
- 'whyItMatters': A short, plain-language explanation of why this change is important.

CRITICAL RULES:
1. ONLY return valid JSON. Do not include markdown code block syntax (like \`\`\`json).
2. DO NOT fabricate changes.
3. DO NOT treat formatting differences, typographical fixes, or layout shifts as substantive changes.
4. DO NOT declare one document legally "better", "valid", or "invalid". Frame explanations objectively.
5. DO NOT invent missing sections or page numbers.
6. Only output a change if it genuinely alters the meaning or obligations of the document.
`;

export async function POST(req: Request) {
  try {
    const { documentAContext, documentBContext } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key is missing." }, { status: 500 });
    }

    if (!documentAContext || !documentAContext.pages || !documentBContext || !documentBContext.pages) {
      return NextResponse.json({ error: "Both documents must have extracted text to compare." }, { status: 400 });
    }

    // Build Context strings
    let docAText = `DOCUMENT A (${documentAContext.filename})\n`;
    for (const page of documentAContext.pages) {
      docAText += `--- PAGE ${page.pageNumber} ---\n${page.text}\n\n`;
    }

    let docBText = `DOCUMENT B (${documentBContext.filename})\n`;
    for (const page of documentBContext.pages) {
      docBText += `--- PAGE ${page.pageNumber} ---\n${page.text}\n\n`;
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Please compare the following two documents and extract the meaningful changes:\n\n${docAText}\n\n${docBText}` }
    ];

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Sightline Legal Advisor",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      return NextResponse.json({ error: "Failed to communicate with AI provider." }, { status: 502 });
    }

    const data = await response.json();
    let replyContent = data.choices?.[0]?.message?.content || "";

    // Strip markdown codeblocks if they somehow sneak in
    replyContent = replyContent.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(replyContent);
      return NextResponse.json({ changes: parsed.changes || [] });
    } catch (parseError) {
      console.error("Failed to parse JSON response:", replyContent);
      return NextResponse.json({ error: "AI returned invalid JSON format." }, { status: 500 });
    }

  } catch (error) {
    console.error("Compare API Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred during comparison." }, { status: 500 });
  }
}
