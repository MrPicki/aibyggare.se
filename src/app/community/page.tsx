export const metadata = {
  title: "Byggsnack — AIbyggare.se",
  description: "Diskussioner, tankar och snack från communityn.",
};

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Byggsnack
        </h1>
        <p className="mt-2 text-muted-foreground">
          Diskussioner, tankar och löst snack från folk som bygger.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
        Tyst just nu. Kom igen snart.
      </div>
    </div>
  );
}
