module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
    "prettier",
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
  rules: {
    "max-lines": ["error", {
      "max": 300
    }],
    "complexity": ["error", {
      "max": 10
    }],
    "max-lines-per-function": ["error", {
      "max": 30,
      "skipBlankLines": true
    }],
    "max-params": ["error",
      5
    ]
  }
};
