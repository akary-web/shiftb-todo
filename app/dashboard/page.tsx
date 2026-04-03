import { createClient } from "@/lib/supabaseServer";
import NavBar from "@/components/NavBar";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: cards } = await supabase
    .from("credit_cards")
    .select("*")
    .order("created_at");

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*, credit_cards(name, color)")
    .order("purchase_date", { ascending: false });

  return (
    <>
      <NavBar />
      <main className="max-w-md mx-auto px-4 py-6">
        <DashboardClient
          cards={cards ?? []}
          expenses={expenses ?? []}
        />
      </main>
    </>
  );
}
