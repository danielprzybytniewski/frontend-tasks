import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "coverage/",
        "public/",
        "vite.config.ts",
        "vitest.config.ts",
        "eslint.config.js",
        "src/main.tsx",
        "**/src/**/types/**",
        "**/src/components/ui/**",
        "**/src/lib/**",
        "**src/__tests__/**",
        "**src/**/__tests__/**",
        "**/src/**/__mocks__/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
