import type { AnnouncementAuthor } from "./extractAnnouncementAuthor";

function pickNonEmpty(...values: Array<string | undefined | null>): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

/** 상세 API·내 프로필·로그인 정보를 합쳐 작성자 표시용 필드를 채운다. */
export function mergeAnnouncementDetailAuthor(
  extracted: AnnouncementAuthor | null,
  fallback: {
    userId: string;
    activityName?: string | null;
    name?: string | null;
    profileImgUrl?: string | null;
  },
): AnnouncementAuthor {
  const userId = pickNonEmpty(extracted?.userId, fallback.userId) ?? fallback.userId;
  return {
    userId,
    activityName: pickNonEmpty(extracted?.activityName, fallback.activityName),
    name: pickNonEmpty(extracted?.name, fallback.name),
    profileImgUrl: pickNonEmpty(extracted?.profileImgUrl, fallback.profileImgUrl),
  };
}
