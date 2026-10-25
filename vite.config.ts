import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative paths so the built site works from any folder or host.
  base: "./",
  test: {
    environment: "jsdom",
  },
});
