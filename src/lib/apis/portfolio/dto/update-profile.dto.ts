import { UserRole } from "../types";

export type Education = {
  educationId?: string;
  description: string;
  startedAt?: string | null;
  endedAt?: string | null;
  isOngoing?: boolean;
};

export type Career = {
  careerId?: string;
  description: string;
  startedAt?: string | null;
  endedAt?: string | null;
  isOngoing?: boolean;
};

export type Award = {
  description: string;
  awardedAt?: string | null;
};

export type Certificate = {
  certificateId?: string;
  description: string;
  obtainedAt?: string | null;
};

export type ProfileUpdateRequestDto = {
  nickname?: string;
  activityName?: string;
  aboutMe?: string;
  selfIntroduction?: string;
  role?: UserRole;
  email?: string;
  phoneNumber?: string;
  artTempo?: number;
  profileImgUrl?: string;
  isEmailSubscribed?: boolean;
  isPushEnabled?: boolean;
  isPortfolioPrivate?: boolean;
  socialId?: string;
  educations?: Education[];
  careers?: Career[];
  awards?: Award[];
  majorId?: number | null;
  majorDetail?: string;
  certificates?: Certificate[];
};
