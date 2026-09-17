import jsPDF from "jspdf";

export interface PDFOptions {
  documentName: string;
  reportTitle: string;
  sections: {
    title?: string;
    content: string[];
  }[];
}

export function generatePDFReport(options: PDFOptions) {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;
    let y = margin;

    // Header: Sightline Legal Advisor
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(166, 124, 58); // Muted gold (#A67C3A)
    doc.text("SIGHTLINE LEGAL ADVISOR", margin, y);
    y += 8;

    // Document Name
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(82, 97, 107); // Slate (#52616B)
    
    // Handle long document names
    const docNameLines = doc.splitTextToSize(`Document: ${options.documentName}`, maxLineWidth);
    doc.text(docNameLines, margin, y);
    y += (docNameLines.length * 5) + 6;

    // Report Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(23, 33, 31); // Deep ink (#17211F)
    doc.text(options.reportTitle, margin, y);
    y += 15;

    // Content Sections
    doc.setFontSize(11);
    
    options.sections.forEach(section => {
      // Add a page if we are close to the bottom
      if (y > 250) {
        doc.addPage();
        y = margin;
      }

      if (section.title) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(23, 33, 31);
        doc.text(section.title, margin, y);
        y += 7;
      }

      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);

      section.content.forEach(line => {
        // Split text to fit within page width
        const splitText = doc.splitTextToSize(line, maxLineWidth);
        
        // Check if block fits on current page
        const blockHeight = splitText.length * 5;
        if (y + blockHeight > 270) {
          doc.addPage();
          y = margin;
        }

        doc.text(splitText, margin, y);
        y += (splitText.length * 5) + 3; // 5 units per line + 3 units spacing between paragraphs
      });
      
      y += 5; // Extra spacing between sections
    });

    // Legal Disclaimer Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      const footerText = "Sightline provides information, not legal advice.";
      doc.text(footerText, pageWidth / 2, 285, { align: "center" });
    }

    // Save
    doc.save(`Sightline_${options.reportTitle.replace(/\s+/g, "_")}.pdf`);
  } catch (error) {
    console.error("PDF Generation failed", error);
    alert("Failed to generate PDF. Please try again.");
  }
}
