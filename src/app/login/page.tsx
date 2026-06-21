import Link from "next/link";

export const metadata = {
  title: "Logga in — AIbyggare.se",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <div className="text-center mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
          Välkommen tillbaka
        </h1>
        <p className="text-muted-foreground text-sm">
          Logga in för att visa upp ditt bygge eller få hjälp.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
        Inloggning med Google och GitHub kommer snart.
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Inget konto?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Skapa ett gratis
        </Link>
      </p>
    </div>
  );
}
