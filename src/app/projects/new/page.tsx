export const metadata = {
  title: "Lägg upp bygge — AIbyggare.se",
};

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
        Lägg upp ditt bygge
      </h1>
      <p className="text-muted-foreground mb-10">
        Halvfärdigt räknas. Visa vad du håller på med och vad du vill ha hjälp eller feedback på.
      </p>
      <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
        Formuläret kommer snart. Logga in för att komma igång.
      </div>
    </div>
  );
}
