module.exports = {
  "**/*.{ts,tsx}": filenames => [
    `yarn format ${filenames.join(" ")}`,
    // TODO: Configure eslints
    // `yarn lint:fix ${filenames.join(" ")}`,
    "yarn typecheck",
  ],
}
