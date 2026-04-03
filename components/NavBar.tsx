"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { LayoutDashboard, List, CreditCard } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const links = [
    { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
    { href: "/expenses", label: "支出一覧", icon: List },
    { href: "/cards", label: "カード管理", icon: CreditCard },
  ];

  return (
    <header className="bg-white border-b border-pink-100 sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <nav className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-[#FF4F87]"
                  : "text-gray-400 hover:text-[#1E2A44]"
              }`}
            >
              <link.icon size={15} />
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-[#FF4F87] transition-colors"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
