import { ChatMessage, UploadedDocument } from "../types";

const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const uploadDocument = async (
  file: File,
  onProgress: (status: UploadedDocument["status"]) => void
): Promise<UploadedDocument> => {
  // MOCK — replace with real API call
  onProgress("uploading");
  await mockDelay(1000);
  
  onProgress("extracting");
  await mockDelay(1500);
  
  onProgress("indexing");
  await mockDelay(1500);
  
  onProgress("complete");
  return {
    id: Math.random().toString(36).substr(2, 9),
    filename: file.name,
    size: file.size,
    status: "complete",
  };
};

export const getSummary = async (documentId: string): Promise<string> => {
  // MOCK — replace with real API call
  await mockDelay(1000);
  return "This is a summary of the uploaded document. It looks like a standard lease agreement.";
};

export const sendChatMessage = async (message: string, contextId?: string): Promise<ChatMessage> => {
  // MOCK — replace with real API call
  await mockDelay(1500); // Simulate thinking
  
  const text = message.toLowerCase();
  
  if (text.includes("compare")) {
    return {
      id: Date.now().toString(),
      role: "agent",
      content: "Here is a comparison of the clauses.",
      type: "comparison",
      metadata: {
        docA: { name: "Original Lease", clause: "The tenant shall pay rent on the 1st of the month." },
        docB: { name: "New Lease", clause: "The tenant shall pay rent on the 5th of the month." },
        explanation: "The due date has been shifted from the 1st to the 5th, giving you a longer grace period."
      }
    };
  }

  if (text.includes("checklist")) {
    return {
      id: Date.now().toString(),
      role: "agent",
      content: "Here are the things you should prepare.",
      type: "checklist",
      metadata: {
        items: [
          "Review the updated rent escalation clause",
          "Confirm the exact move-in date",
          "Check the pet deposit terms"
        ]
      }
    };
  }

  if (text.includes("risk") || text.includes("unusual")) {
    return {
      id: Date.now().toString(),
      role: "agent",
      content: "I found this clause which might be unusual.",
      type: "excerpt",
      metadata: {
        clause: "Tenant agrees to cover all structural repairs during the term of the lease.",
        highlight: "cover all structural repairs",
        plainLanguage: "You are responsible for fixing major building issues (like a roof), which is highly unusual for a residential lease.",
        riskLevel: "high"
      }
    };
  }
  
  if (text.includes("error") || text.includes("nothing")) {
    return {
      id: Date.now().toString(),
      role: "agent",
      content: "I don't see anything in this document that answers that. You may want to check the original file or ask something more specific.",
      type: "error"
    };
  }

  // Default text response
  return {
    id: Date.now().toString(),
    role: "agent",
    content: "Based on the document, standard residential lease terms apply. Let me know if you want to compare it to another document or review a checklist.",
    type: "text",
    metadata: {
      clause: "The premises shall be used strictly for residential purposes.",
      highlight: "residential purposes",
      plainLanguage: "You cannot run a business out of this apartment."
    }
  };
};

export const compareDocuments = async (doc1Id: string, doc2Id: string) => {
  // MOCK — replace with real API call
  await mockDelay(2000);
  return { success: true };
};

export const exportBrief = async () => {
  // MOCK — replace with real API call
  await mockDelay(800);
  return { success: true };
};
