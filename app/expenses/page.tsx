import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import ExpenseListClient from "./ExpenseListClient";

export default async function ExpensesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*, credit_cards(name, color)")
    .order("purchase_date", { ascending: false });

  return (
    <>
      <NavBar />
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">支出一覧</h1>
          <Link
            href="/expenses/new"
            className="bg-[#1E2A44] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#162035] transition-colors"
          >
            + 追加
          </Link>
        </div>
        <ExpenseListClient expenses={expenses ?? []} />
      </main>
    </>
  );
}
