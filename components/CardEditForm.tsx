"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { CreditCard } from "@/lib/types";

const PRESET_COLORS = [
  "#1E2A44", // navy
  "#FF4F87", // rose pink
  "#34D399", // mint
  "#F59E0B", // amber
  "#3B82F6", // blue
  "#8B5CF6", // violet
];

export default function CardEditForm({ card }: { card: CreditCard }) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState(card.name);
  const [closingDay, setClosingDay] = useState(String(card.closing_day));
  const [paymentDay, setPaymentDay] = useState(String(card.payment_day));
  const [offset, setOffset] = useState(String(card.payment_month_offset));
  const [color, setColor] = useState(card.color);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: updateError } = await supabase
      .from("credit_cards")
      .update({
        name,
        closing_day: parseInt(closingDay),
        payment_day: parseInt(paymentDay),
        payment_month_offset: parseInt(offset),
        color,
      })
      .eq("id", card.id);

    if (updateError) {
      setError("保存に失敗しました");
      setLoading(false);
      return;
    }

    router.push("/cards");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="card-name" className="block text-sm font-medium mb-1">カード名</label>
        <input
          id="card-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="closing-day" className="block text-sm font-medium mb-1">締め日</label>
          <select
            id="closing-day"
            value={closingDay}
            onChange={(e) => setClosingDay(e.target.value)}
            className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
          >
            {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}日</option>
            ))}
            <option value="31">末日</option>
          </select>
        </div>

        <div>
          <label htmlFor="payment-day" className="block text-sm font-medium mb-1">支払日</label>
          <select
            id="payment-day"
            value={paymentDay}
            onChange={(e) => setPaymentDay(e.target.value)}
            className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
          >
            {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}日</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="offset" className="block text-sm font-medium mb-1">支払サイクル</label>
        <select
          id="offset"
          value={offset}
          onChange={(e) => setOffset(e.target.value)}
          className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
        >
          <option value="1">翌月払い</option>
          <option value="2">翌々月払い</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">カラー</label>
        <div className="flex gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`カラー ${c}`}
              onClick={() => setColor(c)}
              className="w-7 h-7 rounded-full transition-transform hover:scale-110"
              style={{
                backgroundColor: c,
                outline: color === c ? `3px solid ${c}` : "none",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
      </div>

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
