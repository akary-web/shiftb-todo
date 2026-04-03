export const CATEGORIES = [
  "食費・スーパー",
  "外食",
  "日用品",
  "ガソリン",
  "光熱費",
  "通信・サブスク",
  "定期便",
  "医療・薬",
  "被服・美容",
  "教育・習い事",
  "テニス",
  "その他",
] as const;

export type Category = (typeof CATEGORIES)[number];
