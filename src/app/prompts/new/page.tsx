export const metadata = {
  title: "Dela en prompt — AIbyggare.se",
};

export default function NewPromptPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
        Dela en prompt
      </h1>
      <p className="text-muted-foreground mb-10">
        Den där prompten som faktiskt funkade. Spara den här så andra slipper uppfinna hjulet igen.
      </p>
      <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
        Formuläret kommer snart. Logga in för att komma igång.
      </div>
    </div>
  );
}
