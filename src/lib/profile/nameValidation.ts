const NAME_VALID_REGEX = /^[A-Za-z0-9가-힣]+$/;
const NON_VALID_NAME_REGEX = /[^A-Za-z0-9가-힣]/g;

export const NAME_SPECIAL_CHAR_MESSAGE =
  "이름에는 특수문자를 사용할 수 없습니다.";

export function sanitizeName(value: string): string {
  return value.replace(NON_VALID_NAME_REGEX, "");
}

export function isNameValid(value: string): boolean {
  return NAME_VALID_REGEX.test(value.trim());
}
