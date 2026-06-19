import { useState, useEffect } from "react";
import { getUserPublicProfile } from "../apis/portfolio/profileApi";
import { resolveProfileImageUrlForDisplay } from "./resolveProfileImageUrl";

/**
 * 목록/채팅방에 이미지 URL이 없거나 상대 경로일 때
 * `GET /users/:id/profile`로 보조 조회
 */
export function usePeerAvatarUrl(
  peerUserId: string | undefined,
  initialUrl: string | undefined,
): string | undefined {
  const [url, setUrl] = useState<string | undefined>(() =>
    resolveProfileImageUrlForDisplay(initialUrl),
  );

  useEffect(() => {
    setUrl(resolveProfileImageUrlForDisplay(initialUrl));
  }, [initialUrl]);

  useEffect(() => {
    const fromList = resolveProfileImageUrlForDisplay(initialUrl);
    if (fromList) return;
    const id = peerUserId?.trim();
    if (!id) return;

    let cancelled = false;
    (async () => {
      const profile = await getUserPublicProfile(id);
      if (cancelled) return;
      const raw = profile?.profileImgUrl?.trim();
      if (!raw) return;
      setUrl(resolveProfileImageUrlForDisplay(raw));
    })();
    return () => {
      cancelled = true;
    };
  }, [peerUserId, initialUrl]);

  return url;
}
