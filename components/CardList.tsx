"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { CreditCard } from "@/lib/types";

type Props = {
  cards: CreditCard[];
};

export default function CardList({ cards }: Props) {
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete(id: string) {
    if (!confirm("このカードを削除しますか？\n関連する支出データも全て削除されます。")) return;
    await supabase.from("credit_cards").delete().eq("id", id);
    router.refresh();
  }

  if (cards.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4 text-center">
        カードが登録されていません
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between"
          style={{ borderLeft: `4px solid ${card.color}` }}
        >
          <div>
            <p className="font-medium text-sm">{card.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              締め日：{card.closing_day === 31 ? "末日" : `${card.closing_day}日`}
              　支払日：翌{card.payment_month_offset > 1 ? `々` : ""}月{card.payment_day}日
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <Link
              href={`/cards/edit/${card.id}`}
              className="text-xs text-gray-400 hover:text-indigo-500 transition-colors"
            >
              編集
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(card.id)}
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
