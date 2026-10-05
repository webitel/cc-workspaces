// Load the native electron-sip addon.
//
// node-gyp-build resolves the .node binary at runtime by checking, in order:
//   1. prebuilds/<platform>-<arch>/   (CI artifacts shipped with the package)
//   2. build/Release/                 (local source compile)
// Throws if neither is present.

const loadAddon = require('node-gyp-build');

module.exports = loadAddon(__dirname);
