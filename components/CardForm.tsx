"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

const PRESET_COLORS = [
  "#1E2A44", // navy
  "#FF4F87", // rose pink
  "#34D399", // mint
  "#F59E0B", // amber
  "#3B82F6", // blue
  "#8B5CF6", // violet
];

export default function CardForm() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [closingDay, setClosingDay] = useState("31");
  const [paymentDay, setPaymentDay] = useState("27");
  const [offset, setOffset] = useState("1");
  const [color, setColor] = useState(PRESET_COLORS[1]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error: insertError } = await supabase.from("credit_cards").insert({
      user_id: user.id,
      name,
      closing_day: parseInt(closingDay),
      payment_day: parseInt(paymentDay),
      payment_month_offset: parseInt(offset),
      color,
    });

    if (insertError) {
      setError("保存に失敗しました");
      setLoading(false);
      return;
    }

    setName("");
    setClosingDay("31");
    setPaymentDay("27");
    setOffset("1");
    router.refresh();
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">カード名</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
          placeholder="例：楽天カード（楽天市場）"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">締め日</label>
          <select
            value={closingDay}
            onChange={(e) => setClosingDay(e.target.value)}
            className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
          >
            {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}日
              </option>
            ))}
            <option value="31">末日</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">支払日</label>
          <select
            value={paymentDay}
            onChange={(e) => setPaymentDay(e.target.value)}
            className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
          >
            {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}日
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">支払サイクル</label>
        <select
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1E2A44] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#162035] disabled:opacity-50 transition-colors"
      >
        {loading ? "追加中..." : "カードを追加"}
      </button>
    </form>
  );
}
