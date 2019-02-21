const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/js/app.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "../dist")
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/index.html", to: "index.html" },
            { from: "src/assets", to: "assets" }
        ])
    ]
};
