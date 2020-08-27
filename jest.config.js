module.exports = {
  verbose: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  timers: "fake",
  testPathIgnorePatterns: ["dist/tests/index.test.js"]
};
