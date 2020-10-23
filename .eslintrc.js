module.exports = {
    extends: [
      "plugin:@typescript-eslint/recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:jest/recommended",
      "plugin:prettier/recommended",
      "prettier",
      "prettier/@typescript-eslint",
    ],
    plugins: [
      "@typescript-eslint", 
      "eslint-plugin-tsdoc",
      "import",
      "jest",
    ],
    env: {
      es6: true,
      jest: true,
    },
    globals: {
      Atomics: "readonly",
      SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      sourceType: "module",
      project: "./tsconfig.json",
    },
    settings: {
      "import/resolver": {
        node: {
          paths: ["src"],
          extensions: [".js", ".ts"],
        }
      },
    },
  };
