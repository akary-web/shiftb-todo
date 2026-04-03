"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { Expense } from "@/lib/types";

type Props = {
  expenses: (Expense & { credit_cards: { name: string; color: string } })[];
};

export default function ExpenseListClient({ expenses }: Props) {
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete(id: string) {
    if (!confirm("この支出を削除しますか？")) return;
    await supabase.from("expenses").delete().eq("id", id);
    router.refresh();
  }

  if (expenses.length === 0) {
    return (
      <p className="text-center text-gray-400 text-sm py-12">
        支出がまだありません。追加ボタンから入力してください。
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((e) => (
        <div
          key={e.id}
          className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between"
          style={{ borderLeft: `4px solid ${e.credit_cards?.color ?? "#6366f1"}` }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-gray-400">
                {e.purchase_date.replace(/-/g, "/")}
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: e.credit_cards?.color ?? "#1E2A44" }}
              >
                {e.credit_cards?.name ?? "不明"}
              </span>
            </div>
            <p className="text-sm font-medium truncate">{e.memo || "（メモなし）"}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {e.category && (
                <span className="text-xs text-gray-400">{e.category}</span>
              )}
              <span className="text-xs text-[#FF4F87]">
                → {e.payment_year_month.replace("-", "年")}月払い
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-3">
            <span className="font-bold text-sm">
              ¥{e.amount.toLocaleString()}
            </span>
            <Link
              href={`/expenses/edit/${e.id}`}
              className="text-xs text-gray-400 hover:text-[#FF4F87] transition-colors"
            >
              編集
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(e.id)}
              className="text-gray-300 hover:text-red-400 text-lg leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
