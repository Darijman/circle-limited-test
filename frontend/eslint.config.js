import js from "@eslint/js";
import parserTs from "@typescript-eslint/parser";
import pluginTs from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginPrettier from "eslint-plugin-prettier";
import pluginPrettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: "./tsconfig.app.json",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
      },
    },

    plugins: {
      "@typescript-eslint": pluginTs,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      prettier: pluginPrettier,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      // базовые
      "no-var": "error",
      "prefer-const": "warn",
      "no-console": "warn",
      "no-debugger": "error",

      // TypeScript
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Prettier
      "prettier/prettier": [
        "warn",
        {
          singleQuote: false,
          jsxSingleQuote: false,
          endOfLine: "lf",
          semi: true,
          printWidth: 142,
          proseWrap: "never",
        },
      ],
    },
  },

  pluginPrettierConfig,
];
