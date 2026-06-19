/** README.md — 채팅 REST / Socket 스펙 기준 */

export type ChatRoomKind = "COFFEE" | "ANNOUNCEMENT";

/** 목록 `peer`는 README상 `profileImgUrl`; 클라이언트는 스네이크/카멜 병합 */
export type ChatPeerSummary = {
  userId: string;
  nickname?: string;
  activityName?: string;
  profileImageUrl?: string;
  profileImgUrl?: string;
};

export type ChatRoomListItem = {
  id: string;
  kind: ChatRoomKind;
  post?: { postId?: string; title?: string } | null;
  peer?: ChatPeerSummary | null;
  lastMessage?: { content?: string | null; createdAt?: string } | null;
  createdAt?: string;
};

export type ChatRoomsPage = {
  items: ChatRoomListItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type ChatMessageDto = {
  id: string;
  chatRoomId: string;
  userId: string;
  content: string | null;
  createdAt: string;
};

export type ChatMessagesPage = {
  items: ChatMessageDto[];
  total: number;
  page: number;
  limit: number;
};

export type CreateCoffeeRoomBody = { peerUserId: string };
export type CreateAnnouncementRoomBody = {
  postId: string;
  applicantUserId?: string;
};
