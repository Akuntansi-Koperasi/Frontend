// @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  {
    ignores: [
      ".output/**",
      ".nitro/**",
      "dist/**",
      "node_modules/**",
      "eslint.config.js",
      "prettier.config.js",
      "src/components/deprecated/**",
      "src/components/ui/**",
      "src/services/deprecated/**",
    ],
  },
  ...tanstackConfig,
];
