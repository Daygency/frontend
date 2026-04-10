/**
 * README: 지원서 스냅샷 JSON — 프로필 row id 없이 항목 필드만 배열로 저장.
 * (백엔드 `types/application-snapshot.types.ts` 명세와 동일한 형태)
 */

export type ApplicationSnapshotFile = {
  fileId?: string;
  url?: string;
  originalName?: string;
};

export type ApplicationSnapshotEducation = {
  description: string;
  startedAt: string;
  endedAt: string | null;
};

export type ApplicationSnapshotCareer = {
  description: string;
  startedAt: string;
  endedAt: string;
  organization?: string;
};

export type ApplicationSnapshotAward = {
  description: string;
  awardedAt: string | null;
  organization?: string;
};

export type ApplicationSnapshotCertificate = {
  description: string;
  obtainedAt: string | null;
  organization?: string;
};
