module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/src/"],
  coveragePathIgnorePatterns: ["src/types"],
  testEnvironment: "node",
};
