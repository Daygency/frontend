/** GET /notifications 인박스 항목 — README 알림 API */

export type NoticeTargetType =
  | "COMMENT"
  | "FOLLOW"
  | "APPLICATION"
  | "LIKE"
  | "REVIEW"
  | "INQUIRY";

export type NoticeLikeKind =
  | "NEWS"
  | "COMMUNITY"
  | "ANNOUNCEMENT"
  | "COMMENT";

export type InboxNoticeActor = {
  userId: string;
  nickname: string;
  activityName: string;
  profileImgUrl: string | null;
} | null;

export type InboxNotice = {
  id: string;
  targetType: NoticeTargetType;
  targetId: string;
  likeKind: NoticeLikeKind | null;
  content: string | null;
  createdAt: string;
  actor: InboxNoticeActor;
};

export type InboxRecipientItem = {
  recipientId: string;
  readAt: string | null;
  notice: InboxNotice;
};

export type InboxListResponse = {
  items: InboxRecipientItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type UnreadCountResponse = {
  unreadCount: number;
};

export type MarkAllReadResponse = {
  updated: number;
};
