/**
 * 購入日とカード設定から「引き落とし月（YYYY-MM）」を計算する
 *
 * ルール:
 * - closing_day == 31 → 末日締め：購入月がそのまま締め月
 * - それ以外 → 購入日 <= 締め日なら当月締め、超えたら翌月締め
 * - 締め月 + payment_month_offset が引き落とし月
 */
export function calcPaymentMonth(
  purchaseDate: Date,
  closingDay: number,
  paymentMonthOffset: number
): string {
  const day = purchaseDate.getDate();
  const month = purchaseDate.getMonth(); // 0-indexed
  const year = purchaseDate.getFullYear();

  let statementYear = year;
  let statementMonth = month; // 0-indexed

  if (closingDay !== 31) {
    if (day > closingDay) {
      // 翌月締め
      statementMonth = month + 1;
      if (statementMonth > 11) {
        statementMonth = 0;
        statementYear += 1;
      }
    }
  }

  // 引き落とし月 = 締め月 + offset
  let paymentMonth = statementMonth + paymentMonthOffset;
  let paymentYear = statementYear;
  while (paymentMonth > 11) {
    paymentMonth -= 12;
    paymentYear += 1;
  }

  const mm = String(paymentMonth + 1).padStart(2, "0");
  return `${paymentYear}-${mm}`;
}
