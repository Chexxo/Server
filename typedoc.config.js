module.exports = {
  inputFiles: ["./src/"],
  exclude: [
    "./src/**/__tests__",
    "./src/**/__mocks__",
    "**/*.test.ts",
    "./src/index.ts",
    "./src/index_aws.ts"
  ],
  readme: "./README.md",
  mode: "modules",
  out: "./docs/",
  plugin: ["typedoc-plugin-no-inherit", "typedoc-plugin-external-module-name"],
  tsconfig: "./tsconfig.json",
};
