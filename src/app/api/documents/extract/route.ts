import { NextResponse } from "next/server";
import { DocumentPage } from "@/lib/types";

export async function POST(req: Request) {
  if (typeof globalThis.DOMMatrix === 'undefined') {
    (globalThis as any).DOMMatrix = class DOMMatrix {};
  }
  if (typeof globalThis.Path2D === 'undefined') {
    (globalThis as any).Path2D = class Path2D {};
  }
  
  const pdf = require("pdf-parse/lib/pdf-parse.js");
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pages: DocumentPage[] = [];

    // Custom pagerender to capture individual pages securely
    const render_page = async (pageData: any) => {
      const render_options = {
        normalizeWhitespace: false,
        disableCombineTextItems: false
      };
      
      const textContent = await pageData.getTextContent(render_options);
      let lastY, text = '';
      for (let item of textContent.items) {
          if (lastY == item.transform[5] || !lastY){
              text += item.str;
          }  
          else {
              text += '\n' + item.str;
          }    
          lastY = item.transform[5];
      }
      
      pages.push({
        pageNumber: pageData.pageIndex + 1,
        text: text.trim()
      });
      
      return text;
    };

    const options = {
      pagerender: render_page
    };

    const data = await pdf(buffer, options);

    // Ensure pages are sorted sequentially
    pages.sort((a, b) => a.pageNumber - b.pageNumber);

    // Calculate total extracted length to identify scanned/image-only PDFs
    const totalTextLength = pages.reduce((acc, p) => acc + p.text.length, 0);

    // Scanned PDF heuristic
    if (totalTextLength < 50 && data.numpages > 0) {
      return NextResponse.json({
        success: true,
        filename: file.name,
        pageCount: data.numpages,
        pages: [],
        status: "requires_ocr",
        message: "Insufficient machine-readable text detected; attempting OCR."
      });
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      pageCount: data.numpages,
      pages: pages,
      status: "complete"
    });

  } catch (error: any) {
    console.error("PDF Extraction Error:", error);
    return NextResponse.json(
      { error: "Failed to extract text from PDF.", details: error.message },
      { status: 500 }
    );
  }
}
