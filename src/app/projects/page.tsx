import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Byggen — AIbyggare.se",
  description: "Projekt från folk som bygger med AI. Halvfärdigt, trasigt eller nästan lanserat — allt räknas.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Just nu på bänken
          </h1>
          <p className="mt-2 text-muted-foreground">
            Projekt från folk som bygger, testar, misslyckas och försöker igen.
          </p>
        </div>
        <Link
          href="/projects/new"
          className={cn(
            buttonVariants({ size: "sm" }),
            "bg-primary text-primary-foreground hover:bg-[#8DB34E] font-semibold shrink-0"
          )}
        >
          Lägg upp bygge
          <ArrowRight size={14} className="ml-1.5" />
        </Link>
      </div>

      <div className="rounded-xl border border-dashed border-border p-16 text-center">
        <p className="text-muted-foreground mb-4">
          Tomt på bänken än så länge.
        </p>
        <Link
          href="/projects/new"
          className={cn(
            buttonVariants(),
            "bg-primary text-primary-foreground hover:bg-[#8DB34E] font-semibold"
          )}
        >
          Lägg upp första bygget
        </Link>
      </div>
    </div>
  );
}
