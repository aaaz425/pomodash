// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getDefaultConfig } = require('expo/metro-config');

// expo/metro-config가 pnpm workspace 모노레포를 자동 감지해 별도 watchFolders 설정이 필요 없다
const config = getDefaultConfig(__dirname);

module.exports = config;
