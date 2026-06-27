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
