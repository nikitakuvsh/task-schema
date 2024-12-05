const path = require("path");

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                ...webpackConfig.resolve.fallback,
                url: require.resolve("url/"),
                path: require.resolve("path-browserify"),
                os: require.resolve("os-browserify/browser"),
                buffer: require.resolve("buffer/"),
                fs: false, // Полностью отключаем `fs`, так как он серверный
                stream: require.resolve("stream-browserify"),
                crypto: require.resolve("crypto-browserify"),
                http: require.resolve("stream-http"),
                https: require.resolve("https-browserify"),
            };
            return webpackConfig;
        },
    },
};
