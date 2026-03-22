/**
 * 백엔드 File 엔티티 JSON (README: camelCase)
 * DB 컬럼 `order` → API `sortOrder`, `extention` 오타 그대로
 */
export type FileTargetType = "announcement" | "news" | "community";

export type ApiFile = {
  fileId: string;
  imgUrl: string;
  originalName: string;
  sortOrder: number;
  storedName: string;
  extention: string;
  targetType: FileTargetType | null;
  targetId: string | null;
  createdAt: string;
};
