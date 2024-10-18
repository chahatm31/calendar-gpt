module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest", // Transform JS files using babel-jest
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-dnd|react-dnd-html5-backend)/)", // Ignore node_modules except for react-dnd and its dependencies
  ],
  testEnvironment: "jsdom", // Required for React components
};
