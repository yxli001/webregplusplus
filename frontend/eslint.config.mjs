import js from "@eslint/js";
import globals from "globals";
import typescriptEslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import nextPlugin from "@next/eslint-plugin-next";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";

// Create a basic ESLint flat config
const eslintConfig = [
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
      import: importPlugin,
      next: nextPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
  },
  // Rules for Next.js
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      // Allow import styled from "styled-components"
      "import/no-named-as-default": "off",

      // Getting the eslint resolver working is left as an exercise to the reader.
      "import/no-unresolved": "off",

      // Custom type declarations
      "@typescript-eslint/no-empty-interface": "off",

      // Uncomment these if you really need to.
      // "@typescript-eslint/ban-ts-comment": "off",
      // "@typescript-eslint/no-explicit-any": "off",
      // "@typescript-eslint/no-non-null-assertion": "off",

      // Avoid bugs.
      "@typescript-eslint/no-shadow": [
        "error",
        { ignoreTypeValueShadow: true },
      ],
      "@typescript-eslint/no-unsafe-unary-minus": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "array-callback-return": "error",
      eqeqeq: "error",
      "no-await-in-loop": "error",
      "no-constant-binary-expression": "error",
      "no-constructor-return": "error",
      "no-constant-condition": [
        "error",
        {
          checkLoops: false,
        },
      ],
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",

      // Stylistic.
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/prefer-readonly": "warn",
      "@typescript-eslint/prefer-regexp-exec": "warn",
      "@typescript-eslint/prefer-for-of": "off",
      "object-shorthand": ["warn", "properties"],
      "sort-imports": ["warn", { ignoreDeclarationSort: true }],
      "import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
      "import/order": [
        "warn",
        {
          alphabetize: { order: "asc" },
          groups: [
            "builtin",
            "external",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
        },
      ],
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-non-null-assertion": "off",

      // Disabled because of too many false positives.
      "@typescript-eslint/no-unnecessary-condition": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
