/* eslint-disable */
module.exports = {
  root: true,
  extends: '@react-native-community',
  "rules": {
    "prettier/prettier": [
      "error", {"semi": false, "singleQuote": true, "printWidth": 120}
    ],
    "semi": [1, "never"],
    "no-console": [2, {"allow": ["warn", "error", "info"]}],
    "camelcase": 0,
    "react/destructuring-assignment": 0,
    "import/no-extraneous-dependencies": 0,
    "react/prop-types": [2, {"skipUndeclared": true}],
    // "jsx-a11y/click-events-have-key-events": 1,
    // "jsx-a11y/no-static-element-interactions": 1,
    "import/no-unresolved": "off",
    "no-use-before-define": ["error", {"variables": false}],
    "react/jsx-props-no-spreading": 0
  }
};
