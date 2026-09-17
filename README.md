# Sightline Legal Advisor

Sightline is a document-grounded AI legal intelligence platform designed to help users quickly understand complex legal documents (such as NDAs, leases, and service agreements) and prepare for discussions with legal professionals.

## Chosen Vertical / Persona
**Legal.** Sightline is built for individuals and small business owners who need to review and understand legal documents before committing to them, or before seeking formal legal counsel.

## Problem Being Solved
Legal documents are often dense, long, and filled with jargon. Non-lawyers struggle to identify key obligations, risks, important dates, and inconsistencies. Sightline solves this by providing immediate, grounded analysis to highlight what matters most, helping users organize their thoughts and questions prior to speaking with a licensed legal professional.

## Solution Approach
Sightline combines client-side document processing (PDF parsing and OCR) with server-side AI reasoning using Gemini 2.5 Flash via OpenRouter. The AI acts as a sophisticated reading assistant that strictly grounds its answers in the provided text, ensuring that users receive facts from the document separated from general explanations.

## Architecture
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Document Processing**: `pdfjs-dist` (PDF text extraction), `tesseract.js` (client-side OCR)
- **AI Integration**: OpenRouter API invoking Google's `gemini-2.5-flash` model.
- **Export**: `jspdf` for client-side report generation.

## Document Processing Flow
1. **Upload**: User uploads a document (PDF).
2. **Extraction**: The client attempts to extract text using `pdfjs-dist`.
3. **Fallback OCR**: If the PDF is a scanned image with no extractable text, Sightline automatically falls back to client-side OCR using `tesseract.js`.
4. **Analysis**: Extracted text is sent to the server-side API, where structured prompts request analysis based on the document type.

## OpenRouter/Gemini Integration
Sightline uses a secure server-side API route (`/api/documents/analyze/route.ts` and `/api/chat/route.ts`) to communicate with OpenRouter. The AI model is instructed to output strictly structured JSON matching our application's expected typings, enabling rich UI experiences.

## Document-Grounded Reasoning
Every AI response is strictly tied to the uploaded document. The AI is instructed to provide the plain-language explanation alongside the exact source text ("What the document says"), complete with page numbers, ensuring high confidence and traceability.

## Main V1 Capabilities
- **Understand**: Plain-language document summary, key terms, and dates.
- **Key Information**: Highlights critical metadata (parties, financial terms).
- **Clause Explorer**: Detailed breakdown of important clauses and their risk levels.
- **Obligations**: Actionable list of who must do what, and when.
- **Risk Review**: Highlights potential concerns or aggressive terms.
- **Inconsistency Detection**: Identifies conflicting terms within the same document.
- **Action Checklist**: A generated checklist of items to verify or follow up on.
- **Review Preparation**: Organizes document findings into a structured guide for consulting a lawyer.
- **Document Comparison**: Compare differences and changes between two uploaded documents.

## Assumptions and Limitations
- **Client-Side OCR**: Processing large scanned PDFs entirely in the browser using Tesseract.js may be slow on lower-end devices.
- **AI Reliability**: AI can make mistakes. The analysis relies on LLM capabilities and should not be treated as a substitute for professional legal advice.
- **Export**: PDF export is implemented entirely client-side using `jspdf`.

## Legal Disclaimer
**Sightline provides information, not legal advice.** Sightline is an AI-powered reading assistant. It is not a law firm and does not substitute for the advice of a qualified legal professional. Always consult a lawyer before signing legally binding agreements.

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file in the root directory and add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-...
   OPENROUTER_MODEL=google/gemini-2.5-flash
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing Information
- Run `npm run build` to verify the production build succeeds without TypeScript or routing errors.
- Test with both text-based PDFs (e.g., standard digital contracts) and scanned image PDFs (to verify the Tesseract.js OCR fallback).
- Upload two documents in the comparison view to verify the comparison capabilities.
- Test the chat feature by asking specific questions about the document to ensure the AI quotes the text accurately.
