import { redirect } from "next/navigation";

export default async function HelpDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/problemhornan/${slug}`);
}
