// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getDefaultConfig } = require('expo/metro-config');

// SDK 52+의 expo/metro-config는 pnpm workspace 모노레포를 자동으로 감지해
// 루트 node_modules까지 watch/resolve하므로 별도의 watchFolders 설정이 필요 없다.
const config = getDefaultConfig(__dirname);

module.exports = config;
