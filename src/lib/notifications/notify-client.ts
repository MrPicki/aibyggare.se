// Tunn klient-helper som ber servern skapa en notis. Fire-and-forget — ska
// aldrig blockera eller fela själva handlingen (borr/kommentar/svar).
export function notify(input: {
  type: "upvote" | "comment" | "answer";
  targetType: "project" | "post";
  targetId: string;
  preview?: string;
}): void {
  try {
    void fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    /* ignorera — notiser är icke-kritiska */
  }
}
