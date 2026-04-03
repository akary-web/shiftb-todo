import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import ExpenseForm from "@/components/ExpenseForm";

export default async function NewExpensePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cards } = await supabase
    .from("credit_cards")
    .select("*")
    .order("created_at");

  return (
    <>
      <NavBar />
      <main className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-6">支出を追加</h1>
        <ExpenseForm cards={cards ?? []} />
      </main>
    </>
  );
}
