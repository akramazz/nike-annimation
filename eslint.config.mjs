import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default [
  ...nextCoreWebVitals,
  ...nextTs,
  {
    ignores: [".next/**", "node_modules/**", ".kilo/**"],
  },
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      "react/jsx-no-undef": "warn",
      "prefer-const": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "import/no-unresolved": "off",
      "react-hooks/purity": "warn",
    },
  },
];
