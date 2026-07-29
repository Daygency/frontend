import type { ChatRoomListItem } from "../apis/chat/types";
import type { ChatRoomParams } from "../../screens/ChatScreens/ChatRoomScreen/ChatRoomScreen";
import { resolveProfileImageUrlForDisplay } from "./resolveProfileImageUrl";

export function chatRoomItemToParams(room: ChatRoomListItem): ChatRoomParams {
  const isGroup = room.kind === "GROUP";
  const peer = room.peer;
  const peerUserId = peer?.userId ?? "";
  const titleFromPost = room.post?.title;
  const name =
    isGroup && titleFromPost
      ? titleFromPost
      : (peer?.name ?? peer?.activityName ?? "채팅");
  const handle = isGroup
    ? ""
    : (peer?.activityName ??
      peer?.name ??
      (peerUserId ? peerUserId.slice(0, 8) : "user"));
  const peerAvatarUrl = isGroup
    ? undefined
    : resolveProfileImageUrlForDisplay(
        peer?.profileImageUrl ?? peer?.profileImgUrl,
      );
  const members = isGroup
    ? (room.members ?? []).map((m) => ({
        userId: m.userId,
        name: m.name,
        activityName: m.activityName,
        profileImageUrl: resolveProfileImageUrlForDisplay(
          m.profileImageUrl ?? m.profileImgUrl,
        ),
      }))
    : undefined;
  return {
    chatRoomId: room.id,
    peerUserId,
    name,
    handle,
    isOnline: false,
    isGroup,
    postId: room.post?.postId,
    ...(peerAvatarUrl ? { peerAvatarUrl } : {}),
    ...(members ? { members } : {}),
  };
}
