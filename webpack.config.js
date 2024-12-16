const MODE = process.env.NODE_ENV || "development";
const path = require('path');

const moduleConfig = {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: [
                        ["@babel/preset-env", {
                            targets: {
                                chrome: "92"  // Updated for better ES module support
                            }
                        }]
                    ],
                    plugins: [
                        "@babel/plugin-transform-template-literals",
                        "@babel/plugin-syntax-top-level-await",
                        "@babel/plugin-transform-optional-chaining"
                    ]
                }
            }
        }
    ]
};

module.exports = {
    module: moduleConfig, // Always use module config for proper ES module handling
    mode: 'production',
    entry: {
        background: "./js/background.js",
        detector: "./js/detector.js",
        options: "./js/options.js",
        "page-flags": "./js/page-flags.js",
        placeholderUtils: "./js/placeholder-utils.js",
        "service-worker": "./js/service-worker.js",
        "service-worker-serialization": "./js/service-worker-serialization.js"
    },
    output: {
        filename: "[name].js",
        path: `${__dirname}/dist/js`,
    },
    externals: {
        'quill': 'Quill',
        'quill-table-better': 'QuillTableBetter'
    },
    resolve: {
        extensions: ['.js']
    }
};
