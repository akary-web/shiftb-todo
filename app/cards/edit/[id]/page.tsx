import { createClient } from "@/lib/supabaseServer";
import NavBar from "@/components/NavBar";
import CardEditForm from "@/components/CardEditForm";
import { notFound } from "next/navigation";

export default async function CardEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: card } = await supabase
    .from("credit_cards")
    .select("*")
    .eq("id", id)
    .single();

  if (!card) notFound();

  return (
    <>
      <NavBar />
      <main className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-6">カードを編集</h1>
        <CardEditForm card={card} />
      </main>
    </>
  );
}
