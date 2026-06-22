import { useEffect, useMemo, useState } from "react";
import { getUserPublicProfile } from "../apis/portfolio/profileApi";
import type { AnnouncementAuthor } from "./extractAnnouncementAuthor";

/**
 * 활동명(@) 우선, 없으면 이름. 둘 다 없으면 공개 프로필로 보강 후에도 없을 때만 userId.
 */
export function useAnnouncementAuthorLabel(
  author: AnnouncementAuthor | null,
): string {
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
    if (hasActivity || hasNick) return;

    let cancelled = false;
    void getUserPublicProfile(uid).then((p) => {
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
  }, [author?.userId, author?.name, author?.activityName]);

  return useMemo(() => {
    if (!author) return "";
    const activity =
      author.activityName?.trim() ||
      fromProfile?.activityName?.trim() ||
      "";
    const nick =
      author.name?.trim() ||
      fromProfile?.name?.trim() ||
      "";
    if (activity) return `@${activity}`;
    if (nick) return nick;
    return author.userId;
  }, [author, fromProfile]);
}
