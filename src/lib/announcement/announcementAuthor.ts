export type AnnouncementAuthorInfo = {
  activityName?: string | null;
  profileImgUrl?: string | null;
  name?: string | null;
};

function pickString(...vals: unknown[]): string | undefined {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function pickNullableString(...vals: unknown[]): string | null | undefined {
  for (const v of vals) {
    if (v === null) return null;
    if (typeof v === "string") return v;
  }
  return undefined;
}

import { pickUserNickname } from "../user/pickUserNickname";

export function pickAnnouncementAuthorFromRaw(
  raw: unknown,
): AnnouncementAuthorInfo | null {
  const row = raw as Record<string, unknown>;
  const userVal = row.user;
  if (userVal && typeof userVal === "object") {
    const u = userVal as Record<string, unknown>;
    return {
      activityName: pickString(u.activityName, u.activity_name),
      profileImgUrl: pickNullableString(u.profileImgUrl, u.profile_img_url),
      name: pickString(u.name),
    };
  }
  const activityName = pickString(
    row.authorActivityName,
    row.author_activity_name,
    row.activityName,
    row.activity_name,
  );
  const name = pickString(row.authorName, row.author_name);
  const profileImgUrl = pickNullableString(
    row.authorProfileImgUrl,
    row.author_profile_img_url,
    row.profileImgUrl,
    row.profile_img_url,
  );
  if (!activityName && !name && profileImgUrl === undefined) return null;
  return { activityName, name, profileImgUrl };
}

export function resolveAnnouncementAuthorLabel(
  author?: AnnouncementAuthorInfo | null,
): string {
  if (!author) return "작성자";
  return pickUserNickname({
    activityName: author.activityName,
    name: author.name,
  });
}
