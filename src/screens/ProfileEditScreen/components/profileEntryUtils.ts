import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

export {
  formatPeriod,
  formatYearMonth,
} from "../../../lib/profile/profileEntryDates";

export const newProfileEntryId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

type EntryWithId = { id: string; description: string };

/** 학력·경력·수상·자격증 목록의 추가/수정/삭제 공통 로직 */
export function useProfileEntryList<T extends EntryWithId>(
  setList: Dispatch<SetStateAction<T[]>>,
  createEmpty: () => T,
) {
  const update = useCallback(
    (id: string, updates: Partial<T>) => {
      setList((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, ...updates } : entry,
        ),
      );
    },
    [setList],
  );

  const remove = useCallback(
    (id: string) => {
      setList((prev) => prev.filter((entry) => entry.id !== id));
    },
    [setList],
  );

  const add = useCallback(() => {
    setList((prev) => {
      const hasDraft = prev.some((entry) => !entry.description.trim());
      if (hasDraft) return prev;
      return [...prev, createEmpty()];
    });
  }, [setList, createEmpty]);

  return { update, remove, add };
}

export function createEmptyEducationEntry(): import("../../../lib/apis/portfolio/types").EducationEntry {
  return {
    id: newProfileEntryId(),
    description: "",
    startYear: "",
    startMonth: "",
    endYear: "",
    endMonth: "",
    isOngoing: false,
  };
}

export function createEmptyCareerEntry(): import("../../../lib/apis/portfolio/types").CareerEntry {
  return {
    id: newProfileEntryId(),
    description: "",
    startYear: "",
    startMonth: "",
    endYear: "",
    endMonth: "",
    isOngoing: false,
  };
}

export function createEmptyAwardEntry(): import("../../../lib/apis/portfolio/types").AwardEntry {
  return {
    id: newProfileEntryId(),
    description: "",
    year: "",
    month: "",
  };
}

export function createEmptyCertificateEntry(): import("../../../lib/apis/portfolio/types").CertificateEntry {
  return {
    id: newProfileEntryId(),
    description: "",
    year: "",
    month: "",
  };
}
