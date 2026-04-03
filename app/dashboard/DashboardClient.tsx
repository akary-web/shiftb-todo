"use client";

import { useState } from "react";
import { CreditCard, Expense } from "@/lib/types";

type Props = {
  cards: CreditCard[];
  expenses: (Expense & { credit_cards: { name: string; color: string } })[];
};

export default function DashboardClient({ cards, expenses }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const targetYM = `${year}-${String(month).padStart(2, "0")}`;
  const filtered = expenses.filter((e) => e.payment_year_month === targetYM);

  const byCard: Record<
    string,
    { name: string; color: string; total: number; byCategory: Record<string, { total: number; count: number }> }
  > = {};

  for (const e of filtered) {
    const cardId = e.card_id;
    if (!byCard[cardId]) {
      byCard[cardId] = {
        name: e.credit_cards?.name ?? "不明",
        color: e.credit_cards?.color ?? "#1E2A44",
        total: 0,
        byCategory: {},
      };
    }
    byCard[cardId].total += e.amount;
    const cat = e.category ?? "その他";
    if (!byCard[cardId].byCategory[cat]) {
      byCard[cardId].byCategory[cat] = { total: 0, count: 0 };
    }
    byCard[cardId].byCategory[cat].total += e.amount;
    byCard[cardId].byCategory[cat].count += 1;
  }

  const grandTotal = filtered.reduce((sum, e) => sum + e.amount, 0);

  function prevMonth() {
    if (month === 1) { setYear(year - 1); setMonth(12); }
    else setMonth(month - 1);
  }
  function nextMonth() {
    if (month === 12) { setYear(year + 1); setMonth(1); }
    else setMonth(month + 1);
  }

  return (
    <div className="space-y-6">
      {/* 月切り替え */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-pink-50 transition-colors text-gray-400"
        >
          ←
        </button>
        <div className="text-center">
          <p className="text-xs text-gray-400">引き落とし予定月</p>
          <h2 className="text-xl font-bold text-[#1E2A44]">
            {year}年{month}月
          </h2>
        </div>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-pink-50 transition-colors text-gray-400"
        >
          →
        </button>
      </div>

      {/* 合計カード */}
      <div className="bg-[#1E2A44] rounded-2xl p-6 text-white text-center">
        <p className="text-sm opacity-70 mb-1">合計引き落とし予定</p>
        <p className="text-4xl font-bold">¥{grandTotal.toLocaleString()}</p>
        <p className="text-sm opacity-50 mt-1">{filtered.length}件</p>
      </div>

      {/* カード別内訳 */}
      {Object.keys(byCard).length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">
          この月の支出データはありません
        </p>
      ) : (
        <div className="space-y-4">
          {Object.entries(byCard).map(([cardId, data]) => (
            <div
              key={cardId}
              className="bg-white rounded-2xl border border-pink-50 overflow-hidden"
            >
              <div
                className="px-4 py-3 flex justify-between items-center"
                style={{ borderLeft: `4px solid ${data.color}` }}
              >
                <span className="font-medium text-sm text-[#1E2A44]">{data.name}</span>
                <span className="font-bold text-sm text-[#1E2A44]">
                  ¥{data.total.toLocaleString()}
                </span>
              </div>
              <div className="divide-y divide-[#FFF1F6]">
                {Object.entries(data.byCategory).map(([cat, { total, count }]) => (
                  <div key={cat} className="px-4 py-2.5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-300">{count}件</span>
                      <span className="text-sm text-gray-600">{cat}</span>
                    </div>
                    <span className="text-sm font-medium text-[#1E2A44]">
                      ¥{total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {cards.length === 0 && (
        <div className="bg-[#FFF1F6] rounded-xl p-4 text-sm text-[#FF4F87] text-center">
          まずカード管理からカードを登録してください
        </div>
      )}
    </div>
  );
}
