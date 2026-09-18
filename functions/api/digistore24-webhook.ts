import { extractVipPurchase, verifyDigistore24Signature } from "../../src/lib/digistore24";
import { upsertBrevoContact } from "../../src/lib/brevo";
import { isValidEmail } from "../../src/lib/validation";

/**
 * Cloudflare Pages Function: POST /api/digistore24-webhook
 *
 * Nimmt Digistore24-IPN-Aufrufe für das VIP-Paket entgegen, verifiziert die
 * sha_sign-Signatur, und legt bei einem erfolgreichen, bezahlten Kauf des
 * konfigurierten VIP-Produkts den Kontakt in Brevo an/aktualisiert ihn,
 * ordnet ihn der VIP-Liste zu und setzt das Attribut VIP_2609.
 *
 * Digistore24 erwartet bei Erfolg exakt den Response-Body "OK" (Großbuch-
 * staben, ohne Zusatztext) mit HTTP 2xx – sonst wird der IPN-Call wiederholt.
 */

export interface Env {
  BREVO_API_KEY?: string;
  BREVO_VIP_LIST_ID?: string;
  BREVO_VIP_ATTRIBUTE_VALUE?: string;
  DIGISTORE24_VIP_PRODUCT_ID?: string;
  DIGISTORE24_IPN_PASSPHRASE?: string;
}

const DEFAULT_VIP_LIST_ID = 26;
const DEFAULT_VIP_PRODUCT_ID = "734497";
const DEFAULT_VIP_ATTRIBUTE_VALUE = "vipaktiv";

function okResponse(): Response {
  return new Response("OK", { status: 200, headers: { "Content-Type": "text/plain" } });
}

function errorResponse(logMessage: string, status: number): Response {
  // Nur ein generischer Fehlertext geht nach außen; Details landen ausschließlich im Cloudflare-Log.
  console.error(`[digistore24-webhook] ${logMessage}`);
  return new Response("Fehler bei der Verarbeitung.", { status, headers: { "Content-Type": "text/plain" } });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.DIGISTORE24_IPN_PASSPHRASE) {
    return errorResponse("DIGISTORE24_IPN_PASSPHRASE ist nicht als Secret konfiguriert.", 500);
  }

  let params: URLSearchParams;
  try {
    const raw = await request.text();
    params = new URLSearchParams(raw);
  } catch {
    return errorResponse("Request-Body konnte nicht gelesen werden.", 400);
  }

  const signatureValid = await verifyDigistore24Signature(params, env.DIGISTORE24_IPN_PASSPHRASE);
  if (!signatureValid) {
    return errorResponse("Ungültige oder fehlende sha_sign-Signatur.", 401);
  }

  const vipProductId = env.DIGISTORE24_VIP_PRODUCT_ID ?? DEFAULT_VIP_PRODUCT_ID;
  const purchase = extractVipPurchase(params, vipProductId);

  // Kein Kauf des VIP-Produkts (anderes Produkt, nicht bezahlt, Rückerstattung/Chargeback, …).
  // Kein Fehler – Digistore24 sendet IPN-Aufrufe für viele Events, die uns hier nicht interessieren.
  if (!purchase) {
    return okResponse();
  }

  if (!isValidEmail(purchase.email)) {
    return errorResponse(
      `Order ${purchase.orderId}: keine gültige E-Mail-Adresse im IPN-Payload gefunden.`,
      400,
    );
  }

  const listId = Number.parseInt(env.BREVO_VIP_LIST_ID ?? "", 10) || DEFAULT_VIP_LIST_ID;
  const vipAttributeValue = env.BREVO_VIP_ATTRIBUTE_VALUE ?? DEFAULT_VIP_ATTRIBUTE_VALUE;

  const brevoResult = await upsertBrevoContact({ apiKey: env.BREVO_API_KEY, listId }, purchase.email, {
    VORNAME: purchase.firstName,
    NACHNAME: purchase.lastName,
    VIP_2609: vipAttributeValue,
  });

  if (!brevoResult.success) {
    return errorResponse(`Brevo-Synchronisierung fehlgeschlagen für Order ${purchase.orderId}.`, 502);
  }

  return okResponse();
};

/** Health-Check: erreichbar ohne Kundendaten preiszugeben. */
export const onRequestGet: PagesFunction = async () => {
  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
