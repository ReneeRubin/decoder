/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL?: string;
  readonly VITE_CALENDLY_URL?: string;
  readonly VITE_BREVO_REACTIVATION_FORM_URL?: string;
  readonly VITE_META_PIXEL_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Meta (Facebook) Pixel global, gesetzt vom Basis-Snippet in index.html. Nur vorhanden, wenn VITE_META_PIXEL_ID gesetzt ist. */
  fbq?: (...args: unknown[]) => void;
}
