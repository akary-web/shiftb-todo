"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { Expense } from "@/lib/types";
import { Trash2 } from "lucide-react";

type Props = {
  expenses: (Expense & { credit_cards: { name: string; color: string } })[];
};

export default function ExpenseListClient({ expenses }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const currentYM = new Date().toISOString().slice(0, 7);
  const allMonths = useMemo(() => {
    const months = [...new Set(expenses.map((e) => e.payment_year_month))].sort();
    return months;
  }, [expenses]);

  const defaultMonth = useMemo(() => {
    const upcoming = allMonths.filter((m) => m >= currentYM);
    return upcoming[0] ?? allMonths[allMonths.length - 1] ?? currentYM;
  }, [allMonths, currentYM]);

  const [selectedYM, setSelectedYM] = useState(defaultMonth);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const [year, month] = selectedYM.split("-");

  function prevMonth() {
    const idx = allMonths.indexOf(selectedYM);
    if (idx > 0) { setSelectedYM(allMonths[idx - 1]); setCheckedIds(new Set()); }
  }
  function nextMonth() {
    const idx = allMonths.indexOf(selectedYM);
    if (idx < allMonths.length - 1) { setSelectedYM(allMonths[idx + 1]); setCheckedIds(new Set()); }
  }

  const filtered = expenses.filter((e) => e.payment_year_month === selectedYM);

  const byCard = useMemo(() => {
    const map: Record<string, {
      name: string; color: string; total: number; items: typeof filtered;
    }> = {};
    for (const e of filtered) {
      if (!map[e.card_id]) {
        map[e.card_id] = { name: e.credit_cards?.name ?? "不明", color: e.credit_cards?.color ?? "#1E2A44", total: 0, items: [] };
      }
      map[e.card_id].total += e.amount;
      map[e.card_id].items.push(e);
    }
    return map;
  }, [filtered]);

  function toggleCheck(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (checkedIds.size === filtered.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(filtered.map((e) => e.id)));
    }
  }

  function toggleCardAll(items: typeof filtered) {
    const ids = items.map((e) => e.id);
    const allChecked = ids.every((id) => checkedIds.has(id));
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  async function handleDeleteChecked() {
    if (!confirm(`選択した${checkedIds.size}件を削除しますか？`)) return;
    await supabase.from("expenses").delete().in("id", [...checkedIds]);
    setCheckedIds(new Set());
    router.refresh();
  }

  async function handleDeleteOne(id: string) {
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
    <div className="space-y-4">
      {/* 月切り替え */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={prevMonth} disabled={allMonths.indexOf(selectedYM) === 0}
          className="p-2 rounded-lg hover:bg-pink-50 transition-colors text-gray-400 disabled:opacity-30">←</button>
        <div className="text-center">
          <p className="text-xs text-gray-400">引き落とし予定月</p>
          <p className="text-lg font-bold text-[#1E2A44]">{year}年{parseInt(month)}月</p>
        </div>
        <button type="button" onClick={nextMonth} disabled={allMonths.indexOf(selectedYM) === allMonths.length - 1}
          className="p-2 rounded-lg hover:bg-pink-50 transition-colors text-gray-400 disabled:opacity-30">→</button>
      </div>

      {/* 合計 */}
      <div className="bg-[#1E2A44] rounded-2xl px-5 py-4 flex justify-between items-center text-white">
        <span className="text-sm opacity-70">合計</span>
        <span className="text-2xl font-bold">¥{filtered.reduce((s, e) => s + e.amount, 0).toLocaleString()}</span>
      </div>


      {/* カード別グループ */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">この月の支出データはありません</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(byCard).map(([cardId, group]) => (
            <div key={cardId} className="bg-white rounded-2xl border border-pink-50 overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-3" style={{ borderLeft: `4px solid ${group.color}` }}>
                <input
                  type="checkbox"
                  aria-label={`${group.name}をすべて選択`}
                  checked={group.items.every((e) => checkedIds.has(e.id))}
                  onChange={() => toggleCardAll(group.items)}
                  className="accent-[#FF4F87] w-4 h-4 shrink-0"
                />
                <span className="font-bold text-sm text-[#1E2A44] flex-1">{group.name}</span>
                {group.items.some((e) => checkedIds.has(e.id)) ? (
                  <button
                    type="button"
                    onClick={handleDeleteChecked}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={13} />
                    {group.items.filter((e) => checkedIds.has(e.id)).length}件を削除
                  </button>
                ) : (
                  <span className="font-bold text-sm text-[#1E2A44]">¥{group.total.toLocaleString()}</span>
                )}
              </div>
              <div className="divide-y divide-[#FFF1F6]">
                {group.items.map((e) => (
                  <div key={e.id} className="px-4 py-3 flex items-center gap-3">
                    <input
                      type="checkbox"
                      aria-label={`${e.memo || "支出"}を選択`}
                      checked={checkedIds.has(e.id)}
                      onChange={() => toggleCheck(e.id)}
                      className="accent-[#FF4F87] w-4 h-4 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-[#1E2A44]">{e.memo || "（メモなし）"}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{e.purchase_date.replace(/-/g, "/")}</span>
                        {e.category && <span className="text-xs text-gray-400">{e.category}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-1">
                      <span className="font-bold text-sm text-[#1E2A44]">¥{e.amount.toLocaleString()}</span>
                      <Link href={`/expenses/edit/${e.id}`} className="text-xs text-gray-400 hover:text-[#FF4F87] transition-colors">編集</Link>
                      <button type="button" onClick={() => handleDeleteOne(e.id)}
                        className="text-gray-300 hover:text-red-400 text-lg leading-none transition-colors">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
