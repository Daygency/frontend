import { DeviceEventEmitter } from "react-native";

/** README: 지원서 제출 후 `GET /chat/rooms/applied` 등으로 목록 새로고침 — 리스트가 이 이벤트로 재요청 */
export const CHAT_APPLIED_ROOMS_REFRESH = "daygency:chatAppliedRoomsRefresh";

export function emitChatAppliedRoomsRefresh(): void {
  DeviceEventEmitter.emit(CHAT_APPLIED_ROOMS_REFRESH);
}
