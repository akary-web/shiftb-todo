import { createClient } from "@/lib/supabaseServer";
import NavBar from "@/components/NavBar";
import ExpenseEditForm from "@/components/ExpenseEditForm";
import { notFound } from "next/navigation";

export default async function ExpenseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: expense }, { data: cards }] = await Promise.all([
    supabase.from("expenses").select("*").eq("id", id).single(),
    supabase.from("credit_cards").select("*").order("created_at"),
  ]);

  if (!expense) notFound();

  return (
    <>
      <NavBar />
      <main className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-6">支出を編集</h1>
        <ExpenseEditForm expense={expense} cards={cards ?? []} />
      </main>
    </>
  );
}
