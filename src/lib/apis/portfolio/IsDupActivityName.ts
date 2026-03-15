import { API_BASE } from "../api";

export async function isDupActivityName(
  activityName: string,
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE}/users/check-activity-name?activityName=${encodeURIComponent(activityName)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) return false;

  const data = (await response.json().catch(() => null)) as {
    available?: boolean;
  } | null;
  if (!data || typeof data.available !== "boolean") return false;

  return !data.available;
}
