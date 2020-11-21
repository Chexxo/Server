module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/src/"],
  coveragePathIgnorePatterns: ["src/types", "src/shared/types"],
  testEnvironment: "node",
};
