import type { ApiFile, FileTargetType } from "./types";

const TARGET_TYPES: FileTargetType[] = ["announcement", "news", "community"];

function asTargetType(v: unknown): FileTargetType | null {
  if (typeof v !== "string") return null;
  return TARGET_TYPES.includes(v as FileTargetType) ? (v as FileTargetType) : null;
}

/** 업로드/목록 응답 JSON을 ApiFile 로 정규화 (camelCase · snake_case) */
export function parseApiFile(raw: unknown): ApiFile | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const fileId = String(
    o.fileId ?? o.file_id ?? o.id ?? "",
  ).trim();
  if (!fileId) return null;

  const imgUrl = String(o.imgUrl ?? o.img_url ?? o.url ?? "");
  const sortRaw = o.sortOrder ?? o.sort_order ?? o.order ?? 0;
  const sortOrder =
    typeof sortRaw === "number"
      ? sortRaw
      : parseInt(String(sortRaw), 10) || 0;

  return {
    fileId,
    imgUrl,
    originalName: String(o.originalName ?? o.original_name ?? ""),
    sortOrder,
    storedName: String(o.storedName ?? o.stored_name ?? ""),
    extention: String(o.extention ?? o.extension ?? ""),
    targetType: asTargetType(o.targetType ?? o.target_type),
    targetId:
      o.targetId != null || o.target_id != null
        ? String(o.targetId ?? o.target_id)
        : null,
    createdAt: String(o.createdAt ?? o.created_at ?? ""),
  };
}

export function parseApiFileList(raw: unknown): ApiFile[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseApiFile).filter((x): x is ApiFile => x != null);
}
