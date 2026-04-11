import type { ApplicationEntity } from "../apis/application/types";
import type { ChatRoomListItem } from "../apis/chat/types";
import type { ChatRoomParams } from "../../screens/ChatScreens/ChatRoomScreen/ChatRoomScreen";
import { resolveProfileImageUrlForDisplay } from "./resolveProfileImageUrl";

export function chatRoomItemToParams(room: ChatRoomListItem): ChatRoomParams {
  const peer = room.peer;
  const peerUserId = peer?.userId ?? "";
  const titleFromPost = room.post?.title;
  const name =
    room.kind === "ANNOUNCEMENT" && titleFromPost
      ? titleFromPost
      : (peer?.nickname ?? peer?.activityName ?? "채팅");
  const handle =
    peer?.activityName ??
    peer?.nickname ??
    (peerUserId ? peerUserId.slice(0, 8) : "user");
  const peerAvatarUrl = resolveProfileImageUrlForDisplay(peer?.profileImageUrl);
  return {
    chatRoomId: room.id,
    peerUserId,
    name,
    handle,
    isOnline: false,
    ...(peerAvatarUrl ? { peerAvatarUrl } : {}),
  };
}

/** 목록 API가 `peer`를 비울 때 지원서의 `userId`로 상대 ID 보강 */
export function chatRoomItemToParamsWithApplicantFallback(
  room: ChatRoomListItem,
  application: Pick<ApplicationEntity, "userId" | "name">,
): ChatRoomParams {
  const base = chatRoomItemToParams(room);
  const fallbackUid = application.userId?.trim() ?? "";
  const peerUserId = base.peerUserId?.trim() || fallbackUid;

  const peer = room.peer;
  const titleFromPost = room.post?.title;
  const hintName = application.name?.trim() ?? "";
  const name =
    room.kind === "ANNOUNCEMENT" && titleFromPost
      ? titleFromPost
      : peer?.nickname ?? peer?.activityName ?? (hintName || base.name);
  const handle =
    peer?.activityName ??
    peer?.nickname ??
    (peerUserId ? peerUserId.slice(0, 8) : hintName.slice(0, 8) || "user");

  return {
    ...base,
    peerUserId,
    name,
    handle,
  };
}
