"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, UserCircle, Reply } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  addAnswer,
  subscribeToAnswers,
  acceptAnswer,
} from "@/lib/firebase/help-client";
import { notify } from "@/lib/notifications/notify-client";
import type { Comment } from "@/types/firestore";

interface HelpCommentSectionProps {
  postId: string;
  postOwnerId: string;
  acceptedCommentId: string | null;
  initialComments: Comment[];
}

export function HelpCommentSection({
  postId,
  postOwnerId,
  acceptedCommentId: initialAcceptedId,
  initialComments,
}: HelpCommentSectionProps) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [acceptedId, setAcceptedId] = useState<string | null>(initialAcceptedId);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; rootId: string; name: string } | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [replySaving, setReplySaving] = useState(false);

  useEffect(() => {
    if (!user) return; // övriga ser SSR-data
    const unsub = subscribeToAnswers(postId, setComments);
    return unsub;
  }, [postId, user]);

  const isOwner = user?.uid === postOwnerId;
  const canReply = !!user && !!profile?.username;
  const topLevel = comments.filter((c) => !c.parentId);
  const repliesOf = (rootId: string) => comments.filter((c) => c.parentId === rootId);

  async function handleReply() {
    if (!user || !replyTo || !replyBody.trim()) return;
    setReplySaving(true);
    try {
      const text = replyBody.trim();
      await addAnswer({
        postId,
        userId: user.uid,
        userDisplayName: profile?.displayName || user.displayName || "Byggare",
        userAvatarUrl: profile?.avatarUrl || user.photoURL || "",
        body: text,
        parentId: replyTo.rootId,
        replyToName: replyTo.name,
      });
      notify({ type: "reply", targetType: "post", targetId: postId, parentCommentId: replyTo.id, preview: text });
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

  function ReplyForm() {
    return (
      <div className="mt-3 flex flex-col gap-2">
        <textarea
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          placeholder={`Svara ${replyTo?.name}…`}
          rows={2}
          maxLength={1000}
          autoFocus
          className="w-full resize-none rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-hammer-yellow"
        />
        <div className="flex gap-2">
          <button
            onClick={handleReply}
            disabled={replySaving || !replyBody.trim()}
            className="chunky-sm pressable rounded-xl bg-hammer-yellow px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-ink disabled:opacity-50"
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

  async function handleAccept(commentId: string) {
    if (!isOwner || accepting) return;
    setAccepting(commentId);
    try {
      await acceptAnswer(postId, commentId, acceptedId);
      setAcceptedId(commentId);
      setComments((prev) =>
        prev.map((c) => ({ ...c, isAccepted: c.id === commentId }))
      );
    } catch {
      setError("Kunde inte markera svaret. Försök igen.");
    } finally {
      setAccepting(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !body.trim()) return;
    setSaving(true);
    setError("");
    try {
      const text = body.trim();
      await addAnswer({
        postId,
        userId: user.uid,
        userDisplayName: profile?.displayName || user.displayName || user.email?.split("@")[0] || "Byggare",
        userAvatarUrl: profile?.avatarUrl || user.photoURL || "",
        body: text,
      });
      notify({ type: "answer", targetType: "post", targetId: postId, preview: text });
      setBody("");
    } catch {
      setError("Kunde inte skicka svaret. Försök igen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2 className="font-display text-xl font-bold text-ink mb-5">
        Hjälp från communityn{" "}
        {comments.length > 0 && (
          <span className="font-mono text-base font-semibold text-mud">
            ({comments.length})
          </span>
        )}
      </h2>

      {comments.length === 0 ? (
        <p className="text-mud text-sm py-4">
          Ingen har svarat ännu — bli först med att hjälpa till.
        </p>
      ) : (
        <ul className="space-y-4 mb-8">
          {topLevel.map((c) => {
            const isAccepted = c.id === acceptedId || c.isAccepted;
            return (
              <li
                key={c.id}
                className={[
                  "chunky rounded-2xl bg-paper overflow-hidden",
                  isAccepted ? "ring-2 ring-build-green" : "",
                ].join(" ")}
              >
                {isAccepted && (
                  <div className="flex items-center gap-1.5 bg-build-green/15 border-b-2 border-ink px-4 py-2">
                    <Check size={13} className="text-build-green" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-build-green">
                      Accepterat svar
                    </span>
                  </div>
                )}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-ink">
                          {c.userDisplayName || "Anonym"}
                        </span>
                        {c.createdAt && (
                          <span className="font-mono text-[10px] text-mud shrink-0">
                            {new Date(
                              (c.createdAt as { seconds: number }).seconds * 1000
                            ).toLocaleDateString("sv-SE")}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-ink">{c.body}</p>

                      <div className="mt-3 flex items-center gap-3">
                        {/* Acceptera-knapp — bara frågeägaren, på ej accepterade svar */}
                        {isOwner && !isAccepted && acceptedId === null && (
                          <button
                            onClick={() => handleAccept(c.id)}
                            disabled={!!accepting}
                            className="inline-flex items-center gap-1 rounded-lg border border-build-green/40 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-build-green transition-colors hover:bg-build-green/10 disabled:opacity-50"
                          >
                            <Check size={11} />
                            {accepting === c.id ? "Markerar…" : "Markera som löst"}
                          </button>
                        )}
                        {canReply && (
                          <button
                            onClick={() => startReply(c)}
                            className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wide text-mud hover:text-ink"
                          >
                            <Reply size={12} /> Svara
                          </button>
                        )}
                      </div>

                      {replyTo?.id === c.id && <ReplyForm />}

                      {/* Svar (en nivå) */}
                      {repliesOf(c.id).length > 0 && (
                        <ul className="mt-3 space-y-3 border-l-2 border-dashed border-border pl-4">
                          {repliesOf(c.id).map((r) => (
                            <li key={r.id}>
                              <div className="flex items-baseline gap-2">
                                <span className="font-mono text-xs font-bold text-ink">{r.userDisplayName || "Anonym"}</span>
                                {r.replyToName && <span className="font-mono text-[11px] text-mud">svarar @{r.replyToName}</span>}
                              </div>
                              <p className="mt-0.5 text-sm leading-relaxed text-ink">{r.body}</p>
                              {canReply && (
                                <button
                                  onClick={() => startReply(r)}
                                  className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wide text-mud hover:text-ink"
                                >
                                  <Reply size={12} /> Svara
                                </button>
                              )}
                              {replyTo?.id === r.id && <ReplyForm />}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="mb-3 font-mono text-xs text-bug-red">{error}</p>}

      {user && profile?.username ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Skriv ditt svar eller tips här..."
            rows={3}
            maxLength={1000}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-hammer-yellow resize-none placeholder:text-mud/60"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !body.trim()}
              className="chunky-sm pressable rounded-xl bg-hammer-yellow px-5 py-2 font-mono text-xs font-bold uppercase tracking-wide text-ink disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            >
              {saving ? "Skickar..." : "Hjälp till"}
            </button>
          </div>
        </form>
      ) : user && !profile?.username ? (
        <div className="chunky-sm rounded-xl border-2 border-dashed border-border p-4">
          <div className="flex items-center gap-3">
            <UserCircle size={20} className="shrink-0 text-mud" />
            <p className="text-sm text-mud">
              <Link href="/onboarding" className="font-semibold text-ink underline underline-offset-2 hover:text-hammer-yellow">
                Slutför din profil
              </Link>{" "}
              för att svara — det tar mindre än en minut.
            </p>
          </div>
        </div>
      ) : (
        <div className="chunky-sm rounded-xl border-2 border-dashed border-border p-4 text-center">
          <p className="text-sm text-mud">
            <Link
              href="/login"
              className="font-semibold text-ink underline underline-offset-2 hover:text-hammer-yellow"
            >
              Logga in
            </Link>{" "}
            för att hjälpa andra byggare.
          </p>
        </div>
      )}
    </section>
  );
}
