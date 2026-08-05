import { getAnnouncementDetail } from "../apis/announcement/announcementApi";
import {
  mapAttachmentsToImageUrls,
  pickUrlFromFileLike,
} from "../media/attachmentImageUrl";

/** 공고 단체 채팅방 헤더용 — 공고에 등록된 첫 번째 사진 URL (없으면 null) */
export async function getAnnouncementFirstImageUrl(
  postId: string,
): Promise<string | null> {
  const raw = await getAnnouncementDetail(postId);
  if (!raw) return null;

  const fromAttachments = mapAttachmentsToImageUrls(
    raw.files ?? raw.attachments,
  );
  if (fromAttachments.length > 0) return fromAttachments[0];

  const fileObj = raw.file;
  const fileLike =
    fileObj && typeof fileObj === "object"
      ? (fileObj as Record<string, unknown>)
      : null;
  const fromSingleFile = pickUrlFromFileLike(fileLike);
  return fromSingleFile ?? null;
}
