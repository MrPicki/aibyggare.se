import type { XpEventType } from "@/lib/xp/levels";

export interface GrantResponse {
  granted: boolean;
  totalXp: number;
  level: number;
  previousLevel: number;
  leveledUp: boolean;
}

// Anropar server-routen som delar ut XP. Beloppet bestäms server-side av
// event-typen — klienten skickar bara VILKEN händelse som inträffat.
export async function grantXpClient(
  eventType: XpEventType,
): Promise<GrantResponse | null> {
  try {
    const res = await fetch("/api/xp/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType }),
    });
    if (!res.ok) return null;
    return (await res.json()) as GrantResponse;
  } catch {
    return null;
  }
}
