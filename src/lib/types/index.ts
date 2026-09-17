export type DocumentStatus = "uploading" | "extracting" | "indexing" | "complete" | "error" | "unreadable" | "extraction_failed" | "requires_ocr" | "ocr_processing" | "ocr_failed";

export interface DocumentPage {
  pageNumber: number;
  text: string;
}

export interface Evidence {
  text: string;
  pageNumber?: number;
  sourceExcerpt?: string;
}

export interface DocumentAnalysis {
  documentType?: string;
  summary?: string;
  keyPoints?: { point: string; evidence?: Evidence }[];
  importantTerms?: { term: string; description: string; evidence?: Evidence }[];
  financialTerms?: { description: string; amount?: string; evidence?: Evidence }[];
  areasToReview?: { description: string; evidence?: Evidence }[];
  keyInformation?: { label: string; value: string; evidence?: Evidence }[];
  clauses?: { title: string; whatItSays: string; summary: string; whyItMatters: string; riskLevel: "low" | "medium" | "high"; evidence?: Evidence }[];
  obligations?: { description: string; party: string; deadline?: string; conditions?: string; evidence?: Evidence }[];
  risks?: { concern: string; severity: "low" | "medium" | "high"; whatItSays: string; whyItMatters: string; whatToReview: string; evidence?: Evidence }[];
  inconsistencies?: { topic: string; whyItDeservesReview: string; provision1: { text: string; evidence?: Evidence }; provision2: { text: string; evidence?: Evidence } }[];
  checklist?: { title: string; explanation?: string; priority?: "low" | "medium" | "high"; evidence?: Evidence; relatedClause?: string }[];
  reviewPrep?: {
    keyPoints: string[];
    questionsToAsk: { question: string; evidence?: Evidence }[];
    areasToDiscuss: string[];
    informationToGather: string[];
    unresolvedItems: { issue: string; explanation: string; evidence?: Evidence }[];
  };
  importantDates?: { date: string; description: string; evidence?: Evidence }[];
  parties?: { name: string; role: string; evidence?: Evidence }[];
  actionItems?: { description: string; assignee?: string; evidence?: Evidence }[];
}

export interface UploadedDocument {
  id: string;
  filename: string;
  size: number;
  status: DocumentStatus;
  pageCount?: number;
  pages?: DocumentPage[];
  extractionMethod?: "pdf" | "ocr";
  analysisStatus?: "idle" | "analyzing" | "complete" | "error" | "partial";
  analysis?: DocumentAnalysis;
}

export type MessageRole = "user" | "agent";
export type MessageType = "text" | "comparison" | "checklist" | "excerpt" | "error" | "upload_progress";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  metadata?: any;
}
