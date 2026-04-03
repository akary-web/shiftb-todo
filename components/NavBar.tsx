"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

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
    { href: "/dashboard", label: "ダッシュボード" },
    { href: "/expenses", label: "支出一覧" },
    { href: "/cards", label: "カード管理" },
  ];

  return (
    <header className="bg-white border-b border-pink-100 sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <nav className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-[#FF4F87]"
                  : "text-gray-400 hover:text-[#1E2A44]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-[#FF4F87] transition-colors"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
