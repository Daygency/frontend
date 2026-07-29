/** README.md — 채팅 REST / Socket 스펙 기준 */

export type ChatRoomKind = "COFFEE" | "GROUP";

export type ChatFileItem = {
  fileUrl: string;
  fileName: string;
  fileMime?: string | null;
};

/** 목록 `peer`는 README상 `profileImgUrl`; 클라이언트는 스네이크/카멜 병합 */
export type ChatPeerSummary = {
  userId: string;
  name?: string;
  activityName?: string;
  profileImageUrl?: string;
  profileImgUrl?: string;
};

export type ChatRoomListItem = {
  id: string;
  kind: ChatRoomKind;
  post?: { postId?: string; title?: string } | null;
  /** COFFEE(1:1)에서만 채워짐 */
  peer?: ChatPeerSummary | null;
  /** GROUP(다대다)에서만 채워짐 — 나를 제외한 멤버 전원 */
  members?: ChatPeerSummary[] | null;
  lastMessage?: {
    content?: string | null;
    fileUrl?: string | null;
    fileName?: string | null;
    fileMime?: string | null;
    fileItems?: ChatFileItem[] | null;
    createdAt?: string;
  } | null;
  /** 로그인 사용자 기준, 이 방에서 안 읽은 메시지 수 */
  unreadCount?: number;
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
  fileUrl?: string | null;
  fileName?: string | null;
  fileMime?: string | null;
  fileItems?: ChatFileItem[] | null;
  createdAt: string;
  /** 상대방이 이 메시지를 읽었는지 (1:1 기준) */
  readByPeer?: boolean;
};

export type ChatMessagesPage = {
  items: ChatMessageDto[];
  total: number;
  page: number;
  limit: number;
  /** 방 멤버십으로 확정된 상대방 ID (메시지가 없거나 상대가 답장하지 않은 방에서도 유효) */
  peerUserId: string | null;
  /** GROUP 방에서만 채워짐 — 발신자 이름/아바타 표시용 (나 제외) */
  members: ChatPeerSummary[] | null;
};

export type CreateCoffeeRoomBody = { peerUserId: string };
export type CreateAnnouncementRoomBody = {
  postId: string;
  applicantUserId?: string;
};
