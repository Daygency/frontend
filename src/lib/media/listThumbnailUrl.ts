import type { CommunityListItem } from "../apis/community/types";
import type { NewsListItem } from "../apis/news/types";
import { resolveProfileImageUrlForDisplay } from "../chat/resolveProfileImageUrl";
import {
  mapAttachmentsToImageUrls,
  pickFirstAttachmentImgUrl,
  pickUrlFromFileLike,
} from "./attachmentImageUrl";

/**
 * 목록 API의 `thumbnailUrl` / 레거시 `imageUrl` 등 — 표시용 절대 URL
 * (상대경로 → API_BASE, http → https)
 */
export function normalizeListThumbnailUrl(
  uri: string | null | undefined,
): string | undefined {
  return resolveProfileImageUrlForDisplay(uri ?? undefined);
}

/** GET /news 목록 항목 — README: `thumbnailUrl` 우선 */
export function pickNewsListThumbnailUrl(item: NewsListItem): string | undefined {
  const direct = normalizeListThumbnailUrl(
    item.thumbnailUrl ?? item.imageUrl ?? undefined,
  );
  if (direct) return direct;
  const fromAtt = pickFirstAttachmentImgUrl(item.attachments);
  if (fromAtt) return fromAtt;
  return item.file ? pickUrlFromFileLike(item.file) : undefined;
}

/** GET /community 목록 항목 — README: `thumbnailUrl`, 없으면 `attachments`/`file` */
export function pickCommunityListThumbnailUrl(
  item: CommunityListItem,
): string | undefined {
  const direct = normalizeListThumbnailUrl(
    item.thumbnailUrl ??
      (item as CommunityListItem & { imageUrl?: string }).imageUrl ??
      undefined,
  );
  if (direct) return direct;
  const fromAtt = pickFirstAttachmentImgUrl(
    (item as CommunityListItem & { attachments?: unknown }).attachments,
  );
  if (fromAtt) return fromAtt;
  return item.file ? pickUrlFromFileLike(item.file as Record<string, unknown>) : undefined;
}

/** GET /community 목록 항목 — 목록 카드용 갤러리 이미지 전체 (여러 장 첨부 지원) */
export function pickCommunityListImageUrls(item: CommunityListItem): string[] {
  const fromAttachments = mapAttachmentsToImageUrls(
    (item as CommunityListItem & { attachments?: unknown }).attachments,
  );
  if (fromAttachments.length > 0) return fromAttachments;
  const single = pickCommunityListThumbnailUrl(item);
  return single ? [single] : [];
}
