import { resolveProfileImageUrlForDisplay } from "../chat/resolveProfileImageUrl";

/** README `AttachmentItem` / 레거시 `file` 객체에서 이미지 URL 추출 */
export function resolveAttachmentImgUrl(
  raw: string | null | undefined,
): string | undefined {
  return resolveProfileImageUrlForDisplay(raw ?? undefined);
}

/** 백엔드·ORM별 필드명 차이 대응 (imgUrl, fileUrl, imageUrl …) */
function pickRawUrlFromObject(o: Record<string, unknown>): string | undefined {
  const keys = [
    "imgUrl",
    "img_url",
    "url",
    "fileUrl",
    "file_url",
    "imageUrl",
    "image_url",
    "publicUrl",
    "public_url",
    "cdnUrl",
    "cdn_url",
  ] as const;
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return undefined;
}

/** `{ imgUrl?, img_url?, url? }` + 레거시/백엔드 별칭 */
export function pickUrlFromFileLike(
  file: Record<string, unknown> | null | undefined,
): string | undefined {
  if (!file || typeof file !== "object") return undefined;
  const raw = pickRawUrlFromObject(file);
  return raw ? resolveAttachmentImgUrl(raw) : undefined;
}

/** README `attachments[]` — 첫 장 URL (상세·목록 폴백) */
export function pickFirstAttachmentImgUrl(attachments: unknown): string | undefined {
  if (!Array.isArray(attachments) || attachments.length === 0) return undefined;
  const first = attachments[0];
  if (!first || typeof first !== "object") return undefined;
  const raw = pickRawUrlFromObject(first as Record<string, unknown>);
  return raw ? resolveAttachmentImgUrl(raw) : undefined;
}

/** 상세 본문 아래 갤러리용 — 전체 이미지 URL */
export function mapAttachmentsToImageUrls(attachments: unknown): string[] {
  if (!Array.isArray(attachments)) return [];
  const out: string[] = [];
  for (const item of attachments) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const raw = pickRawUrlFromObject(o);
    const u = raw ? resolveAttachmentImgUrl(raw) : undefined;
    if (u) out.push(u);
  }
  return out;
}
