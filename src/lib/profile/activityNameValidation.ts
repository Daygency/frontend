const ACTIVITY_NAME_ALPHANUMERIC_REGEX = /^[A-Za-z0-9]+$/;
const NON_ALPHANUMERIC_ACTIVITY_NAME_REGEX = /[^A-Za-z0-9]/g;

export const ACTIVITY_NAME_ALPHANUMERIC_MESSAGE =
  "활동 아이디는 영문과 숫자만 입력할 수 있습니다.";

export function sanitizeActivityName(value: string): string {
  return value.replace(NON_ALPHANUMERIC_ACTIVITY_NAME_REGEX, "");
}

export function isActivityNameAlphanumeric(value: string): boolean {
  return ACTIVITY_NAME_ALPHANUMERIC_REGEX.test(value.trim());
}
