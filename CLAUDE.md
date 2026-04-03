@AGENTS.md

# クレカ支払い管理アプリ

## プロジェクト概要
クレジットカードの締め日・支払日を設定し、支出を入力すると「いつ引き落とされるか」を自動計算して表示する個人用Webアプリ。

**オーナー：** 主婦・3児の母・テニス好き。WEBデザイン/コーディング歴5年。制作ディレクター・プロデューサー経験あり。JSはAI頼り。ディレクター役でレビューする運用スタイル。

---

## 技術スタック
- **Frontend:** TypeScript / React / Next.js (App Router) / TailwindCSS
- **Backend:** Supabase (Auth + PostgreSQL + RLS)
- **Deploy:** Vercel
- **Repo:** GitHub

## カラーパレット
| 用途 | カラー | コード |
|------|--------|--------|
| メイン | ネイビー | `#1E2A44` |
| サブ | ホワイト | `#FFFFFF` |
| アクセント | ローズピンク | `#FF4F87` |
| 薄背景 | ピンクベージュ | `#FFF1F6` |
| 成功 | ミント | `#34D399` |

---

## 実装済み機能
- [x] Supabase Auth（メール＋パスワード認証）
- [x] ミドルウェア（未ログイン→/login リダイレクト）
- [x] カード管理（追加・編集・削除）
- [x] 支出入力（購入日・金額・カテゴリ・メモ）
- [x] 引き落とし月の自動計算（`lib/calcPaymentMonth.ts`）
- [x] 入力時リアルタイムプレビュー
- [x] 支出一覧（編集・削除）
- [x] ダッシュボード（月別・カード別・カテゴリ別集計）
- [x] カラーテーマ適用済み

---

## DBテーブル（Supabase）
- `credit_cards` : カード情報（締め日・支払日・offset・カラー）
- `expenses` : 支出データ（購入日・金額・カテゴリ・payment_year_month）
- 両テーブルともRLS有効・user_idで保護済み

---

## カード初期登録データ（アプリ内で手動登録）
| カード名 | 締め日 | 支払日 | offset |
|---------|--------|--------|--------|
| 楽天カード | 末日(31) | 27日 | 翌月(1) |
| 楽天カード（楽天市場） | 25日 | 27日 | 翌月(1) |
| Amazonカード | 末日(31) | 26日 | 翌月(1) |
| 三井住友VISA | 末日(31) | 26日 | 翌月(1) |

---

## フォルダ構成
```
app/
  login/page.tsx
  dashboard/page.tsx + DashboardClient.tsx
  expenses/page.tsx + ExpenseListClient.tsx
  expenses/new/page.tsx
  expenses/edit/[id]/page.tsx
  cards/page.tsx
  cards/edit/[id]/page.tsx

lib/
  supabaseClient.ts   # ブラウザ用
  supabaseServer.ts   # サーバー用
  calcPaymentMonth.ts # 引き落とし月計算ロジック
  categories.ts       # カテゴリ一覧
  types.ts            # 型定義

components/
  NavBar.tsx
  ExpenseForm.tsx / ExpenseEditForm.tsx
  CardForm.tsx / CardEditForm.tsx / CardList.tsx
```

---

## 次にやること（次回セッションの開始点）

### 1. Vercelデプロイ
- GitHubにpush（`git add . && git commit -m "init" && git push`）
- Vercel Dashboard → Import Repository
- 環境変数を設定：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy！

### 2. デプロイ後の確認
- スマホで開いて動作確認
- カード登録 → 支出入力 → ダッシュボード確認

---

## 将来の改善候補（今は未実装）
- Amazon CSVインポート
- カテゴリのカスタム追加
- 月次レポート・グラフ表示
- PWA対応（ホーム画面に追加）
