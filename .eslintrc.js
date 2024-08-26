module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    // Disable all lint rules
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react/jsx-uses-vars": "off",
    "no-console": "off",
    "no-debugger": "off",
    "no-unused-vars": "off",
    // Add any other rules you want to disable
    "@next/next/no-img-element": "off",
    "jsx-a11y/alt-text": "off",
    "react/display-name": "off",
    "react/jsx-max-props-per-line": [
      1,
      {
        maximum: 1,
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
