import { afterEach, describe, expect, it, vi } from "vitest";
import { onRequestGet, onRequestPost, type Env } from "./digistore24-webhook";

const PASSPHRASE = "test-passphrase-123";

async function signedBody(fields: Record<string, string>, passphrase: string): Promise<string> {
  const entries = Object.entries(fields)
    .map(([key, value]) => [key.toUpperCase(), value] as [string, string])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  const base = entries.map(([key, value]) => `${key}=${value}${passphrase}`).join("");
  const digest = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(base));
  const signature = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return new URLSearchParams({ ...fields, sha_sign: signature }).toString();
}

function buildContext(body: string, env: Partial<Env> = {}) {
  const request = new Request("https://rueckenbewusst-sein.de/api/digistore24-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return { request, env } as unknown as Parameters<typeof onRequestPost>[0];
}

const baseFields = {
  product_id: "734497",
  order_id: "ord-1",
  email: "anna@example.com",
  first_name: "Anna",
  last_name: "Muster",
  order_is_paid: "yes",
  event: "on_payment",
};

const baseEnv: Env = {
  BREVO_API_KEY: "test-key",
  BREVO_VIP_LIST_ID: "26",
  DIGISTORE24_VIP_PRODUCT_ID: "734497",
  DIGISTORE24_IPN_PASSPHRASE: PASSPHRASE,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /api/digistore24-webhook", () => {
  it("legt bei einem gültig signierten VIP-Kauf den Kontakt in Brevo an und antwortet mit OK", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchSpy);

    const body = await signedBody(baseFields, PASSPHRASE);
    const response = await onRequestPost(buildContext(body, baseEnv));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("OK");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [, init] = fetchSpy.mock.calls[0];
    const payload = JSON.parse(init.body);
    expect(payload).toEqual({
      email: "anna@example.com",
      attributes: { VORNAME: "Anna", NACHNAME: "Muster", VIP_2609: "vipaktiv" },
      listIds: [26],
      updateEnabled: true,
    });
  });

  it("setzt SMS/WHATSAPP, wenn Digistore24 eine gültige internationale Telefonnummer liefert", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchSpy);

    const fields = { ...baseFields, phone_no: "+4915112345678" };
    const body = await signedBody(fields, PASSPHRASE);
    const response = await onRequestPost(buildContext(body, baseEnv));

    expect(response.status).toBe(200);
    const [, init] = fetchSpy.mock.calls[0];
    const payload = JSON.parse(init.body);
    expect(payload.attributes).toEqual({
      VORNAME: "Anna",
      NACHNAME: "Muster",
      VIP_2609: "vipaktiv",
      SMS: "+4915112345678",
      WHATSAPP: "+4915112345678",
    });
  });

  it("lässt SMS/WHATSAPP weg, wenn die Telefonnummer kein gültiges internationales Format hat", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchSpy);

    const fields = { ...baseFields, phone_no: "0151 12345678" };
    const body = await signedBody(fields, PASSPHRASE);
    await onRequestPost(buildContext(body, baseEnv));

    const [, init] = fetchSpy.mock.calls[0];
    const payload = JSON.parse(init.body);
    expect(payload.attributes).toEqual({ VORNAME: "Anna", NACHNAME: "Muster", VIP_2609: "vipaktiv" });
  });

  it("lehnt Requests mit ungültiger Signatur ab, ohne Brevo zu kontaktieren", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const body = new URLSearchParams({ ...baseFields, sha_sign: "falsch" }).toString();
    const response = await onRequestPost(buildContext(body, baseEnv));

    expect(response.status).toBe(401);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("gibt bei fehlender IPN-Passphrase-Konfiguration einen 500er zurück", async () => {
    const body = await signedBody(baseFields, PASSPHRASE);
    const response = await onRequestPost(buildContext(body, { ...baseEnv, DIGISTORE24_IPN_PASSPHRASE: undefined }));
    expect(response.status).toBe(500);
  });

  it("ignoriert IPN-Aufrufe für ein anderes Produkt (kein Fehler, aber auch kein Brevo-Call)", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const fields = { ...baseFields, product_id: "111111" };
    const body = await signedBody(fields, PASSPHRASE);
    const response = await onRequestPost(buildContext(body, baseEnv));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("OK");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("meldet einen Fehler, wenn Brevo dauerhaft fehlschlägt", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 400 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));
    vi.stubGlobal("fetch", fetchSpy);

    const body = await signedBody(baseFields, PASSPHRASE);
    const response = await onRequestPost(buildContext(body, baseEnv));

    expect(response.status).toBe(502);
  });
});

describe("GET /api/digistore24-webhook (Health-Check)", () => {
  it("antwortet mit 200 ohne Kundendaten preiszugeben", async () => {
    const response = await onRequestGet({} as never);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ status: "ok" });
  });
});
