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
  {
    // React Compiler purity rules assume a pure-render model that doesn't
    // apply to React Three Fiber's useFrame — it runs outside React's commit
    // phase once per animation frame, and mutating refs/three.js objects
    // there is the standard, required R3F pattern (not a bug). Scoped to the
    // 3D hero directory rather than disabled globally.
    files: ["src/components/hero/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
