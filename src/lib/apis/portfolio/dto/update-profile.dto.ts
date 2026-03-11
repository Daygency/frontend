import { UserRole } from "../types";

export type Education = {
  discription: string;
  startedAt: Date;
  endedAt: Date;
};

export type Career = {
  discription: string;
  startedAt: Date;
  endedAt: Date;
};

export type Award = {
  discription: string;
  awardedAt: Date;
};

export type Certificate = {
  description: string;
  obtainedAt: Date;
};

export type ProfileUpdateRequestDto = {
  nickname: string;
  activityName: string;
  aboutMe: string;
  selfIntroduction: string;
  role: UserRole;
  email: string;
  phoneNumber: string;
  artTempo: number;
  profileImgUrl: string;
  isEmailSubscribed: boolean;
  isPushEnabled: boolean;
  socialId: string;
  educations: Education[];
  careers: Career[];
  awards: Award[];
  certificates: Certificate[];
};
