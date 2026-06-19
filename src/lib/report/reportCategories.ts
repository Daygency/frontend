import type { ReportCategory } from "../apis/report/types";

export const REPORT_CATEGORY_OPTIONS: {
  value: ReportCategory;
  label: string;
}[] = [
  { value: "HATE_OR_SLUR", label: "혐오/욕설 표현" },
  { value: "SPAM", label: "스팸/도배" },
  { value: "HARMFUL_TO_YOUTH", label: "청소년 유해" },
  { value: "ILLEGAL", label: "불법정보 포함" },
  { value: "OBSCENE", label: "음란물" },
  { value: "OFFENSIVE", label: "불쾌한 표현" },
];
