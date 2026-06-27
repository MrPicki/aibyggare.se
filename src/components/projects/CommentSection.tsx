"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle, Reply } from "lucide-react";
import { addComment, subscribeToComments } from "@/lib/firebase/projects-client";
import { notify } from "@/lib/notifications/notify-client";
import type { Comment } from "@/types/firestore";

interface CommentSectionProps {
  projectId: string;
  initialComments: Comment[];
}

function dateLabel(c: Comment): string {
  const s = (c.createdAt as { seconds?: number } | null)?.seconds;
  return s ? new Date(s * 1000).toLocaleDateString("sv-SE") : "";
}

export function CommentSection({ projectId, initialComments }: CommentSectionProps) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Vilket inlägg svarar man på (id = klickad kommentar, rootId = trådens topp).
  const [replyTo, setReplyTo] = useState<{ id: string; rootId: string; name: string } | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [replySaving, setReplySaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    return subscribeToComments(projectId, setComments);
  }, [projectId, user]);

  const canComment = !!user && !!profile?.username;
  const topLevel = comments.filter((c) => !c.parentId);
  const repliesOf = (rootId: string) =>
    comments.filter((c) => c.parentId === rootId);

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
        userDisplayName: profile?.displayName || user.displayName || "Byggare",
        userAvatarUrl: profile?.avatarUrl || user.photoURL || "",
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

  async function handleReply() {
    if (!user || !replyTo || !replyBody.trim()) return;
    setReplySaving(true);
    try {
      const text = replyBody.trim();
      await addComment({
        projectId,
        userId: user.uid,
        userDisplayName: profile?.displayName || user.displayName || "Byggare",
        userAvatarUrl: profile?.avatarUrl || user.photoURL || "",
        body: text,
        parentId: replyTo.rootId,
        replyToName: replyTo.name,
      });
      // Notis till den man svarar (förälder-kommentarens författare).
      notify({ type: "reply", targetType: "project", targetId: projectId, parentCommentId: replyTo.id, preview: text });
      setReplyBody("");
      setReplyTo(null);
    } catch {
      setError("Kunde inte skicka svaret. Försök igen.");
    } finally {
      setReplySaving(false);
    }
  }

  function startReply(c: Comment) {
    setReplyTo({ id: c.id, rootId: c.parentId || c.id, name: c.userDisplayName || "Anonym" });
    setReplyBody("");
  }

  function Avatar({ c, small = false }: { c: Comment; small?: boolean }) {
    const cls = `${small ? "h-7 w-7" : "h-8 w-8"} shrink-0 rounded-full border-2 border-ink mt-0.5`;
    return c.userAvatarUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={c.userAvatarUrl} alt="" className={`${cls} object-cover`} referrerPolicy="no-referrer" />
    ) : (
      <div className={`${cls} bg-cream flex items-center justify-center font-mono text-xs font-bold text-mud`}>
        {(c.userDisplayName || "?")[0].toUpperCase()}
      </div>
    );
  }

  function CommentBody({ c }: { c: Comment }) {
    return (
      <div className="flex-1">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="font-mono text-xs font-bold text-ink">{c.userDisplayName || "Anonym"}</span>
          {dateLabel(c) && <span className="font-mono text-[10px] text-mud">{dateLabel(c)}</span>}
        </div>
        {c.replyToName && (
          <p className="mb-0.5 font-mono text-[11px] text-mud">svarar @{c.replyToName}</p>
        )}
        <p className="text-sm leading-relaxed text-ink">{c.body}</p>
        {canComment && (
          <button
            onClick={() => startReply(c)}
            className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wide text-mud hover:text-build-green"
          >
            <Reply size={12} /> Svara
          </button>
        )}
      </div>
    );
  }

  function ReplyForm() {
    return (
      <div className="mt-2 flex flex-col gap-2">
        <textarea
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          placeholder={`Svara ${replyTo?.name}…`}
          rows={2}
          maxLength={1000}
          autoFocus
          className="w-full resize-none rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-build-green"
        />
        <div className="flex gap-2">
          <button
            onClick={handleReply}
            disabled={replySaving || !replyBody.trim()}
            className="chunky-sm pressable rounded-xl bg-build-green px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-paper disabled:opacity-50"
          >
            {replySaving ? "Skickar…" : "Svara"}
          </button>
          <button
            onClick={() => setReplyTo(null)}
            className="rounded-xl border-2 border-ink px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-ink hover:bg-cream"
          >
            Avbryt
          </button>
        </div>
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-5 font-display text-xl font-bold text-ink">
        Kommentarer{" "}
        {comments.length > 0 && (
          <span className="font-mono text-base font-semibold text-mud">({comments.length})</span>
        )}
      </h2>

      {comments.length === 0 ? (
        <p className="py-4 text-sm text-mud">Inga kommentarer ännu. Bli först med att reagera.</p>
      ) : (
        <ul className="mb-8 space-y-5">
          {topLevel.map((c) => (
            <li key={c.id}>
              <div className="flex gap-3">
                <Avatar c={c} />
                <CommentBody c={c} />
              </div>
              {replyTo?.id === c.id && <div className="ml-11">{ReplyForm()}</div>}

              {/* Svar (en nivå, indenterade) */}
              {repliesOf(c.id).length > 0 && (
                <ul className="ml-11 mt-3 space-y-3 border-l-2 border-dashed border-border pl-4">
                  {repliesOf(c.id).map((r) => (
                    <li key={r.id}>
                      <div className="flex gap-3">
                        <Avatar c={r} small />
                        <CommentBody c={r} />
                      </div>
                      {replyTo?.id === r.id && <div className="ml-10">{ReplyForm()}</div>}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Topp-kommentarsformulär */}
      {canComment ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Skriv en kommentar..."
            rows={3}
            maxLength={1000}
            className="w-full resize-none rounded-xl border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-build-green"
          />
          {error && <p className="text-xs text-bug-red">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !body.trim()}
              className="chunky-sm pressable rounded-xl bg-build-green px-5 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            >
              {saving ? "Skickar..." : "Kommentera"}
            </button>
          </div>
        </form>
      ) : user ? (
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
