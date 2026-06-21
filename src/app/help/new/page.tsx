export const metadata = {
  title: "Beskriv problemet — AIbyggare.se",
};

export default function NewHelpPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
        Vad har du fastnat på?
      </h1>
      <p className="text-muted-foreground mb-10">
        Beskriv vad du försöker göra, vad du har provat och vad som gick fel. Ju mer konkret, desto lättare att hjälpa.
      </p>
      <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
        Formuläret kommer snart. Logga in för att komma igång.
      </div>
    </div>
  );
}
