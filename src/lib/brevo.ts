import type { BrevoContactAttributes, BrevoContactPayload } from "../types";

/**
 * Serverseitiger Brevo-Client. Wird AUSSCHLIESSLICH von Cloudflare Pages
 * Functions importiert (siehe functions/api/submit-quiz.ts) – NIEMALS vom
 * Frontend. Der API-Key kommt ausschließlich aus einer Server-Environment-
 * Variable und wird nie geloggt oder an den Client zurückgegeben.
 *
 * Brevo berechnet KEINE Quiz-Ergebnisse (Vorgabe Abschnitt 4). Diese Datei
 * übernimmt ausschließlich: Kontakt anlegen/aktualisieren + Liste #24
 * zuordnen. Die Ergebnis-Mail selbst verschickt eine Brevo-Automation,
 * getriggert durch die Listenzuordnung (siehe docs/brevo-setup.md).
 */

const BREVO_CONTACTS_ENDPOINT = "https://api.brevo.com/v3/contacts";

export interface BrevoClientConfig {
  apiKey: string | undefined;
  listId: number;
}

export interface BrevoResult {
  success: boolean;
  /** true, wenn im Mock-Modus (kein API Key konfiguriert) simuliert wurde. */
  mocked: boolean;
  status?: number;
  error?: string;
}

export function buildBrevoPayload(
  email: string,
  attributes: BrevoContactAttributes,
  listId: number,
): BrevoContactPayload {
  return {
    email,
    attributes,
    listIds: [listId],
    updateEnabled: true,
  };
}

/**
 * Legt den Kontakt in Brevo an bzw. aktualisiert ihn (updateEnabled: true
 * sorgt dafür, dass ein bereits bestehender Kontakt aktualisiert statt
 * dupliziert wird, siehe Vorgabe Abschnitt 9) und ordnet ihn Liste #24 zu.
 * Der Rest (Ergebnis-Mail, Follow-up) übernimmt die Brevo-Automation.
 *
 * Läuft ohne konfigurierten API Key automatisch im Mock-Modus: Es wird kein
 * echter Kontakt angelegt, aber das Payload wird zurückgegeben, damit lokal
 * bzw. in Tests sichtbar ist, was an Brevo gesendet würde (Vorgabe
 * Abschnitt 59).
 */
export async function upsertBrevoContact(
  config: BrevoClientConfig,
  email: string,
  attributes: BrevoContactAttributes,
): Promise<BrevoResult> {
  const payload = buildBrevoPayload(email, attributes, config.listId);

  if (!config.apiKey) {
    return { success: true, mocked: true };
  }

  try {
    const response = await fetch(BREVO_CONTACTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": config.apiKey,
      },
      body: JSON.stringify(payload),
    });

    // Brevo gibt 204 für ein reines Update zurück, 201 für Neuanlage.
    if (response.status === 201 || response.status === 204) {
      return { success: true, mocked: false, status: response.status };
    }

    // 400 mit duplicate_parameter kann bei bestimmten Brevo-Konfigurationen
    // trotz updateEnabled:true auftreten – dann per PUT nachziehen.
    if (response.status === 400) {
      const putResponse = await fetch(`${BREVO_CONTACTS_ENDPOINT}/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": config.apiKey,
        },
        body: JSON.stringify({ attributes: payload.attributes, listIds: payload.listIds }),
      });
      if (putResponse.status === 204) {
        return { success: true, mocked: false, status: putResponse.status };
      }
      return { success: false, mocked: false, status: putResponse.status, error: "Brevo PUT fehlgeschlagen" };
    }

    return { success: false, mocked: false, status: response.status, error: "Brevo POST fehlgeschlagen" };
  } catch {
    // Kein Fehlerdetail/Secret loggen – nur generischer Fehlerstatus nach außen.
    return { success: false, mocked: false, error: "Brevo-Anfrage fehlgeschlagen" };
  }
}
