import { pickProfileImageUrlDeep } from "../chat/peerImageFields";
import type { CommunityListItem } from "../apis/community/types";

export function pickCommunityAuthor(item: CommunityListItem): string {
  const u = item.user;
  if (!u || typeof u !== "object") return "알수없음";
  const r = u as Record<string, unknown>;
  const activity =
    typeof r.activityName === "string"
      ? r.activityName
      : typeof r.activity_name === "string"
        ? r.activity_name
        : "";
  const nick = typeof r.name === "string" ? r.name : "";
  return activity.trim() || nick.trim() || "알수없음";
}

export function pickCommunityProfileImgUrl(
  item: CommunityListItem,
): string | undefined {
  return pickProfileImageUrlDeep(item.user);
}
