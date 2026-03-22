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
      : peer?.nickname ?? peer?.activityName ?? "채팅";
  const handle =
    peer?.activityName ??
    peer?.nickname ??
    (peerUserId ? peerUserId.slice(0, 8) : "user");
  const peerAvatarUrl = resolveProfileImageUrlForDisplay(
    peer?.profileImageUrl,
  );
  return {
    chatRoomId: room.id,
    peerUserId,
    name,
    handle,
    isOnline: false,
    ...(peerAvatarUrl ? { peerAvatarUrl } : {}),
  };
}
