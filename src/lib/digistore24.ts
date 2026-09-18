/**
 * Digistore24 IPN (Instant Payment Notification) – Signaturprüfung und
 * Feld-Extraktion für den VIP-Paket-Kauf-Webhook.
 *
 * Feldnamen und der sha_sign-Algorithmus basieren auf Digistore24s
 * öffentlichem Referenzskript (sha_sign.php) und dem Open-Source-Paket
 * digistore24/digistore24-ipn. Da die offizielle dev.digistore24.com-Doku aus
 * dieser Umgebung heraus nicht erreichbar war, sollte das Feld-Mapping nach
 * dem ersten echten Test-IPN (Digistore24 → Produkt → Auslieferung →
 * "Test-IPN senden") verifiziert werden.
 */

const NEGATIVE_EVENT_KEYWORDS = ["refund", "chargeback", "dispute", "cancel", "missed"];

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Prüft die sha_sign-Signatur eines Digistore24-IPN-Requests.
 * Algorithmus: sha_sign/SHASIGN entfernen, restliche Parameter nach
 * GROSSGESCHRIEBENEM Namen sortieren, "KEY=value<passphrase>" aneinanderhängen,
 * SHA-512 bilden und als Großbuchstaben-Hex mit dem gesendeten sha_sign vergleichen.
 */
export async function verifyDigistore24Signature(
  params: URLSearchParams,
  passphrase: string,
): Promise<boolean> {
  const receivedSignature = params.get("sha_sign") ?? params.get("SHASIGN");
  if (!receivedSignature) return false;

  const entries: [string, string][] = [];
  for (const [key, value] of params.entries()) {
    const upperKey = key.toUpperCase();
    if (upperKey === "SHA_SIGN" || upperKey === "SHASIGN") continue;
    entries.push([upperKey, value]);
  }
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

  const signatureBase = entries.map(([key, value]) => `${key}=${value}${passphrase}`).join("");

  const digest = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(signatureBase));
  const computedSignature = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return constantTimeEqual(computedSignature, receivedSignature.toUpperCase());
}

export interface Digistore24VipPurchase {
  email: string;
  firstName: string;
  lastName: string;
  productId: string;
  orderId: string;
  eventName: string;
}

/**
 * Liefert die Kaufdaten zurück, wenn dieser IPN-Aufruf einen erfolgreich
 * bezahlten Kauf des konfigurierten VIP-Produkts darstellt – sonst `null`
 * (z.B. anderes Produkt, nicht bezahlt, Rückerstattung/Chargeback). `null`
 * ist kein Fehler, sondern der normale Fall für alle anderen IPN-Events.
 */
export function extractVipPurchase(params: URLSearchParams, vipProductId: string): Digistore24VipPurchase | null {
  const productId = params.get("product_id");
  if (!productId || productId !== vipProductId) return null;

  const orderIsPaid = (params.get("order_is_paid") ?? "").toLowerCase();
  const isPaid = orderIsPaid === "yes" || orderIsPaid === "1" || orderIsPaid === "true";
  if (!isPaid) return null;

  const eventName = params.get("event") ?? "";
  const billingStatus = params.get("billing_status") ?? "";
  const isNegativeEvent = NEGATIVE_EVENT_KEYWORDS.some(
    (keyword) => eventName.toLowerCase().includes(keyword) || billingStatus.toLowerCase().includes(keyword),
  );
  if (isNegativeEvent) return null;

  const email = params.get("email") ?? params.get("buyer_email");
  if (!email) return null;

  return {
    email,
    firstName: params.get("first_name") ?? params.get("address_first_name") ?? "",
    lastName: params.get("last_name") ?? params.get("address_last_name") ?? "",
    productId,
    orderId: params.get("order_id") ?? "",
    eventName,
  };
}
