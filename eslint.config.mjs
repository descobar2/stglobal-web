export default [{
  files: ["backend/**/*.js"],
  ignores: ["**/node_modules/**", "**/coverage/**"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: { process: "readonly", console: "readonly", fetch: "readonly" },
  },
  rules: {
    "no-undef": "error",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "no-constant-condition": "error",
  },
}];
