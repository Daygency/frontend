import { pickProfileImageUrlDeep } from "../chat/peerImageFields";
import { pickReportedUserIdFromUnknown } from "../report/pickReportedUserId";

export type AnnouncementAuthor = {
  userId: string;
  name?: string;
  activityName?: string;
  profileImgUrl?: string;
};

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function pickNameFromRecord(rec: Record<string, unknown>): string | undefined {
  const keys = [
    "name",
    "nick_name",
    "displayName",
    "display_name",
    "nickName",
  ] as const;
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  for (const nest of ["profile", "member", "social"]) {
    const child = rec[nest];
    if (child && typeof child === "object") {
      const n = pickNameFromRecord(child as Record<string, unknown>);
      if (n) return n;
    }
  }
  return undefined;
}

/**
 * GET /announcement/:id 응답에서 작성자(기획자) 정보 추출.
 * README: `user` 관계가 로드될 수 있음 — 필드명·중첩 차이 보강.
 */
export function extractAnnouncementAuthorFromDetail(
  d: Record<string, unknown>,
): AnnouncementAuthor | null {
  const candidates: unknown[] = [
    d.user,
    d.publisher,
    d.author,
    d.producer,
    d.writer,
    d.postedBy,
    d.posted_by,
    d.owner,
  ];

  for (const c of candidates) {
    const p = asRecord(c);
    if (!Object.keys(p).length) continue;
    const uid = pickReportedUserIdFromUnknown(c)?.trim();
    if (!uid) continue;
    const activityName =
      typeof p.activityName === "string"
        ? p.activityName.trim() || undefined
        : typeof p.activity_name === "string"
          ? p.activity_name.trim() || undefined
          : undefined;
    const name =
      pickNameFromRecord(p) ??
      (typeof p.name === "string" ? p.name.trim() || undefined : undefined);
    const profileImgUrl =
      pickProfileImageUrlDeep(p) ??
      (typeof p.profileImgUrl === "string"
        ? p.profileImgUrl
        : typeof p.profile_img_url === "string"
          ? p.profile_img_url
          : undefined);

    return {
      userId: uid,
      name,
      activityName,
      profileImgUrl: profileImgUrl?.trim() || undefined,
    };
  }

  const rootUid =
    pickReportedUserIdFromUnknown(d)?.trim() ||
    String(
      d.userId ??
        d.user_id ??
        d.publisherUserId ??
        d.publisher_user_id ??
        d.authorUserId ??
        d.author_user_id ??
        "",
    ).trim();
  if (rootUid) {
    const img = pickProfileImageUrlDeep(d);
    return {
      userId: rootUid,
      profileImgUrl: img?.trim() || undefined,
    };
  }

  return null;
}
