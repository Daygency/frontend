import type {
  ProfileResponseDto,
  PublicProfileResponseDto,
} from "../apis/portfolio/types";

type ProfileLike =
  | ProfileResponseDto
  | PublicProfileResponseDto
  | null
  | undefined;

export type ProfileMajorTagLabels = {
  major?: string;
  detail?: string;
};

export function getProfileMajorTagLabels(
  profile: ProfileLike,
): ProfileMajorTagLabels {
  if (!profile) return {};

  let major: string | undefined;
  const majorValue = profile.major;

  if (majorValue && typeof majorValue === "object" && "name" in majorValue) {
    major = String(majorValue.name ?? "").trim() || undefined;
  } else if (typeof majorValue === "string" && majorValue.trim()) {
    major = majorValue.trim();
  }

  const detail = String(
    (profile as ProfileResponseDto).majorDetail ??
      (profile as { major_detail?: string | null }).major_detail ??
      "",
  ).trim();

  return {
    ...(major ? { major } : {}),
    ...(detail ? { detail } : {}),
  };
}

/** @deprecated use getProfileMajorTagLabels */
export function getProfileMajorTags(profile: ProfileLike): string[] {
  const { major, detail } = getProfileMajorTagLabels(profile);
  return [major, detail].filter((tag): tag is string => Boolean(tag));
}
