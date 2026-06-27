"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Bell, Check } from "lucide-react";
import { DrillIcon } from "@/components/brand/DrillIcon";
import { MessageSquare, LifeBuoy, Reply } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  subscribeToNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type AppNotification,
} from "@/lib/notifications/notifications-client";

function relTime(seconds: number): string {
  if (!seconds) return "nyss";
  const s = Date.now() / 1000 - seconds;
  if (s < 60) return "nyss";
  if (s < 3600) return `${Math.round(s / 60)} min`;
  if (s < 86400) return `${Math.round(s / 3600)} tim`;
  return `${Math.round(s / 86400)} d`;
}

function notifText(n: AppNotification): string {
  const t = n.targetTitle ? `"${n.targetTitle}"` : (n.targetType === "project" ? "ditt bygge" : "din fråga");
  if (n.type === "upvote") return `${n.actorName} gav ${t} en borr`;
  if (n.type === "comment") return `${n.actorName} kommenterade ${t}`;
  if (n.type === "reply") return `${n.actorName} svarade på din kommentar`;
  return `${n.actorName} svarade på ${t}`;
}

function NotifIcon({ type }: { type: AppNotification["type"] }) {
  if (type === "upvote") return <DrillIcon className="h-4 w-4 text-build-green" />;
  if (type === "answer") return <LifeBuoy size={15} className="text-warning-orange" />;
  if (type === "reply") return <Reply size={15} className="text-prompt-purple" />;
  return <MessageSquare size={15} className="text-code-blue" />;
}

export function NotificationBell() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const bellRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { setItems([]); return; }
    return subscribeToNotifications(user.uid, setItems);
  }, [user]);

  // Stäng vid klick utanför bell + dropdown.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const target = e.target as Node;
      const inBell = bellRef.current?.contains(target);
      const inDrop = dropRef.current?.contains(target);
      if (!inBell && !inDrop) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!user) return null;

  const unread = items.filter((n) => !n.read).length;

  function handleBellClick() {
    if (!open && bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setOpen((o) => !o);
  }

  function handleClick(n: AppNotification) {
    if (user && !n.read) void markNotificationRead(user.uid, n.id);
    setOpen(false);
    router.push(n.url);
  }

  function handleMarkAll() {
    if (!user) return;
    void markAllNotificationsRead(user.uid, items.filter((n) => !n.read).map((n) => n.id));
  }

  const dropdown = (
    <div
      ref={dropRef}
      style={{ position: "fixed", top: dropPos.top, right: dropPos.right, zIndex: 9999 }}
      className="w-80 overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[5px_5px_0_0_var(--ink)]"
    >
      <div className="flex items-center justify-between border-b-2 border-ink bg-cream px-4 py-2.5">
        <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink">Notiser</span>
        {unread > 0 && (
          <button
            onClick={handleMarkAll}
            className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wide text-mud hover:text-ink"
          >
            <Check size={12} /> Markera lästa
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="font-mono text-xs text-mud">Inga notiser än.</p>
            <p className="mt-1 text-xs text-mud/70">När någon borrar, kommenterar eller svarar dyker det upp här.</p>
          </div>
        ) : (
          <ul>
            {items.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => handleClick(n)}
                  className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-cream ${n.read ? "" : "bg-hammer-yellow/15"}`}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper">
                    <NotifIcon type={n.type} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-snug text-ink">{notifText(n)}</span>
                    {n.preview && (
                      <span className="mt-0.5 block truncate font-mono text-[11px] text-mud">{n.preview}</span>
                    )}
                    <span className="mt-0.5 block font-mono text-[10px] text-mud/70">{relTime(n.createdAtSeconds)} sedan</span>
                  </span>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-bug-red" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={handleBellClick}
        aria-label={`Notiser${unread ? ` (${unread} olästa)` : ""}`}
        className="relative rounded-xl p-2 text-mud hover:bg-hammer-yellow hover:text-ink transition-colors"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-paper bg-bug-red px-1 font-mono text-[9px] font-bold leading-none text-paper">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && typeof window !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
}
