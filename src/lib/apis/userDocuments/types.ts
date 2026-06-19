export type UserDocumentSource =
  | "archive"
  | "application"
  | "announcement"
  | "news"
  | "community";

export type UserDocumentItem = {
  id: string;
  fileId: string | null;
  title: string;
  url: string;
  source: UserDocumentSource;
  sourceLabel: string;
  createdAt: string;
  canDelete: boolean;
};
