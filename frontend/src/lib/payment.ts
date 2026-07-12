export type PaymentMethod = "instapay" | "vodafone_cash";

// Same number as the WhatsApp contact — written in local format since that's
// what InstaPay/Vodafone Cash transfers expect in Egypt.
export const PAYMENT_NUMBER = "01507175754";

export function calculateDeposit(total: number): number {
  return Math.ceil(total / 2);
}

export function paymentMethodLabel(method: string, locale: "en" | "ar"): string {
  if (method === "instapay") return locale === "ar" ? "إنستاباي" : "InstaPay";
  if (method === "vodafone_cash") return locale === "ar" ? "فودافون كاش" : "Vodafone Cash";
  // Legacy orders placed before this payment method existed.
  return locale === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery";
}

export function buildOrderWhatsAppMessage({
  locale,
  orderNumber,
  totalPrice,
  depositAmount,
  paymentMethod,
}: {
  locale: "en" | "ar";
  orderNumber: string;
  totalPrice: number;
  depositAmount: number;
  paymentMethod: PaymentMethod;
}): string {
  const method = paymentMethodLabel(paymentMethod, locale);
  if (locale === "ar") {
    return `أهلاً KAIOR، طلبت أوردر رقم ${orderNumber} (الإجمالي: ${totalPrice} جنيه). هحول ${depositAmount} جنيه على الأقل عن طريق ${method} على الرقم ${PAYMENT_NUMBER}، وهبعتلكم إسكرين شوت التحويل هنا.`;
  }
  return `Hi KAIOR, I just placed order ${orderNumber} (Total: EGP ${totalPrice}). I'll transfer at least EGP ${depositAmount} via ${method} to ${PAYMENT_NUMBER} and send the payment screenshot here.`;
}

export function buildApprovalWhatsAppMessage({
  locale,
  customerName,
  orderNumber,
  remainingBalance,
}: {
  locale: "en" | "ar";
  customerName: string;
  orderNumber: string;
  remainingBalance: number;
}): string {
  if (locale === "ar") {
    return `أهلاً ${customerName}، طلبك من KAIOR رقم ${orderNumber} اتأكد بعد استلام الدفع. هيتجهز للشحن دلوقتي. المتبقي وقت الاستلام: ${remainingBalance} جنيه.`;
  }
  return `Hi ${customerName}, your KAIOR order ${orderNumber} is confirmed — we received your payment. It's now being prepared for shipping. Remaining balance on delivery: EGP ${remainingBalance}.`;
}

// Normalizes a local Egyptian number ("01xxxxxxxxx") to the international
// format wa.me needs ("201xxxxxxxxx"). Leaves already-international numbers
// untouched.
export function toWhatsAppPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `20${digits.slice(1)}`;
  return digits;
}

// Accepts either local ("01xxxxxxxxx") or international format — always
// normalizes before building the link, since wa.me requires international.
export function buildWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${toWhatsAppPhone(phone)}?text=${encodeURIComponent(message)}`;
}
