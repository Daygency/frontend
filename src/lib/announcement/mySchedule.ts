import type { MyScheduleItem, MyScheduleKind } from "../apis/announcement/announcementApi";

export const MY_SCHEDULE_KIND_LABEL: Record<MyScheduleKind, string> = {
  ACCEPTED_SCHEDULED: "합격 · 진행",
  MY_SCHEDULED: "내 공고 · 진행",
  MY_DEADLINE: "내 공고 · 마감",
  SAVED_DEADLINE: "저장 · 마감",
};

/** 진행일은 진하게, 마감일은 옅게 구분 */
export function isDeadlineKind(kind: MyScheduleKind): boolean {
  return kind === "MY_DEADLINE" || kind === "SAVED_DEADLINE";
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** 로컬 날짜 기준 키 (YYYY-MM-DD) */
export function scheduleDayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** "10월 25일 (토)" */
export function formatScheduleDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`;
}

/** "오늘" / "내일" / "D-3" */
export function scheduleRelativeDay(iso: string, now = new Date()): string {
  const diff = Math.round(
    (startOfDay(new Date(iso)).getTime() - startOfDay(now).getTime()) / 86_400_000,
  );
  if (diff <= 0) return "오늘";
  if (diff === 1) return "내일";
  return `D-${diff}`;
}

/** "오후 2:00" */
export function formatScheduleTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h < 12 ? "오전" : "오후"} ${h % 12 === 0 ? 12 : h % 12}:${m}`;
}

export type MyScheduleSection = {
  key: string;
  dayLabel: string;
  relative: string;
  data: MyScheduleItem[];
};

/** 서버가 날짜순으로 준 목록을 날짜별 섹션으로 묶는다 */
export function groupScheduleByDay(items: MyScheduleItem[]): MyScheduleSection[] {
  const sections: MyScheduleSection[] = [];
  for (const item of items) {
    const key = scheduleDayKey(item.date);
    const last = sections[sections.length - 1];
    if (last && last.key === key) {
      last.data.push(item);
    } else {
      sections.push({
        key,
        dayLabel: formatScheduleDay(item.date),
        relative: scheduleRelativeDay(item.date),
        data: [item],
      });
    }
  }
  return sections;
}
