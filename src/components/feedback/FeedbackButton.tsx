"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircleWarning, X, ImagePlus, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Skalar ner en bild client-side till max 1280px och JPEG → liten payload
// (håller request långt under serverless-gränsen).
function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1280;
        let { width, height } = img;
        if (width > max || height > max) {
          if (width >= height) { height = Math.round((height * max) / width); width = max; }
          else { width = Math.round((width * max) / height); height = max; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type TextState = "hidden" | "spinning" | "fading";

export function FeedbackButton() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const fileRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textState, setTextState] = useState<TextState>("hidden");

  useEffect(() => {
    if (loading || !user) return;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;
    const t1 = setTimeout(() => {
      setTextState("spinning");
      t2 = setTimeout(() => {
        setTextState("fading");
        t3 = setTimeout(() => setTextState("hidden"), 1000);
      }, 10000);
    }, 10000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2!);
      clearTimeout(t3!);
    };
  }, [loading, user]);

  if (loading || !user) return null;

  async function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Bara bilder kan bifogas.");
      return;
    }
    try {
      setImage(await resizeImage(file));
      setError(null);
    } catch {
      setError("Kunde inte läsa bilden.");
    }
  }

  async function submit() {
    if (message.trim().length < 3) {
      setError("Skriv en kort beskrivning.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), pageUrl: pathname, image }),
      });
      if (!res.ok) throw new Error("fail");
      setDone(true);
      setMessage("");
      setImage(null);
      setTimeout(() => { setOpen(false); setDone(false); }, 1600);
    } catch {
      setError("Kunde inte skicka. Försök igen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* CSS-animation för cirkulär text */}
      <style>{`
        @keyframes fbtn-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Svävande knapp-wrapper (samma position som knappen hade) */}
      <div
        className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6"
        style={{ width: 56, height: 56 }}
      >
        {/* Cirkulär animerad text-ring */}
        {textState !== "hidden" && (
          <div
            className="pointer-events-none absolute"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 160, height: 160 }}
          >
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              overflow="visible"
              style={{
                animation: textState === "spinning" || textState === "fading"
                  ? "fbtn-spin 8s linear infinite"
                  : "none",
                opacity: textState === "fading" ? 0 : 1,
                transition: textState === "fading" ? "opacity 1s ease-out" : "none",
              }}
            >
              <defs>
                <path
                  id="fbtn-text-path"
                  d="M 80,80 m -56,0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0"
                />
              </defs>
              <text
                fontFamily="monospace"
                fontSize="9"
                fontWeight="700"
                fill="var(--ink)"
                opacity="0.75"
                letterSpacing="1"
              >
                <textPath href="#fbtn-text-path" startOffset="0%">
                  Tryck här ifall du vill rapportera något eller en ändring •{" "}
                </textPath>
              </text>
            </svg>
          </div>
        )}

        {/* Knappen själv */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Rapportera problem eller lämna feedback"
          className="chunky pressable absolute inset-0 flex items-center justify-center rounded-2xl bg-bug-red text-paper"
        >
          <MessageCircleWarning size={24} />
        </button>
      </div>

      {/* Popup */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => !saving && setOpen(false)}
        >
          <div
            className="chunky w-full max-w-md rounded-3xl bg-paper p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <span className="sticker mb-2 inline-flex bg-bug-red px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-paper">
                  Feedback
                </span>
                <h2 className="font-display text-xl font-bold text-ink">Stötte du på något?</h2>
                <p className="mt-1 text-sm text-mud">
                  Bugg, krångel eller en idé — skriv rakt ut. Det hjälper oss enormt.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                disabled={saving}
                aria-label="Stäng"
                className="rounded-xl p-1.5 text-mud hover:bg-cream hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>

            {done ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-build-green text-paper">
                  <Check size={24} />
                </span>
                <p className="font-display text-lg font-bold text-ink">Tack! 🙌</p>
                <p className="text-sm text-mud">Din feedback är sparad.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Beskriv vad du stötte på, vad du försökte göra och vad som hände…"
                  rows={5}
                  maxLength={2000}
                  autoFocus
                  className="w-full resize-none rounded-xl border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-bug-red"
                />

                {/* Bild */}
                {image ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Bifogad bild" className="max-h-40 w-full rounded-xl border-2 border-ink object-contain bg-cream" />
                    <button
                      onClick={() => setImage(null)}
                      aria-label="Ta bort bild"
                      className="absolute right-2 top-2 rounded-lg border-2 border-ink bg-paper p-1 text-ink hover:bg-bug-red hover:text-paper"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:border-ink hover:text-ink transition-colors"
                  >
                    <ImagePlus size={16} /> Bifoga skärmdump (valfritt)
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={pickImage} className="hidden" />

                {error && <p className="text-xs text-bug-red">{error}</p>}

                <button
                  onClick={submit}
                  disabled={saving}
                  className="chunky pressable w-full rounded-xl bg-bug-red py-3 font-mono text-sm font-bold uppercase tracking-wide text-paper disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                >
                  {saving ? "Skickar…" : "Skicka feedback"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
