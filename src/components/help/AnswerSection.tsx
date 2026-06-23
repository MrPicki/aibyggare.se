"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  addAnswer,
  subscribeToAnswers,
  acceptAnswer,
} from "@/lib/firebase/help-client";
import type { Comment } from "@/types/firestore";

interface AnswerSectionProps {
  postId: string;
  postOwnerId: string;
  acceptedCommentId: string | null;
  initialAnswers: Comment[];
}

function timeAgo(seconds: number): string {
  const diff = Math.floor(Date.now() / 1000 - seconds);
  if (diff < 60) return "nyss";
  if (diff < 3600) return `${Math.floor(diff / 60)} min sedan`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} tim sedan`;
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} dagar sedan`;
  return new Date(seconds * 1000).toLocaleDateString("sv-SE");
}

export function AnswerSection({
  postId,
  postOwnerId,
  acceptedCommentId,
  initialAnswers,
}: AnswerSectionProps) {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Comment[]>(initialAnswers);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const isOwner = user?.uid === postOwnerId;
  const isSolved = answers.some((a) => a.isAccepted);

  useEffect(() => {
    const unsub = subscribeToAnswers(postId, setAnswers);
    return unsub;
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !body.trim()) return;
    setSaving(true);
    setError("");
    try {
      await addAnswer({
        postId,
        userId: user.uid,
        userDisplayName:
          user.displayName ?? user.email?.split("@")[0] ?? "Byggare",
        userAvatarUrl: user.photoURL ?? "",
        body: body.trim(),
      });
      setBody("");
    } catch {
      setError("Kunde inte skicka svaret. Försök igen.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAccept(commentId: string) {
    setAccepting(commentId);
    try {
      await acceptAnswer(postId, commentId, acceptedCommentId);
    } catch {
      setError("Kunde inte markera svaret. Försök igen.");
    } finally {
      setAccepting(null);
    }
  }

  return (
    <section className="mt-8">
      <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-widest text-mud">
        {answers.length} {answers.length === 1 ? "svar" : "svar"}
      </p>

      {/* Answer list */}
      {answers.length === 0 ? (
        <div className="chunky rounded-3xl bg-paper p-8 text-center mb-6">
          <p className="font-display text-base font-bold text-ink">
            Inga svar ännu.
          </p>
          <p className="mt-1 text-sm text-mud">
            Vet du svaret? Bli den första som hjälper till.
          </p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {answers.map((answer) => (
            <article
              key={answer.id}
              className={[
                "chunky rounded-3xl bg-paper",
                answer.isAccepted ? "ring-2 ring-build-green" : "",
              ].join(" ")}
            >
              {answer.isAccepted && (
                <div className="flex items-center gap-2 border-b-2 border-ink bg-build-green/15 px-5 py-2.5 rounded-t-3xl">
                  <CheckCircle2 size={14} className="text-build-green" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-build-green">
                    Accepterat svar
                  </span>
                </div>
              )}
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <Link
                    href={`/profile/${answer.userDisplayName}`}
                    className="inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                  >
                    {answer.userAvatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={answer.userAvatarUrl}
                        alt=""
                        className="h-8 w-8 rounded-full border-2 border-ink object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full border-2 border-ink bg-cream flex items-center justify-center font-mono text-xs font-bold text-mud">
                        {(answer.userDisplayName || "?")[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-mono text-xs font-bold text-ink">
                        {answer.userDisplayName || "Anonym"}
                      </p>
                      {answer.createdAt && (
                        <p className="font-mono text-[10px] text-mud">
                          {timeAgo(
                            (answer.createdAt as { seconds: number }).seconds
                          )}
                        </p>
                      )}
                    </div>
                  </Link>

                  {isOwner && !answer.isAccepted && !isSolved && (
                    <button
                      onClick={() => handleAccept(answer.id)}
                      disabled={accepting === answer.id}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-mud hover:bg-build-green hover:text-paper transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 size={12} />
                      {accepting === answer.id ? "..." : "Acceptera"}
                    </button>
                  )}
                </div>
                <p className="text-base leading-relaxed text-ink whitespace-pre-wrap">
                  {answer.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Answer form */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Skriv ditt svar..."
            rows={4}
            maxLength={2000}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green resize-none placeholder:text-mud/60"
          />
          {error && <p className="text-xs text-bug-red">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !body.trim()}
              className="chunky-sm pressable rounded-xl bg-hammer-yellow px-5 py-2 font-mono text-xs font-bold uppercase tracking-wide text-ink disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            >
              {saving ? "Skickar..." : "Skicka svar"}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-border p-4 text-center">
          <p className="text-sm text-mud">
            <Link
              href="/login"
              className="font-semibold text-ink underline underline-offset-2 hover:text-build-green"
            >
              Logga in
            </Link>{" "}
            för att svara och hjälpa andra byggare.
          </p>
        </div>
      )}
    </section>
  );
}
