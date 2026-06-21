import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Genvägar — AIbyggare.se",
  description: "Guider och genvägar för att bygga snabbare med AI.",
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Genvägar
          </h1>
          <p className="mt-2 text-muted-foreground">
            Guider, workflows och tips från byggare som redan klurat ut det.
          </p>
        </div>
        <Link
          href="/guides/new"
          className={cn(
            buttonVariants({ size: "sm" }),
            "bg-primary text-primary-foreground hover:bg-[#8DB34E] font-semibold shrink-0"
          )}
        >
          Dela en guide
          <ArrowRight size={14} className="ml-1.5" />
        </Link>
      </div>

      <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
        Inga genvägar ännu. Den första du lägger upp hjälper alla som kommer efter.
      </div>
    </div>
  );
}
