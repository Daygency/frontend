/** 목록 셀·메시지 버블용 짧은 시간 표시 */
export function formatChatListTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const h = hours % 12 || 12;
    return `${ampm} ${h}:${minutes.toString().padStart(2, "0")}`;
  }
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}`;
}
