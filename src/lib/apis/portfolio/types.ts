export type UserRole = "admin" | "user";

export type EducationEntry = {
  id: string;
  educationId?: string; // 백엔드 ID - 기존 항목 수정 시에만 있음
  description: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
};

export type CareerEntry = {
  id: string;
  careerId?: string;
  description: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
};

export type AwardEntry = {
  id: string;
  description: string;
  year: string;
  month: string;
};

export type CertificateEntry = {
  id: string;
  description: string;
  year: string;
  month: string;
  fileUri?: string;
  fileName?: string;
};

export type ProfileResponseDto = {
  profileImgUrl: string;
  nickname: string;
  activityName?: string;
  role: UserRole;
  aboutMe: string;
  selfIntroduction?: string;
  major?: string;
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
};