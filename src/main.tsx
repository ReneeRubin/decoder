import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initMetaPixel } from "./lib/metaPixel";
import "./styles/global.css";

initMetaPixel();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root-Element nicht gefunden.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
