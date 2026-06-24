import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Users, FolderGit2, HelpCircle, Sparkles, MessageSquare, Flag, ExternalLink } from "lucide-react";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { ModerationButtons, ResolveReportButton } from "@/components/admin/AdminActions";
import type { AdminStats, AdminReport, ModItem } from "@/lib/firebase/admin-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — AIbyggare.se",
  robots: { index: false, follow: false },
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="chunky rounded-2xl bg-paper p-4">
      <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-mud">
        {icon} {label}
      </div>
      <p className="font-display text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}

export default async function AdminPage() {
  const admin = await getAdminUser();
  // Riktig säkerhetsgrind: ingen admin → bort. (proxy.ts hindrar bara utloggade.)
  if (!admin) redirect("/");

  let stats: AdminStats | null = null;
  let reports: AdminReport[] = [];
  let content: ModItem[] = [];
  let loadError = false;

  try {
    const data = await import("@/lib/firebase/admin-data");
    [stats, reports, content] = await Promise.all([
      data.getAdminStats(),
      data.getOpenReports(),
      data.getRecentContent(),
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

      {/* ── Statistik ── */}
      {stats && (
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard icon={<Users size={12} />} label="Användare" value={stats.users} />
          <StatCard icon={<FolderGit2 size={12} />} label="Projekt" value={stats.projects} />
          <StatCard icon={<HelpCircle size={12} />} label="Frågor" value={stats.help} />
          <StatCard icon={<Sparkles size={12} />} label="Prompts" value={stats.prompts} />
          <StatCard icon={<MessageSquare size={12} />} label="Kommentarer" value={stats.comments} />
          <StatCard icon={<Flag size={12} />} label="Öppna rapporter" value={stats.openReports} />
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

      {/* ── Senaste innehåll ── */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-ink">Senaste innehåll</h2>
        <p className="mt-1 text-sm text-mud">Utse veckans bygge eller ta bort olämpligt innehåll.</p>
        {content.length === 0 ? (
          <p className="mt-3 text-mud text-sm">Inget innehåll än.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {content.map((item) => (
              <li
                key={`${item.kind}-${item.id}`}
                className="chunky-sm flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper p-3.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="sticker shrink-0 bg-cream px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-mud">
                    {item.label}
                  </span>
                  <Link href={item.url} className="truncate font-semibold text-ink hover:text-build-green">
                    {item.title}
                  </Link>
                  <span className="hidden shrink-0 font-mono text-[11px] text-mud sm:inline">
                    av {item.author}
                  </span>
                </div>
                <ModerationButtons kind={item.kind} id={item.id} isFeatured={item.isFeatured} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
