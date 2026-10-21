import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "work/**",
    ".wrangler/**",
    ".vinext/**",
    ".sites-runtime/**",
    "next-env.d.ts",
  ]),
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      // Ordinary document links are deliberate on this content-heavy Sites
      // deployment; they remain crawlable without client-router prefetching.
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    files: ["app/home-client.tsx", "app/scene.tsx", "app/startup-intro.tsx", "app/theme-toggle.tsx"],
    rules: {
      // Existing animation and theme lifecycles predate this SEO change.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
  {
    files: ["tests/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    files: ["components/GlowCursor.jsx"],
    rules: { "react-hooks/refs": "off" },
  },
  {
    files: ["components/ui/**/*.{ts,tsx}", "hooks/use-mobile.ts"],
    rules: {
      // These files are vendored verbatim from shadcn@4.17.0. Keep the
      // registry source intact while applying the stricter rules to Site code.
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
