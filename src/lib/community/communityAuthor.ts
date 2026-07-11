import { pickProfileImageUrlDeep } from "../chat/peerImageFields";
import type { CommunityListItem } from "../apis/community/types";
import { pickUserNickname } from "../user/pickUserNickname";

export function pickCommunityAuthor(item: CommunityListItem): string {
  const u = item.user;
  if (!u || typeof u !== "object") return "작성자";
  return pickUserNickname(u as Record<string, unknown>);
}

export function pickCommunityProfileImgUrl(
  item: CommunityListItem,
): string | undefined {
  return pickProfileImageUrlDeep(item.user);
}

export function pickCommunityAuthorUserId(
  item: { user?: unknown } | null | undefined,
): string | undefined {
  const user = item?.user;
  if (!user || typeof user !== "object") return undefined;
  const u = user as Record<string, unknown>;
  const id = String(
    u.userId ??
      u.user_id ??
      u.socialId ??
      u.social_id ??
      u.id ??
      u.uuid ??
      u.authorId ??
      u.author_id ??
      "",
  ).trim();
  return id || undefined;
}

export function pickCommunityAuthorActivityName(
  item: { user?: unknown } | null | undefined,
): string | undefined {
  const user = item?.user;
  if (!user || typeof user !== "object") return undefined;
  const u = user as Record<string, unknown>;
  const v = u.activityName ?? u.activity_name;
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

export function pickAuthorFromUser(
  user: Record<string, unknown> | null | undefined,
): string {
  return pickUserNickname(user);
}

export function pickProfileImgFromUser(
  user: Record<string, unknown> | null | undefined,
): string | undefined {
  return pickProfileImageUrlDeep(user);
}
