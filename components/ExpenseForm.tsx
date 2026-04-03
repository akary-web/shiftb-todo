"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { calcPaymentMonth } from "@/lib/calcPaymentMonth";
import { CATEGORIES } from "@/lib/categories";
import { CreditCard } from "@/lib/types";

type Props = {
  cards: CreditCard[];
};

export default function ExpenseForm({ cards }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const today = new Date().toISOString().split("T")[0];

  const [cardId, setCardId] = useState(cards[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(today);
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewPayment, setPreviewPayment] = useState("");

  useEffect(() => {
    if (!cardId || !purchaseDate) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    const date = new Date(purchaseDate + "T00:00:00");
    const ym = calcPaymentMonth(date, card.closing_day, card.payment_month_offset);
    const [y, m] = ym.split("-");
    setPreviewPayment(`${y}年${parseInt(m)}月`);
  }, [cardId, purchaseDate, cards]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!cardId) {
      setError("カードを選択してください");
      return;
    }

    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    const date = new Date(purchaseDate + "T00:00:00");
    const paymentYearMonth = calcPaymentMonth(
      date,
      card.closing_day,
      card.payment_month_offset
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);
    const { error: insertError } = await supabase.from("expenses").insert({
      user_id: user.id,
      card_id: cardId,
      amount: parseInt(amount),
      memo: memo || null,
      purchase_date: purchaseDate,
      category,
      payment_year_month: paymentYearMonth,
    });

    if (insertError) {
      setError("保存に失敗しました");
      setLoading(false);
      return;
    }

    router.push("/expenses");
    router.refresh();
  }

  if (cards.length === 0) {
    return (
      <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700 text-center">
        カードが登録されていません。先にカード管理からカードを追加してください。
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="card-select" className="block text-sm font-medium mb-1">カード</label>
        <select
          id="card-select"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
        >
          {cards.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="purchase-date" className="block text-sm font-medium mb-1">購入日</label>
        <input
          id="purchase-date"
          type="date"
          required
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">金額（円）</label>
        <input
          id="amount"
          type="number"
          required
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
          placeholder="1500"
        />
      </div>

      <div>
        <label htmlFor="category-select" className="block text-sm font-medium mb-1">カテゴリ</label>
        <select
          id="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="memo" className="block text-sm font-medium mb-1">メモ（任意）</label>
        <input
          id="memo"
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
          placeholder="例：コストコ、洗剤など"
        />
      </div>

      {/* 引き落とし月プレビュー */}
      {previewPayment && (
        <div className="bg-[#FFF1F6] rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-[#1E2A44]">引き落とし予定月</span>
          <span className="font-bold text-[#1E2A44]">{previewPayment}</span>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 border border-pink-100 rounded-lg py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#1E2A44] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#162035] disabled:opacity-50 transition-colors"
        >
          {loading ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
}
