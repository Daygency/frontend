const ACTIVITY_NAME_ENGLISH_ONLY_REGEX = /^[A-Za-z]+$/;
const NON_ENGLISH_ACTIVITY_NAME_REGEX = /[^A-Za-z]/g;

export const ACTIVITY_NAME_ENGLISH_ONLY_MESSAGE =
  "활동 아이디는 영어만 입력할 수 있습니다.";

export function sanitizeActivityName(value: string): string {
  return value.replace(NON_ENGLISH_ACTIVITY_NAME_REGEX, "");
}

export function isActivityNameEnglishOnly(value: string): boolean {
  return ACTIVITY_NAME_ENGLISH_ONLY_REGEX.test(value.trim());
}
