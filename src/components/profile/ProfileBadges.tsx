import { resolveBadges, type BadgeStats } from "@/lib/constants/badges";
import { Award } from "lucide-react";

// Visar hela märkesuppsättningen: intjänade i full färg, övriga dämpade som
// mål att sikta mot. Ren server-komponent — ingen interaktivitet.
export function ProfileBadges({ stats }: { stats: BadgeStats }) {
  const badges = resolveBadges(stats);
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="mt-6 border-t-2 border-dashed border-border pt-5">
      <div className="mb-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-mud">
        <Award size={12} /> Märken{" "}
        <span className="text-mud/60">
          ({earnedCount}/{badges.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span
            key={b.id}
            title={b.description}
            aria-label={
              b.earned ? `${b.label} — ${b.description}` : `${b.label} — inte upplåst än`
            }
            className={[
              "inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide transition-colors",
              b.earned
                ? "border-ink text-ink"
                : "border-dashed border-border text-mud/50",
            ].join(" ")}
            style={b.earned ? { backgroundColor: b.accent } : undefined}
          >
            <span
              className={[
                "h-2 w-2 shrink-0 rounded-full border border-ink/40",
                b.earned ? "bg-ink/70" : "bg-transparent",
              ].join(" ")}
            />
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}
