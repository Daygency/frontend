import { API_BASE } from "../api";

export async function isDupActivityName(
  activityName: string,
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE}/users/search?activityName=${activityName}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) return false;

  const data = await response.json().catch(() => null);
  if (!data) return false;

  return data;
}
