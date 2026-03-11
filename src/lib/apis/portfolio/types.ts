export type UserRole = "admin" | "user";

export type EducationEntry = {
  id: string;
  description: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
};

export type CareerEntry = {
  id: string;
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