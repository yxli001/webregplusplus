import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import prettier from "eslint-config-prettier";
import tsImport from "eslint-plugin-import";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
      import: tsImport,
    },
    rules: {
      // Built-in rules
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-undef": "off",
      "prefer-const": "error",

      // TypeScript-ESLint rules
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
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/prefer-readonly": "warn",
      "@typescript-eslint/prefer-regexp-exec": "warn",
      "@typescript-eslint/no-unnecessary-condition": "off",

      // JavaScript rules
      "array-callback-return": "error",
      eqeqeq: "error",
      "no-constant-binary-expression": "error",
      "no-constructor-return": "error",
      "no-constant-condition": ["error", { checkLoops: false }],
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",

      // Import and stylistic rules
      "object-shorthand": ["warn", "properties"],
      "sort-imports": ["warn", { ignoreDeclarationSort: true }],
      "import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],

      // Prettier integration
      "prettier/prettier": "error",
    },
  },
  prettier,
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },
];
