import type { ChatPeerSummary } from "../apis/chat/types";

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

/** 백엔드가 쓸 수 있는 프로필 이미지 필드명 (얕은 객체) */
const IMAGE_KEYS = [
  "profileImageUrl",
  "profile_image_url",
  "profileImgUrl",
  "profile_img_url",
  "avatarUrl",
  "avatar_url",
  "avatar",
  "thumbnailUrl",
  "thumbnail_url",
  "imageUrl",
  "image_url",
  "photoUrl",
  "photo_url",
] as const;

/**
 * 객체에서 프로필 이미지 URL 추출 (중첩 user/profile 등)
 */
export function pickProfileImageUrlDeep(obj: unknown): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const rec = asRecord(obj);
  for (const k of IMAGE_KEYS) {
    const v = rec[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  for (const nest of ["user", "profile", "member", "receiver", "sender", "peer"]) {
    const child = rec[nest];
    if (child && typeof child === "object") {
      const found = pickProfileImageUrlDeep(child);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * 채팅방 목록/상세 한 줄에서 peer 정보 병합 (필드명·위치 차이 대응)
 */
export function mergePeerFromRoomRow(r: Record<string, unknown>): ChatPeerSummary | null {
  const sources: unknown[] = [
    r.peer,
    r.counterpart,
    r.otherUser,
    r.other_user,
    r.receiver,
    r.receiverUser,
    r.receiver_user,
    r.member,
    r.chatPartner,
    r.chat_partner,
  ].filter((x) => x != null && typeof x === "object");

  let userId = "";
  let nickname: string | undefined;
  let activityName: string | undefined;
  let profileImageUrl: string | undefined;

  for (const src of sources) {
    const p = asRecord(src);
    const uid = String(p.userId ?? p.user_id ?? "").trim();
    if (uid && !userId) userId = uid;
    if (!nickname && typeof p.nickname === "string" && p.nickname.trim())
      nickname = p.nickname.trim();
    if (!activityName) {
      const an =
        typeof p.activityName === "string"
          ? p.activityName
          : typeof p.activity_name === "string"
            ? p.activity_name
            : undefined;
      if (an?.trim()) activityName = an.trim();
    }
    if (!profileImageUrl) profileImageUrl = pickProfileImageUrlDeep(p);
  }

  if (!userId) {
    userId = String(
      r.peerUserId ??
        r.peer_user_id ??
        r.receiverId ??
        r.receiver_id ??
        r.counterpartUserId ??
        "",
    ).trim();
  }

  if (!profileImageUrl) profileImageUrl = pickProfileImageUrlDeep(r);

  if (!userId) return null;

  return {
    userId,
    nickname,
    activityName,
    profileImageUrl,
  };
}
