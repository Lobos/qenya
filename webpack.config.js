module.exports = require("./make-webpack-config")({
  entry: {
    app: "./frontend/index.js"
  },
  separateStylesheet: true,
  externals: {"react": "React"},
  path: "./static"
})
