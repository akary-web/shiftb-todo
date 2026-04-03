import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import CardList from "@/components/CardList";
import CardForm from "@/components/CardForm";

export default async function CardsPage() {
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
      <main className="max-w-md mx-auto px-4 py-6 space-y-8">
        <div>
          <h1 className="text-xl font-bold mb-4">カード管理</h1>
          <CardList cards={cards ?? []} />
        </div>
        <div>
          <h2 className="text-base font-bold mb-4">カードを追加</h2>
          <CardForm />
        </div>
      </main>
    </>
  );
}
