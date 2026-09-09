import { afterEach, describe, expect, it, vi } from "vitest";
import { buildBrevoPayload, upsertBrevoContact } from "./brevo";
import type { BrevoContactAttributes } from "../types";

const attributes: BrevoContactAttributes = {
  FNAME: "Anna",
  SCHMERZ_DECODER_ERGEBNIS: "Die Funktionierende",
  SCHMERZ_DECODER_SEKUNDAERCODE: "Die Überladene",
  SCHMERZ_DECODER_SPUR: "Energie",
  SCHMERZ_DECODER_VERSION: "v1",
  SCHMERZ_DECODER_DATUM: "2026-01-15",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("14. Brevo Payload korrekt", () => {
  it("baut das Payload exakt nach Vorgabe (E-Mail, Attribute, Liste #24)", () => {
    const payload = buildBrevoPayload("anna@example.com", attributes, 24);
    expect(payload).toEqual({
      email: "anna@example.com",
      attributes,
      listIds: [24],
      updateEnabled: true,
    });
  });

  it("läuft ohne API Key im Mock-Modus ohne echten Netzwerkaufruf", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await upsertBrevoContact({ apiKey: undefined, listId: 24 }, "anna@example.com", attributes);

    expect(result).toEqual({ success: true, mocked: true });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sendet mit echtem API Key einen POST an die Brevo Contacts API", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchSpy);

    const result = await upsertBrevoContact(
      { apiKey: "test-key", listId: 24 },
      "anna@example.com",
      attributes,
    );

    expect(result.success).toBe(true);
    expect(result.mocked).toBe(false);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/contacts");
    expect(init.method).toBe("POST");
    expect(init.headers["api-key"]).toBe("test-key");
    expect(JSON.parse(init.body)).toEqual({
      email: "anna@example.com",
      attributes,
      listIds: [24],
      updateEnabled: true,
    });
  });
});

describe("18. bestehender Brevo-Kontakt (Update statt Duplicate)", () => {
  it("fällt bei 400 vom POST auf ein PUT-Update zurück, statt einen Duplicate-Fehler zu erzeugen", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 400 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchSpy);

    const result = await upsertBrevoContact(
      { apiKey: "test-key", listId: 24 },
      "anna@example.com",
      attributes,
    );

    expect(result.success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    const [putUrl, putInit] = fetchSpy.mock.calls[1];
    expect(putUrl).toBe("https://api.brevo.com/v3/contacts/anna%40example.com");
    expect(putInit.method).toBe("PUT");
  });

  it("gibt success:false zurück, wenn auch das PUT-Update fehlschlägt", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 400 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));
    vi.stubGlobal("fetch", fetchSpy);

    const result = await upsertBrevoContact(
      { apiKey: "test-key", listId: 24 },
      "anna@example.com",
      attributes,
    );

    expect(result.success).toBe(false);
  });
});
