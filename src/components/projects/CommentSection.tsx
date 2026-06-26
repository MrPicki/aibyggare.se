"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle } from "lucide-react";
import { addComment, subscribeToComments } from "@/lib/firebase/projects-client";
import { notify } from "@/lib/notifications/notify-client";
import type { Comment } from "@/types/firestore";

interface CommentSectionProps {
  projectId: string;
  initialComments: Comment[];
}

export function CommentSection({ projectId, initialComments }: CommentSectionProps) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Real-time subscription — bara för inloggade (övriga ser SSR-data)
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToComments(projectId, setComments);
    return unsub;
  }, [projectId, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !body.trim()) return;
    setSaving(true);
    setError("");
    try {
      const text = body.trim();
      await addComment({
        projectId,
        userId: user.uid,
        userDisplayName: user.displayName ?? user.email?.split("@")[0] ?? "Byggare",
        userAvatarUrl: user.photoURL ?? "",
        body: text,
      });
      notify({ type: "comment", targetType: "project", targetId: projectId, preview: text });
      setBody("");
    } catch {
      setError("Kunde inte skicka kommentaren. Försök igen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2 className="font-display text-xl font-bold text-ink mb-5">
        Kommentarer{" "}
        {comments.length > 0 && (
          <span className="font-mono text-base font-semibold text-mud">({comments.length})</span>
        )}
      </h2>

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-mud text-sm py-4">
          Inga kommentarer ännu. Bli först med att reagera.
        </p>
      ) : (
        <ul className="space-y-4 mb-8">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              {c.userAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.userAvatarUrl}
                  alt=""
                  className="h-8 w-8 shrink-0 rounded-full border-2 border-ink mt-0.5"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-8 w-8 shrink-0 rounded-full border-2 border-ink bg-cream flex items-center justify-center font-mono text-xs font-bold text-mud mt-0.5">
                  {(c.userDisplayName || "?")[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-ink">
                    {c.userDisplayName || "Anonym"}
                  </span>
                  {c.createdAt && (
                    <span className="font-mono text-[10px] text-mud">
                      {new Date(
                        (c.createdAt as { seconds: number }).seconds * 1000
                      ).toLocaleDateString("sv-SE")}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-ink">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Comment form */}
      {user && profile?.username ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Skriv en kommentar..."
            rows={3}
            maxLength={1000}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green resize-none placeholder:text-mud/60"
          />
          {error && <p className="text-xs text-bug-red">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !body.trim()}
              className="chunky-sm pressable rounded-xl bg-build-green px-5 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            >
              {saving ? "Skickar..." : "Kommentera"}
            </button>
          </div>
        </form>
      ) : user && !profile?.username ? (
        <div className="chunky-sm rounded-xl border-2 border-dashed border-border p-4">
          <div className="flex items-center gap-3">
            <UserCircle size={20} className="shrink-0 text-mud" />
            <p className="text-sm text-mud">
              <Link href="/onboarding" className="font-semibold text-ink underline underline-offset-2 hover:text-build-green">
                Slutför din profil
              </Link>{" "}
              för att kommentera — det tar mindre än en minut.
            </p>
          </div>
        </div>
      ) : (
        <div className="chunky-sm rounded-xl border-2 border-dashed border-border p-4 text-center">
          <p className="text-sm text-mud">
            <Link href="/login" className="font-semibold text-ink underline underline-offset-2 hover:text-build-green">
              Logga in
            </Link>{" "}
            för att kommentera och hjälpa andra byggare.
          </p>
        </div>
      )}
    </section>
  );
}
