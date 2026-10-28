import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
// Fonts are bundled with the site so it works offline.
import "@fontsource/noto-sans-gujarati/400.css";
import "@fontsource/noto-sans-gujarati/700.css";
import "@fontsource/baloo-bhai-2/600.css";
import "@fontsource/baloo-bhai-2/700.css";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "./theme";
import "./styles.css";
import { App } from "./App";

// Old links used hash URLs (#/topic/p1-t01). Move them to the clean URL (/topic/p1-t01).
if (window.location.hash.startsWith("#/")) {
  window.history.replaceState(null, "", window.location.hash.slice(1));
}

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Built pages already contain the page's HTML (for search engines); React takes it over.
// In development the root is empty, so React draws it from scratch.
if (root.hasChildNodes() && root.dataset.path === window.location.pathname) {
  hydrateRoot(root, app);
} else {
  root.textContent = "";
  createRoot(root).render(app);
}
