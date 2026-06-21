import Link from "next/link";

export const metadata = {
  title: "Skapa konto — AIbyggare.se",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <div className="text-center mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
          Skapa konto gratis
        </h1>
        <p className="text-muted-foreground text-sm">
          Gratis. Inget kreditkort. Ingen GDPR-popup efter GDPR-popup.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
        Registrering med Google och GitHub kommer snart.
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Redan registrerad?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Logga in
        </Link>
      </p>
    </div>
  );
}
