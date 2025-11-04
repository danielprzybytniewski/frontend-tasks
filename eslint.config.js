import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            [
              "^react", // React imports first (react, react-dom, etc.)
              "^@?\\w", // External packages from npm (including scoped packages)
              "^node:", // Node.js built-in modules (node:fs, node:path, etc.)
              "^\\u0000", // Side effect imports (e.g., import './styles.css')
              "^[^.]", // Absolute imports and other imports not starting with . (aliased paths)
              "^\\.", // Relative imports (./ and ../)
            ],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
]);
