export type MajorOption = {
  id: number;
  label: string;
};

export const MAJOR_OPTIONS: readonly MajorOption[] = [
  { id: 1, label: "건반악기" },
  { id: 2, label: "현악" },
  { id: 3, label: "관악" },
  { id: 4, label: "성악" },
  { id: 5, label: "타악" },
  { id: 6, label: "작곡" },
  { id: 7, label: "지휘" },
  { id: 8, label: "음악학" },
  { id: 9, label: "국악" },
  { id: 10, label: "무용" },
  { id: 11, label: "실용" },
  { id: 12, label: "뮤지컬·크로스오버" },
  { id: 13, label: "기타" },
] as const;

