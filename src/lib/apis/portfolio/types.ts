export type UserRole = "admin" | "user";

export type EducationEntry = {
  id: string;
  educationId?: string; // 백엔드 ID - 기존 항목 수정 시에만 있음
  description: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  isOngoing?: boolean;
};

export type CareerEntry = {
  id: string;
  careerId?: string;
  description: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  isOngoing?: boolean;
};

export type AwardEntry = {
  id: string;
  description: string;
  year: string;
  month: string;
};

export type CertificateEntry = {
  id: string;
  certificateId?: string;
  description: string;
  year: string;
  month: string;
  fileUri?: string;
  fileName?: string;
};

export type ProfileResponseDto = {
  profileImgUrl: string;
  coverImgUrl?: string;
  name: string | null;
  activityName?: string;
  role: UserRole;
  aboutMe: string;
  selfIntroduction?: string;
  major?: string | { majorId: string; name: string } | null;
  majorDetail?: string;
  education: string | null;
  career: string | null;
  awards: string | null;
  educationEntries?: EducationEntry[];
  careerEntries?: CareerEntry[];
  awardEntries?: AwardEntry[];
  certificateEntries?: CertificateEntry[];
  contact: {
    email: string;
    phoneNumber: string;
  };
  /** 내 프로필 API가 내려주는 경우 */
  userId?: string;
  followerCount?: number;
  followingCount?: number;
  isPortfolioPrivate?: boolean;
};

/** GET /users/:id/profile — 공개 프로필 (연락처 없음) */
export type PublicProfileResponseDto = {
  userId: string;
  profileImgUrl: string;
  coverImgUrl?: string;
  name: string | null;
  activityName: string;
  role: string;
  aboutMe: string;
  selfIntroduction: string;
  educations: unknown[] | null;
  careers: unknown[] | null;
  awards: unknown[] | null;
  certificates?: unknown[] | null;
  major: { majorId: string; name: string } | null;
  majorDetail?: string | null;
  followerCount?: number;
  followingCount?: number;
  /**
   * 로그인한 조회자 기준 팔로우 여부 (백엔드가 내려줄 때)
   */
  isFollowing?: boolean;
};