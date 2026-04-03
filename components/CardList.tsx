"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { CreditCard } from "@/lib/types";
import { Trash2 } from "lucide-react";

type Props = {
  cards: CreditCard[];
};

export default function CardList({ cards }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  function toggleCheck(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (checkedIds.size === cards.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(cards.map((c) => c.id)));
    }
  }

  async function handleDeleteChecked() {
    if (!confirm(`選択した${checkedIds.size}件のカードを削除しますか？\n関連する支出データも全て削除されます。`)) return;
    await supabase.from("credit_cards").delete().in("id", [...checkedIds]);
    setCheckedIds(new Set());
    router.refresh();
  }

  async function handleDeleteOne(id: string) {
    if (!confirm("このカードを削除しますか？\n関連する支出データも全て削除されます。")) return;
    await supabase.from("credit_cards").delete().eq("id", id);
    router.refresh();
  }

  if (cards.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4 text-center">カードが登録されていません</p>
    );
  }

  return (
    <div className="space-y-3">
      {/* 全選択・一括削除 */}
      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
          <input
            type="checkbox"
            aria-label="すべてのカードを選択"
            checked={checkedIds.size === cards.length}
            onChange={toggleAll}
            className="accent-[#FF4F87] w-4 h-4"
          />
          すべて選択
        </label>
        {checkedIds.size > 0 && (
          <button
            type="button"
            onClick={handleDeleteChecked}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={14} />
            {checkedIds.size}件を削除
          </button>
        )}
      </div>

      {/* カード一覧 */}
      <div className="space-y-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-xl border border-pink-50 px-4 py-3 flex items-center gap-3"
            style={{ borderLeft: `4px solid ${card.color}` }}
          >
            <input
              type="checkbox"
              aria-label={`${card.name}を選択`}
              checked={checkedIds.has(card.id)}
              onChange={() => toggleCheck(card.id)}
              className="accent-[#FF4F87] w-4 h-4 shrink-0"
            />
            <div className="flex-1">
              <p className="font-medium text-sm text-[#1E2A44]">{card.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                締め日：{card.closing_day === 31 ? "末日" : `${card.closing_day}日`}
                　支払日：翌{card.payment_month_offset > 1 ? "々" : ""}月{card.payment_day}日
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/cards/edit/${card.id}`}
                className="text-xs text-gray-400 hover:text-[#FF4F87] transition-colors">
                編集
              </Link>
              <button type="button" onClick={() => handleDeleteOne(card.id)}
                className="text-gray-300 hover:text-red-400 text-lg leading-none transition-colors">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
