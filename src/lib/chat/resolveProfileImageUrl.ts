import { API_BASE } from "../apis/api";

/**
 * 채팅/목록용 프로필 이미지 URL (상대 경로 → API_BASE, http → https)
 */
export function resolveProfileImageUrlForDisplay(
  uri: string | undefined | null,
): string | undefined {
  let u = uri?.trim();
  if (!u) return undefined;
  if (u.startsWith("/")) u = `${API_BASE}${u}`;
  if (u.startsWith("http://")) u = u.replace("http://", "https://");
  return u;
}
