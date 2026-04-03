import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "クレカ支払い管理",
  description: "クレジットカードの引き落とし予定を管理するアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-[#FFF1F6] text-[#1E2A44] min-h-screen">{children}</body>
    </html>
  );
}
