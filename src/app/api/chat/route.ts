import { NextResponse } from "next/server";
import { ChatMessage } from "@/lib/types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `You are the Sightline Legal Advisor. 
Your purpose is to help users understand legal and important documents in clear, plain language.

You should:
- Explain document language clearly
- Summarize provisions when asked
- Answer questions based on the provided document context
- Distinguish document facts from general explanations
- Avoid pretending to be a lawyer
- Avoid claiming attorney-client privilege
- Avoid claiming to provide legal representation
- Encourage professional legal review for consequential matters

CRITICAL RULES:
1. Never claim that information came from a document unless the relevant document content was actually provided in the request.
2. If document content is unavailable, say so rather than guessing. Example: "I don't currently have access to the document's actual text, but generally speaking..."
3. Never fabricate clauses, quotations, sections, page numbers, obligations, risks, or other document-specific facts.
4. If you use provided document context, ground your answers strictly in that context. When quoting the document, quote only text actually present in the supplied document.
5. Do not claim to have analyzed pages or sections that were not provided.
6. When the document does not contain enough information to answer the question, explicitly say that the available document content is insufficient.
7. Always maintain the boundary: "Sightline provides information, not legal advice." Never present unsupported legal conclusions as definitive.

ANSWER FORMAT:
When appropriate, structure your answer clearly using Markdown:

**Answer**
[plain-language answer]

**What the document says**
[document-grounded evidence, with page/section numbers if available]

**In practical terms**
[explanation]

**Worth reviewing**
[optional - only if there are specific concerns or caveats]`;

export async function POST(req: Request) {
  try {
    const { messages, documentContext } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key is missing. Please configure OPENROUTER_API_KEY." },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array." }, { status: 400 });
    }

    // Format messages for OpenRouter
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Inject document context if available, otherwise clarify it's missing.
    if (documentContext && documentContext.filename) {
      if (documentContext.pages && Array.isArray(documentContext.pages) && documentContext.pages.length > 0) {
        let fullDocumentText = `Document Name: ${documentContext.filename}\n`;
        fullDocumentText += `Total Pages: ${documentContext.pageCount || documentContext.pages.length}\n`;
        
        if (documentContext.extractionMethod === "ocr") {
          fullDocumentText += `EXTRACTION METHOD: OCR\n\n`;
        } else {
          fullDocumentText += `\n`;
        }
        
        let rawText = "";
        for (const page of documentContext.pages) {
          rawText += `--- PAGE ${page.pageNumber} ---\n${page.text}\n\n`;
        }

        if (rawText.length > 35000) {
           formattedMessages.push({
             role: "system",
             content: `The user has uploaded a document named "${documentContext.filename}". This document was successfully extracted, but it is too large for the current direct-analysis mode. Sightline needs document retrieval support to analyze the full document reliably. DO NOT pretend to have analyzed the document. If the user asks about it, explicitly explain that it is too large for full direct analysis right now.`
           });
        } else {
           fullDocumentText += rawText;
           
           let instructions = `The user has uploaded the following document context. You MUST use this exact text to answer document-specific questions. \n\n${fullDocumentText}`;
           
           if (documentContext.extractionMethod === "ocr") {
             instructions += `\n\nCRITICAL OCR INSTRUCTIONS:\n`;
             instructions += `- This text was extracted using OCR and may contain recognition errors.\n`;
             instructions += `- Be cautious with names, dates, amounts, section numbers, negations, and legal terminology.\n`;
             instructions += `- Do not invent text that OCR did not provide.\n`;
             instructions += `- Do not invent page numbers.\n`;
             instructions += `- If the answer depends on text that appears unclear or missing due to poor OCR quality, say so.\n`;
           }
           
           formattedMessages.push({
             role: "system",
             content: instructions
           });
        }
      } else {
        formattedMessages.push({
          role: "system",
          content: `The user has uploaded a document named: "${documentContext.filename}". However, the actual text extraction of this document is currently unavailable or the document contained no readable text. Do not invent contents for this document.`
        });
      }
    }

    // Append history
    formattedMessages.push(
      ...messages.map((m: ChatMessage) => ({
        role: m.role === "agent" ? "assistant" : "user",
        content: m.content,
      }))
    );

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter rankings
        "X-Title": "Sightline Legal Advisor", 
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        messages: formattedMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      return NextResponse.json(
        { error: "Failed to communicate with the AI provider." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const replyContent = data.choices?.[0]?.message?.content || "I received an empty response.";

    return NextResponse.json({ content: replyContent });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing the chat." },
      { status: 500 }
    );
  }
}
