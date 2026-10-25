import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Fonts are bundled with the site so it works offline.
import "@fontsource/noto-sans-gujarati/400.css";
import "@fontsource/noto-sans-gujarati/700.css";
import "@fontsource/baloo-bhai-2/600.css";
import "@fontsource/baloo-bhai-2/700.css";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "./theme";
import "./styles.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
