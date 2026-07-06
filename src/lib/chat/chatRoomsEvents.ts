import { DeviceEventEmitter } from "react-native";
import type { ChatFileItem } from "../apis/chat/types";

/** README: 지원서 제출 후 `GET /chat/rooms/applied` 등으로 목록 새로고침 — 리스트가 이 이벤트로 재요청 */
export const CHAT_APPLIED_ROOMS_REFRESH = "daygency:chatAppliedRoomsRefresh";

export function emitChatAppliedRoomsRefresh(): void {
  DeviceEventEmitter.emit(CHAT_APPLIED_ROOMS_REFRESH);
}

/**
 * 방 읽음 처리 직후 목록을 재요청시키는 이벤트.
 * 방에서 나가자마자(같은 탭 안 뒤로가기) 목록의 focus 재조회가
 * 읽음 처리 PATCH 완료보다 먼저 끝나버리면 안읽음 뱃지가 그대로 남는 레이스가 있어,
 * PATCH가 실제로 성공한 시점에 한 번 더 재조회시키기 위해 사용한다.
 */
export const CHAT_ROOMS_REFRESH = "daygency:chatRoomsRefresh";

export function emitChatRoomsRefresh(): void {
  DeviceEventEmitter.emit(CHAT_ROOMS_REFRESH);
}

export type ChatRoomUpdatedMessage = {
  content: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileMime?: string | null;
  fileItems?: ChatFileItem[] | null;
  createdAt: string;
};

export type ChatRoomUpdatedPayload = {
  chatRoomId: string;
  message: ChatRoomUpdatedMessage | null;
};

/**
 * 소켓으로 새 메시지가 도착했을 때(내 방 중 하나), 채팅 목록 화면이 focus
 * 재조회 없이도 방별 안읽음 수 + 마지막 메시지 미리보기를 즉시 반영하도록 쏘는 이벤트.
 * `ChatUnreadContext`의 상시 소켓 연결이 `chatUnreadChanged`를 받을 때 중계한다.
 */
export const CHAT_ROOM_UPDATED = "daygency:chatRoomUpdated";

export function emitChatRoomUpdated(payload: ChatRoomUpdatedPayload): void {
  DeviceEventEmitter.emit(CHAT_ROOM_UPDATED, payload);
}
