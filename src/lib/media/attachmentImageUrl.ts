import { resolveProfileImageUrlForDisplay } from "../chat/resolveProfileImageUrl";

/** README `AttachmentItem` / 레거시 `file` 객체에서 이미지 URL 추출 */
export function resolveAttachmentImgUrl(
  raw: string | null | undefined,
): string | undefined {
  return resolveProfileImageUrlForDisplay(raw ?? undefined);
}

/** `{ imgUrl?, img_url?, url? }` */
export function pickUrlFromFileLike(
  file: Record<string, unknown> | null | undefined,
): string | undefined {
  if (!file || typeof file !== "object") return undefined;
  const u =
    (typeof file.imgUrl === "string" && file.imgUrl) ||
    (typeof file.img_url === "string" && file.img_url) ||
    (typeof file.url === "string" && file.url);
  return u ? resolveAttachmentImgUrl(u) : undefined;
}

/** README `attachments[]` — 첫 장 URL (상세·목록 폴백) */
export function pickFirstAttachmentImgUrl(attachments: unknown): string | undefined {
  if (!Array.isArray(attachments) || attachments.length === 0) return undefined;
  const first = attachments[0];
  if (!first || typeof first !== "object") return undefined;
  const o = first as Record<string, unknown>;
  const raw =
    (typeof o.imgUrl === "string" && o.imgUrl) ||
    (typeof o.img_url === "string" && o.img_url) ||
    (typeof o.url === "string" && o.url);
  return raw ? resolveAttachmentImgUrl(raw) : undefined;
}

/** 상세 본문 아래 갤러리용 — 전체 이미지 URL */
export function mapAttachmentsToImageUrls(attachments: unknown): string[] {
  if (!Array.isArray(attachments)) return [];
  const out: string[] = [];
  for (const item of attachments) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const raw =
      (typeof o.imgUrl === "string" && o.imgUrl) ||
      (typeof o.img_url === "string" && o.img_url) ||
      (typeof o.url === "string" && o.url);
    const u = raw ? resolveAttachmentImgUrl(raw) : undefined;
    if (u) out.push(u);
  }
  return out;
}
