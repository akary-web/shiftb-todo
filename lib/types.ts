export type CreditCard = {
  id: string;
  user_id: string;
  name: string;
  closing_day: number;
  payment_day: number;
  payment_month_offset: number;
  color: string;
  created_at: string;
};

export type Expense = {
  id: string;
  user_id: string;
  card_id: string;
  amount: number;
  memo: string | null;
  purchase_date: string;
  category: string | null;
  payment_year_month: string;
  created_at: string;
  credit_cards?: CreditCard;
};
