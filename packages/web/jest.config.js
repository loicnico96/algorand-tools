module.exports = {
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
  ],
  coverageReporters: [
    "html",
    "text-summary",
  ],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      {
        presets: [
          "next/babel"
        ]
      }
    ]
  }
}
