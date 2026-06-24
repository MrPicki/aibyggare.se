import { ChunkyLink } from "@/components/ui/ChunkyButton";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <span className="sticker mb-5 inline-flex bg-hammer-yellow px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide text-ink">
        404
      </span>
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Den här sidan finns inte
      </h1>
      <p className="mt-3 max-w-sm text-mud">
        Antingen är länken trasig, eller så har bygget rivits. Det händer de bästa.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ChunkyLink href="/" variant="green">
          Till startsidan
        </ChunkyLink>
        <ChunkyLink href="/projects" variant="ink">
          Bläddra bland byggen
        </ChunkyLink>
      </div>
    </div>
  );
}
