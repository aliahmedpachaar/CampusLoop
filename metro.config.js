const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for Node.js v24 compatibility with Metro bundler
config.resolver = {
    ...config.resolver,
    unstable_enablePackageExports: false,
};

module.exports = config;
