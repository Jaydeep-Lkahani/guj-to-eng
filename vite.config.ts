import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Absolute paths: pages live at /part/... and /topic/..., so assets must load from the site root.
  base: "/",
  test: {
    environment: "jsdom",
  },
});
