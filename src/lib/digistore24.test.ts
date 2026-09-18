import { describe, expect, it } from "vitest";
import { extractVipPurchase, normalizePhoneNumber, verifyDigistore24Signature } from "./digistore24";

const PASSPHRASE = "test-passphrase-123";

/** Referenzimplementierung des sha_sign-Algorithmus, unabhängig von der Produktionsfunktion nachgebaut. */
async function computeExpectedSignature(fields: Record<string, string>, passphrase: string): Promise<string> {
  const entries = Object.entries(fields)
    .map(([key, value]) => [key.toUpperCase(), value] as [string, string])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  const base = entries.map(([key, value]) => `${key}=${value}${passphrase}`).join("");
  const digest = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(base));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function paramsWithSignature(fields: Record<string, string>, signature: string): URLSearchParams {
  return new URLSearchParams({ ...fields, sha_sign: signature });
}

describe("verifyDigistore24Signature", () => {
  it("akzeptiert eine korrekt berechnete Signatur", async () => {
    const fields = { order_id: "12345", email: "anna@example.com", product_id: "734497" };
    const signature = await computeExpectedSignature(fields, PASSPHRASE);

    const valid = await verifyDigistore24Signature(paramsWithSignature(fields, signature), PASSPHRASE);
    expect(valid).toBe(true);
  });

  it("lehnt eine manipulierte Signatur ab", async () => {
    const fields = { order_id: "12345", email: "anna@example.com", product_id: "734497" };
    const signature = await computeExpectedSignature(fields, PASSPHRASE);

    const tampered = paramsWithSignature({ ...fields, email: "boese@example.com" }, signature);
    const valid = await verifyDigistore24Signature(tampered, PASSPHRASE);
    expect(valid).toBe(false);
  });

  it("lehnt eine Signatur mit falscher Passphrase ab", async () => {
    const fields = { order_id: "12345", email: "anna@example.com" };
    const signature = await computeExpectedSignature(fields, "falsche-passphrase");

    const valid = await verifyDigistore24Signature(paramsWithSignature(fields, signature), PASSPHRASE);
    expect(valid).toBe(false);
  });

  it("lehnt einen Request ohne sha_sign ab", async () => {
    const valid = await verifyDigistore24Signature(new URLSearchParams({ order_id: "12345" }), PASSPHRASE);
    expect(valid).toBe(false);
  });
});

describe("extractVipPurchase", () => {
  it("erkennt einen bezahlten Kauf des VIP-Produkts", () => {
    const params = new URLSearchParams({
      product_id: "734497",
      order_id: "ord-1",
      email: "anna@example.com",
      first_name: "Anna",
      last_name: "Muster",
      order_is_paid: "yes",
      event: "on_payment",
    });

    const purchase = extractVipPurchase(params, "734497");
    expect(purchase).toEqual({
      email: "anna@example.com",
      firstName: "Anna",
      lastName: "Muster",
      phone: null,
      productId: "734497",
      orderId: "ord-1",
      eventName: "on_payment",
    });
  });

  it("übernimmt eine gültige internationale Telefonnummer", () => {
    const params = new URLSearchParams({
      product_id: "734497",
      email: "anna@example.com",
      order_is_paid: "yes",
      phone_no: "+49 151 12345678",
    });
    const purchase = extractVipPurchase(params, "734497");
    expect(purchase?.phone).toBe("+4915112345678");
  });

  it("ignoriert eine Telefonnummer ohne internationales Format", () => {
    const params = new URLSearchParams({
      product_id: "734497",
      email: "anna@example.com",
      order_is_paid: "yes",
      phone_no: "0151 12345678",
    });
    const purchase = extractVipPurchase(params, "734497");
    expect(purchase?.phone).toBeNull();
  });

  it("ignoriert Käufe eines anderen Produkts", () => {
    const params = new URLSearchParams({
      product_id: "999999",
      email: "anna@example.com",
      order_is_paid: "yes",
    });
    expect(extractVipPurchase(params, "734497")).toBeNull();
  });

  it("ignoriert unbezahlte Bestellungen", () => {
    const params = new URLSearchParams({
      product_id: "734497",
      email: "anna@example.com",
      order_is_paid: "no",
    });
    expect(extractVipPurchase(params, "734497")).toBeNull();
  });

  it("ignoriert Rückerstattungen/Chargebacks, auch wenn order_is_paid gesetzt ist", () => {
    const params = new URLSearchParams({
      product_id: "734497",
      email: "anna@example.com",
      order_is_paid: "yes",
      event: "on_refund",
    });
    expect(extractVipPurchase(params, "734497")).toBeNull();
  });

  it("fällt für Vor-/Nachname auf address_first_name/address_last_name zurück", () => {
    const params = new URLSearchParams({
      product_id: "734497",
      email: "anna@example.com",
      order_is_paid: "yes",
      address_first_name: "Anna",
      address_last_name: "Muster",
    });
    const purchase = extractVipPurchase(params, "734497");
    expect(purchase?.firstName).toBe("Anna");
    expect(purchase?.lastName).toBe("Muster");
  });

  it("gibt null zurück, wenn keine E-Mail-Adresse vorhanden ist", () => {
    const params = new URLSearchParams({
      product_id: "734497",
      order_is_paid: "yes",
    });
    expect(extractVipPurchase(params, "734497")).toBeNull();
  });
});

describe("normalizePhoneNumber", () => {
  it("akzeptiert eine internationale Nummer und entfernt Leerzeichen/Klammern/Bindestriche", () => {
    expect(normalizePhoneNumber("+49 (151) 123-45678")).toBe("+4915112345678");
  });

  it("lehnt eine Nummer ohne führendes + ab", () => {
    expect(normalizePhoneNumber("0151 12345678")).toBeNull();
  });

  it("gibt null für leere/fehlende Werte zurück", () => {
    expect(normalizePhoneNumber(null)).toBeNull();
    expect(normalizePhoneNumber("")).toBeNull();
  });
});
