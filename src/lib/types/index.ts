export type DocumentStatus = "uploading" | "extracting" | "indexing" | "complete" | "error" | "unreadable" | "extraction_failed";

export interface DocumentPage {
  pageNumber: number;
  text: string;
}

export interface UploadedDocument {
  id: string;
  filename: string;
  size: number;
  status: DocumentStatus;
  pageCount?: number;
  pages?: DocumentPage[];
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
