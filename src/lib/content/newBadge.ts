export const NEW_BADGE_DAYS = 1;

export function isContentNew(value?: string | Date | null): boolean {
  if (value == null || value === "") return false;
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return false;
  const diffMs = Date.now() - date.getTime();
  return diffMs >= 0 && diffMs < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000;
}

export function formatContentDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}
