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
    "next-env.d.ts",
  ]),
  // Admin and API routes: backend-only code where `any` types are acceptable
  {
    files: [
      "app/admin/**",
      "app/api/**",
      "components/admin/**",
      "lib/admin/**",
      "scripts/**",
      "services/**",
    ],
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  // Mongoose models and lib utilities — `any` is idiomatic for Mongoose lean()
  {
    files: ["lib/models/**", "lib/email.ts", "lib/serialize.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // Miscellaneous non-admin pages with legacy any usage
  {
    files: [
      "app/\\[country\\]/**",
      "app/contact/**",
      "app/legal/**",
      "app/offline/**",
      "app/reseller/**",
      "app/restream/**",
      "components/ui/**",
    ],
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
