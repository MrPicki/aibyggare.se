import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft, Users, FolderGit2, HelpCircle, Sparkles,
  MessageSquare, Flag, ExternalLink, MessageCircle, TrendingUp,
} from "lucide-react";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { ModerationButtons, ResolveReportButton } from "@/components/admin/AdminActions";
import { AdminManagement } from "@/components/admin/AdminManagement";
import { ContentSection } from "@/components/admin/ContentSection";
import type {
  AdminStats, AdminReport, AdminUserRecord, FeedbackEntry,
  RecentContentSplit,
} from "@/lib/firebase/admin-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — AIbyggare.se",
  robots: { index: false, follow: false },
};

function StatCard({
  icon,
  label,
  value,
  delta,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  delta: number;
}) {
  return (
    <div className="chunky rounded-2xl bg-paper p-4">
      <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-mud">
        {icon} {label}
      </div>
      <p className="font-display text-3xl font-bold text-ink">{value}</p>
      {delta !== 0 && (
        <p
          className={`mt-0.5 font-mono text-[11px] font-bold ${delta > 0 ? "text-build-green" : "text-bug-red"}`}
        >
          {delta > 0 ? `+${delta}` : delta} senaste 24h
        </p>
      )}
      {delta === 0 && (
        <p className="mt-0.5 font-mono text-[11px] text-mud">±0 senaste 24h</p>
      )}
    </div>
  );
}

function formatDate(seconds: number | null): string {
  if (!seconds) return "";
  return new Date(seconds * 1000).toLocaleString("sv-SE", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/");

  let stats: AdminStats | null = null;
  let reports: AdminReport[] = [];
  let content: RecentContentSplit = { projects: [], helpPosts: [] };
  let adminUsers: AdminUserRecord[] = [];
  let feedback: FeedbackEntry[] = [];
  let loadError = false;

  try {
    const data = await import("@/lib/firebase/admin-data");
    [stats, reports, content, adminUsers, feedback] = await Promise.all([
      data.getAdminStats(),
      data.getOpenReports(),
      data.getRecentContentSplit(),
      data.getAdminUsers(),
      data.getFeedbackEntries(),
    ]);
  } catch (e) {
    console.error("[admin] kunde inte ladda data:", e);
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-build-green transition-colors"
      >
        <ArrowLeft size={14} /> Startsidan
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Admin</h1>
        <span className="sticker bg-bug-red px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-paper">
          Moderering
        </span>
      </div>
      <p className="mt-2 text-mud">Inloggad som {admin.displayName || admin.username}.</p>

      {loadError && (
        <div className="chunky-sm mt-8 rounded-xl bg-bug-red/10 p-4">
          <p className="text-sm font-medium text-bug-red">
            Kunde inte ladda admin-data just nu. Ladda om sidan om en stund.
          </p>
        </div>
      )}

      {/* ── Statistik med 24h-delta ── */}
      {stats && (
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard icon={<Users size={12} />}         label="Användare"       value={stats.users}       delta={stats.usersNew} />
          <StatCard icon={<FolderGit2 size={12} />}    label="Byggen"          value={stats.projects}    delta={stats.projectsNew} />
          <StatCard icon={<HelpCircle size={12} />}    label="Frågor"          value={stats.help}        delta={stats.helpNew} />
          <StatCard icon={<Sparkles size={12} />}      label="Prompts"         value={stats.prompts}     delta={stats.promptsNew} />
          <StatCard icon={<MessageSquare size={12} />} label="Kommentarer"     value={stats.comments}    delta={stats.commentsNew} />
          <StatCard icon={<Flag size={12} />}          label="Öppna rapporter" value={stats.openReports} delta={stats.reportsNew} />
        </section>
      )}

      {/* ── Rapporter ── */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-ink">Rapporter</h2>
        {reports.length === 0 ? (
          <p className="mt-3 text-mud text-sm">Inga öppna rapporter. Lugnt på bänken.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {reports.map((r) => (
              <li key={r.id} className="chunky-sm rounded-2xl bg-paper p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="sticker bg-bug-red/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-bug-red">
                        {r.targetType}
                      </span>
                      {r.targetUrl && (
                        <Link
                          href={r.targetUrl}
                          className="inline-flex items-center gap-1 font-mono text-xs font-bold text-ink hover:text-build-green"
                        >
                          {r.targetTitle} <ExternalLink size={11} />
                        </Link>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-ink">{r.reason || "(ingen motivering angiven)"}</p>
                  </div>
                  <ResolveReportButton id={r.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Senaste innehåll — två kolumner ── */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-ink">Senaste innehåll</h2>
        <p className="mt-1 text-sm text-mud">Utse veckans bygge eller ta bort olämpligt innehåll.</p>
        <div className="mt-4 grid gap-8 sm:grid-cols-2">
          <ContentSection title="Byggen" items={content.projects} />
          <ContentSection title="Problemhörnan" items={content.helpPosts} />
        </div>
      </section>

      {/* ── Feedback ── */}
      <section className="mt-12">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-mud" />
          <h2 className="font-display text-xl font-bold text-ink">Feedback</h2>
          {feedback.length > 0 && (
            <span className="sticker bg-hammer-yellow px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-ink">
              {feedback.length}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-mud">Inlämnad feedback från inloggade användare.</p>
        {feedback.length === 0 ? (
          <p className="mt-3 text-sm text-mud">Ingen feedback ännu.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {feedback.map((f) => (
              <li key={f.id} className="chunky-sm rounded-2xl bg-paper p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-ink">
                        {f.userName}
                        {f.username ? ` (@${f.username})` : ""}
                      </span>
                      {f.pageUrl && (
                        <span className="truncate font-mono text-[10px] text-mud">
                          {f.pageUrl}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink">{f.message}</p>
                    {f.imageUrl && (
                      <a
                        href={f.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-mud underline hover:text-ink"
                      >
                        <TrendingUp size={11} /> Se skärmdump
                      </a>
                    )}
                  </div>
                  {f.createdAtSeconds && (
                    <span className="shrink-0 font-mono text-[10px] text-mud">
                      {formatDate(f.createdAtSeconds)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Admin-hantering ── */}
      <AdminManagement initialAdmins={adminUsers} currentUid={admin.uid} />
    </div>
  );
}
