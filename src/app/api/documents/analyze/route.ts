import { NextResponse } from "next/server";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// ~100k tokens safety limit for standard fast models
const CHARACTER_LIMIT = 400000; 

const SYSTEM_PROMPT = `You are the Sightline Legal Advisor Document Intelligence system.
Your job is to analyze the provided legal or professional document and return a structured JSON representation of its intelligence.

You must return a JSON object matching this structure exactly (omit optional fields if not found):

{
  "documentType": "string",
  "summary": "string",
  "keyPoints": [{ "point": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }],
  "importantTerms": [{ "term": "string", "description": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }],
  "financialTerms": [{ "description": "string", "amount": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }],
  "areasToReview": [{ "description": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }],
  "keyInformation": [{ "label": "string", "value": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }],
  "clauses": [{ "title": "string", "whatItSays": "string", "summary": "string", "whyItMatters": "string", "riskLevel": "low" | "medium" | "high", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }],
  "obligations": [{ "description": "string", "party": "string", "deadline": "string", "conditions": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }],
  "risks": [{ "concern": "string", "severity": "low" | "medium" | "high", "whatItSays": "string", "whyItMatters": "string", "whatToReview": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }],
  "inconsistencies": [{ "topic": "string", "whyItDeservesReview": "string", "provision1": { "text": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }, "provision2": { "text": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } } }],
  "checklist": [{ "title": "string", "explanation": "string", "priority": "low" | "medium" | "high", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" }, "relatedClause": "string" }],
  "reviewPrep": {
    "keyPoints": ["string"],
    "questionsToAsk": [{ "question": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }],
    "areasToDiscuss": ["string"],
    "informationToGather": ["string"],
    "unresolvedItems": [{ "issue": "string", "explanation": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }]
  },
  "importantDates": [{ "date": "string", "description": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }],
  "parties": [{ "name": "string", "role": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }],
  "actionItems": [{ "description": "string", "assignee": "string", "evidence": { "text": "string", "pageNumber": 1, "sourceExcerpt": "string" } }]
}

EXTRACTION FOCUS:
Actively look for the following fields if they exist in the document:
- Overview (store in 'documentType' and 'summary'): Identify exactly what the document is and write a short, plain-language summary of its core purpose.
- Key Points (store in 'keyPoints'): Extract 3-5 of the most important takeaways from the document.
- Important Terms (store in 'importantTerms'): Define jargon or defined terms that materially impact the document.
- Financial Terms (store in 'financialTerms'): Extract payment structures, fees, or monetary obligations.
- Areas to Review (store in 'areasToReview'): High-level flags or considerations.
- ADAPTIVE CONSTRAINT: Adapt your extraction to the actual document type. Do not force irrelevant fields. If a document (like a Resume) does not have financial terms, leave 'financialTerms' empty. Do not invent missing information.
- Parties (store in 'parties')
- Effective Date, End Date, Renewal Date, Payment Deadlines (store in 'importantDates')
- Key Facts (store in 'keyInformation'): Depending on the document type, extract important factual datapoints. Payment Amounts, Notice Periods, Contract Duration, Addresses, Governing Law, Important Identifiers.
- Clauses (store in 'clauses'): Actively identify termination, payment, confidentiality, liability, indemnification, intellectual property, renewal, non-compete, dispute resolution, governing law, termination penalties, obligations, and warranties.
  * 'whatItSays': a brief, objective description of the clause.
  * 'summary': a plain-language explanation.
  * 'whyItMatters': why the user should care (risks, impacts).
- Obligations (store in 'obligations'): Identify who must do what, by when, and under what conditions. Look for payment obligations, notice/delivery requirements, confidentiality, and reporting requirements.
  * 'party': Preserve the document's terminology (e.g., "Company", "Employee", "Tenant", "Party A").
  * 'deadline': When it must be done (if specified).
  * 'conditions': Triggers or prerequisites (if specified).
- Potential Concerns (store in 'risks'): Look for document-supported issues such as unusually broad obligations, automatic renewal, unclear termination requirements, significant penalties, unusual payment conditions, broad liability provisions, indemnification language, restrictive clauses, conflicting provisions, missing information, ambiguous wording, unusually long notice requirements, and provisions that materially differ from surrounding terms.
  * 'concern': Title of the potential concern.
  * 'whatItSays': What the document actually states.
  * 'whyItMatters': Why it matters (the risk).
  * 'whatToReview': Actionable advice on what to review or verify.
  * IMPORTANT: This is NOT a legal judgment engine. Do not state that something is illegal, invalid, or unenforceable. If uncertain about severity, use "medium" ("Needs review"). Use conservative criteria.
- Inconsistencies (store in 'inconsistencies'): Find places where different parts of the SAME document appear inconsistent, contradictory, or difficult to reconcile (e.g. different dates, different payment amounts, conflicting notice periods, contradictory obligations).
  * 'topic': The subject of the inconsistency (e.g. "Payment terms", "Notice period").
  * 'whyItDeservesReview': Plain language explanation of why these appear to conflict. Use non-judgmental language like "These provisions appear different". Do not declare the contract broken or invalid.
  * 'provision1': The first provision's text and location/evidence.
  * 'provision2': The second provision's text and location/evidence.
  * IMPORTANT: Do not assume every difference is a contradiction. Do not flag identical repeated clauses. Always preserve both sides of the comparison in provision1 and provision2 to maintain proof.
- Action Checklist (store in 'checklist'): Generate actionable review items based ONLY on the document (e.g., "Verify payment terms", "Review termination requirements").
  * Frame items safely as review prompts ("Consider reviewing...", "Confirm that...") rather than providing definitive legal instructions. Do not generate irrelevant items.
  * 'title': Short action title.
  * 'explanation': Why this needs review.
  * 'priority': "low", "medium", or "high".
  * 'relatedClause': Name of the related clause.
- Review Preparation (store in 'reviewPrep'): Turn the analysis into a preparation package for a user to consult a licensed professional.
  * IMPORTANT LEGAL BOUNDARY: Do NOT provide definitive legal advice, predict outcomes, or recommend litigation. Use phrases like "Consider asking...", "May be worth discussing...".
  * 'keyPoints': Summarize the most important takeaways from the document for the review.
  * 'questionsToAsk': Generate questions for the lawyer grounded in the text (e.g. "What happens if this termination clause is triggered?").
  * 'areasToDiscuss': List high-level topics (e.g. "Liability", "Termination").
  * 'informationToGather': Suggest supporting docs the user should bring (e.g. "Previous communications", "Related schedules").
  * 'unresolvedItems': Flag ambiguities or missing information in the document itself.

RULES:
1. ONLY return valid JSON. Do not include markdown code block syntax (like \`\`\`json) in your response, just return the raw JSON object.
2. DO NOT fabricate or guess information. If a field like 'clauses' or 'risks' does not exist in the document, return an empty array for it.
3. Every piece of intelligence should ideally have an 'evidence' object attached to it.
4. The 'sourceExcerpt' MUST be an exact, word-for-word quote from the provided text. Do NOT hallucinate quotes.
5. Pay close attention to the "--- PAGE X ---" markers to provide accurate pageNumbers.`;

export async function POST(req: Request) {
  try {
    const { documentContext } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key is missing." }, { status: 500 });
    }

    if (!documentContext || !documentContext.pages || !Array.isArray(documentContext.pages)) {
      return NextResponse.json({ error: "Invalid document context provided." }, { status: 400 });
    }

    let fullText = "";
    let isPartial = false;

    for (const page of documentContext.pages) {
      const pageText = `--- PAGE ${page.pageNumber} ---\n${page.text}\n\n`;
      if (fullText.length + pageText.length > CHARACTER_LIMIT) {
        isPartial = true;
        break;
      }
      fullText += pageText;
    }

    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Please analyze the following document:\n\nFilename: ${documentContext.filename}\n\nDocument Text:\n${fullText}` }
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
        max_tokens: 8192,
        messages: formattedMessages,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error during analysis:", errorText);
      return NextResponse.json({ error: "Failed to communicate with AI provider." }, { status: 502 });
    }

    const data = await response.json();
    let replyContent = data.choices?.[0]?.message?.content;
    
    if (!replyContent) {
      return NextResponse.json({ error: "Empty response from AI." }, { status: 502 });
    }

    // Sometimes models still return markdown backticks even with JSON format requested
    replyContent = replyContent.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

    let analysisResult;
    try {
      analysisResult = JSON.parse(replyContent);
    } catch (e) {
      console.error("Failed to parse JSON analysis:", replyContent);
      return NextResponse.json({ error: "Failed to parse AI JSON response." }, { status: 502 });
    }

    return NextResponse.json({ 
      analysis: analysisResult,
      status: isPartial ? "partial" : "complete" 
    });

  } catch (error) {
    console.error("Analysis API Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
