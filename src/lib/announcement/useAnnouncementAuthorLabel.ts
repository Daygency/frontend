import { useEffect, useMemo, useState } from "react";
import { getMyProfile, getUserPublicProfile } from "../apis/portfolio/profileApi";
import type { AnnouncementAuthor } from "./extractAnnouncementAuthor";
import { pickUserNickname } from "../user/pickUserNickname";

type UseAnnouncementAuthorLabelOptions = {
  /** 본인 글 — 공개 프로필 API 대신 내 프로필 API 사용 (비공개 설정이어도 표시) */
  isViewerAuthor?: boolean;
};

/**
 * 활동 아이디(activityName) 우선, 없으면 프로필 이름. userId는 표시하지 않음.
 */
export function useAnnouncementAuthorLabel(
  author: AnnouncementAuthor | null,
  options?: UseAnnouncementAuthorLabelOptions,
): string {
  const isViewerAuthor = options?.isViewerAuthor ?? false;
  const [fromProfile, setFromProfile] = useState<{
    name?: string;
    activityName?: string;
  } | null>(null);

  useEffect(() => {
    setFromProfile(null);
    if (!author?.userId?.trim()) return;
    const uid = author.userId.trim();
    const hasActivity = Boolean(author.activityName?.trim());
    const hasNick = Boolean(author.name?.trim());
    if (hasActivity && hasNick) return;

    let cancelled = false;
    const loadProfile = async () => {
      if (isViewerAuthor) {
        return getMyProfile();
      }
      try {
        return await getUserPublicProfile(uid);
      } catch {
        return null;
      }
    };

    void loadProfile().then((p) => {
      if (cancelled || !p) return;
      const n = p.name?.trim();
      const act = p.activityName?.trim();
      if (n || act) {
        setFromProfile({
          name: n || undefined,
          activityName: act || undefined,
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [author?.userId, author?.name, author?.activityName, isViewerAuthor]);

  return useMemo(() => {
    if (!author) return "";
    return pickUserNickname({
      activityName:
        author.activityName?.trim() ||
        fromProfile?.activityName?.trim() ||
        undefined,
      name: author.name?.trim() || fromProfile?.name?.trim() || undefined,
    });
  }, [author, fromProfile]);
}
