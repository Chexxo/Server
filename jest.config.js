module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/src/"],
  coveragePathIgnorePatterns: ["node_modules", "src/types"],
  testEnvironment: "node",
};
