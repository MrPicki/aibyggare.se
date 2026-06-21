import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Prompts — AIbyggare.se",
  description: "Prompts som faktiskt funkade. Sparade av byggare för byggare.",
};

export default function PromptsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Prompts som faktiskt funkade
          </h1>
          <p className="mt-2 text-muted-foreground">
            Spara de prompts som gjorde mer nytta än skada.
          </p>
        </div>
        <Link
          href="/prompts/new"
          className={cn(
            buttonVariants({ size: "sm" }),
            "bg-primary text-primary-foreground hover:bg-[#8DB34E] font-semibold shrink-0"
          )}
        >
          Dela en prompt
          <ArrowRight size={14} className="ml-1.5" />
        </Link>
      </div>

      <div className="rounded-xl border border-dashed border-border p-16 text-center">
        <p className="text-muted-foreground mb-4">
          Här saknas prompts.
        </p>
        <Link
          href="/prompts/new"
          className={cn(
            buttonVariants(),
            "bg-primary text-primary-foreground hover:bg-[#8DB34E] font-semibold"
          )}
        >
          Dela den där prompten som räddade din kväll
        </Link>
      </div>
    </div>
  );
}
