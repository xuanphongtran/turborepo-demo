import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    ignores: ["dist/**", "**/*.css"],
  },
  {
    rules: {
      "react/prop-types": "off", // TypeScript handles prop validation
    },
  },
];
