/**
 * 폰에서 고른 날짜(+ "HH:mm" 시각)를 서버로 보낼 ISO 문자열로 변환한다.
 * 선택한 값은 폰 현지 시각이므로 현지 시각으로 Date를 만든 뒤 UTC ISO로 바꾼다.
 * (예: 한국에서 10/25 14:00 → "2026-10-25T05:00:00.000Z")
 *
 * 예전에는 현지 시각 숫자에 그대로 `Z`를 붙여 보내서 한국 기준 9시간이 밀려 저장됐다.
 */
export function localDateTimeToISO(date: Date, time?: string): string {
  const [hh, mm] = time
    ? time.split(":").map((v) => Number(v) || 0)
    : [date.getHours(), date.getMinutes()];
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hh ?? 0,
    mm ?? 0,
    0,
    0,
  ).toISOString();
}
