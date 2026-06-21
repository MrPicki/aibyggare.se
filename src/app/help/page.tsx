import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Fastnat? — AIbyggare.se",
  description: "Ställ en fråga och få hjälp av andra byggare. Auth, deploys, databaser — communityn har fastnat i precis samma saker.",
};

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Folk har fastnat här
          </h1>
          <p className="mt-2 text-muted-foreground">
            Supabase, Vercel, auth, CSS och andra små glädjeämnen.
          </p>
        </div>
        <Link
          href="/help/new"
          className={cn(
            buttonVariants({ size: "sm" }),
            "bg-primary text-primary-foreground hover:bg-[#8DB34E] font-semibold shrink-0"
          )}
        >
          Jag har fastnat
          <ArrowRight size={14} className="ml-1.5" />
        </Link>
      </div>

      <div className="rounded-xl border border-dashed border-border p-16 text-center">
        <p className="text-muted-foreground mb-4">
          Ingen har fastnat just nu. Det lär inte hålla länge.
        </p>
        <Link
          href="/help/new"
          className={cn(
            buttonVariants(),
            "bg-primary text-primary-foreground hover:bg-[#8DB34E] font-semibold"
          )}
        >
          Beskriv vad som strular
        </Link>
      </div>
    </div>
  );
}
