/** @type {import('jest').Config} */
module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFiles: ["reflect-metadata", "<rootDir>/tests/setup/jsdom-polyfill.ts"],
  testPathIgnorePatterns: ["/node_modules/", "plugin-init.integration"],
  passWithNoTests: true,
};
