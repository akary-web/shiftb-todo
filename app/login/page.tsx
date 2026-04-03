"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setError("確認メールを送信しました。メールをご確認ください。");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-pink-100 p-8">
        <h1 className="text-2xl font-bold text-center mb-1 text-[#1E2A44]">
          クレカ支払い管理
        </h1>
        <p className="text-xs text-[#FF4F87] text-center mb-8 font-medium tracking-wide">
          MY CARD TRACKER
        </p>
        <p className="text-sm text-gray-500 text-center -mt-4 mb-8">
          {isSignUp ? "アカウントを作成" : "ログイン"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#1E2A44]">
              メールアドレス
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#1E2A44]">
              パスワード
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-pink-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F87]"
              placeholder="6文字以上"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E2A44] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#162035] disabled:opacity-50 transition-colors"
          >
            {loading ? "処理中..." : isSignUp ? "新規登録" : "ログイン"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
          }}
          className="w-full text-sm text-[#FF4F87] mt-4 hover:underline"
        >
          {isSignUp
            ? "すでにアカウントをお持ちの方はこちら"
            : "新規登録はこちら"}
        </button>
      </div>
    </div>
  );
}
