import type {
  ProfileResponseDto,
  PublicProfileResponseDto,
} from "../apis/portfolio/types";
import {
  formatPeriodFromApiItem,
  formatYearMonth,
  formatYearMonthFromApiDate,
  getAwardEntrySortKey,
  getCertificateEntrySortKey,
  getPeriodEntrySortKey,
  sortByRecentDesc,
} from "./profileEntryDates";

export type ProfileDisplayEntry = {
  description: string;
  period?: string;
};

export type ProfileDetailSections = {
  education: ProfileDisplayEntry[];
  career: ProfileDisplayEntry[];
  awards: ProfileDisplayEntry[];
  certificates: ProfileDisplayEntry[];
};

type ProfileLike = ProfileResponseDto | PublicProfileResponseDto;

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function buildEntry(
  description: string,
  period?: string,
): ProfileDisplayEntry | null {
  const desc = description.trim();
  const per = period?.trim();
  if (!desc && !per) return null;
  if (desc && per) return { description: desc, period: per };
  return { description: desc || per! };
}

function legacyStringEntries(value: unknown): ProfileDisplayEntry[] {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((description) => ({ description }));
}

function parsePeriodEntries(
  arr: unknown[],
  ongoingLabel: string,
): ProfileDisplayEntry[] {
  return arr
    .map((item) => {
      const raw = item as { description?: string };
      const description = String(raw?.description ?? "").trim();
      const period =
        formatPeriodFromApiItem(
          item as Parameters<typeof formatPeriodFromApiItem>[0],
          { ongoingLabel },
        ) || undefined;
      return buildEntry(description, period);
    })
    .filter((entry): entry is ProfileDisplayEntry => entry !== null);
}

function parseAwardEntries(arr: unknown[]): ProfileDisplayEntry[] {
  return arr
    .map((item) => {
      const raw = item as {
        description?: string;
        awardedAt?: string | Date | null;
        year?: string | number;
        month?: string | number;
      };
      const description = String(raw?.description ?? "").trim();
      const period =
        formatYearMonthFromApiDate(raw?.awardedAt) ||
        formatYearMonth(String(raw?.year ?? ""), String(raw?.month ?? "")) ||
        undefined;
      if (!period) {
        return description ? { description } : null;
      }
      return buildEntry(description, period);
    })
    .filter((entry): entry is ProfileDisplayEntry => entry !== null);
}

function parseCertificateEntries(arr: unknown[]): ProfileDisplayEntry[] {
  return arr
    .map((item) => {
      const raw = item as {
        description?: string;
        obtainedAt?: string | Date | null;
        year?: string | number;
        month?: string | number;
      };
      const description = String(raw?.description ?? "").trim();
      const date =
        formatYearMonthFromApiDate(raw?.obtainedAt) ||
        formatYearMonth(String(raw?.year ?? ""), String(raw?.month ?? ""));
      const period = date ? `취득 ${date}` : undefined;
      return buildEntry(description, period);
    })
    .filter((entry): entry is ProfileDisplayEntry => entry !== null);
}

function mergeWithLegacy(
  parsed: ProfileDisplayEntry[],
  legacy: unknown,
): ProfileDisplayEntry[] {
  return parsed.length > 0 ? parsed : legacyStringEntries(legacy);
}

function pickList(profile: Record<string, unknown>, ...keys: string[]): unknown[] {
  for (const key of keys) {
    const arr = asArray(profile[key]);
    if (arr.length > 0) return arr;
  }
  return [];
}

/** 프로필 API 응답 → 상세 화면(학력/경력/수상/자격증) 섹션 데이터 */
export function getProfileDetailSections(
  profile: ProfileLike | null,
): ProfileDetailSections {
  if (!profile) {
    return { education: [], career: [], awards: [], certificates: [] };
  }

  const p = profile as ProfileResponseDto & PublicProfileResponseDto;

  const educationList = pickList(p, "educationEntries", "educations");
  const careerList = pickList(p, "careerEntries", "careers");
  const awardList = pickList(p, "awardEntries", "awards");
  const certList = pickList(p, "certificateEntries", "certificates");

  return {
    education: mergeWithLegacy(
      parsePeriodEntries(
        sortByRecentDesc(
          educationList as Parameters<typeof getPeriodEntrySortKey>[0][],
          getPeriodEntrySortKey,
        ),
        "재학 중",
      ),
      p.education,
    ),
    career: mergeWithLegacy(
      parsePeriodEntries(
        sortByRecentDesc(
          careerList as Parameters<typeof getPeriodEntrySortKey>[0][],
          getPeriodEntrySortKey,
        ),
        "재직 중",
      ),
      p.career,
    ),
    awards: mergeWithLegacy(
      parseAwardEntries(
        sortByRecentDesc(
          awardList as Parameters<typeof getAwardEntrySortKey>[0][],
          getAwardEntrySortKey,
        ),
      ),
      p.awards,
    ),
    certificates: parseCertificateEntries(
      sortByRecentDesc(
        certList as Parameters<typeof getCertificateEntrySortKey>[0][],
        getCertificateEntrySortKey,
      ),
    ),
  };
}
