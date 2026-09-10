/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL?: string;
  readonly VITE_CALENDLY_URL?: string;
  readonly VITE_BREVO_REACTIVATION_FORM_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
