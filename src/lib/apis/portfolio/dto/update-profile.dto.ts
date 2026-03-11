import { UserRole } from "../types";

export type Education = {
  description: string;
  startedAt: Date;
  endedAt: Date;
};

export type Career = {
  description: string;
  startedAt: Date;
  endedAt: Date;
};

export type Award = {
  description: string;
  awardedAt: Date;
};

export type Certificate = {
  description: string;
  obtainedAt: Date;
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
  socialId?: string;
  educations?: Education[];
  careers?: Career[];
  awards?: Award[];
  majorId?: number | null;
  majorDetail?: string;
  certificates?: Certificate[];
};
