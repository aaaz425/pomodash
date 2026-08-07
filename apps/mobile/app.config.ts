import type { ExpoConfig } from 'expo/config';

// 로컬 iOS 실기기 테스트용 — Apple 계정에 com.pomodash.app이 이미 다른 팀에 등록되어 있어
// 서명이 안 되는 문제를 피하려고 개발 빌드만 별도 bundle identifier를 쓴다.
// 카카오 개발자 콘솔에도 iOS 플랫폼으로 com.pomodash.app.dev를 추가 등록해야 한다.
const IS_DEV = process.env.APP_VARIANT === 'development';

const config: ExpoConfig = {
  name: 'Pomodash',
  slug: 'pomodash',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'pomodash',
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: IS_DEV ? 'com.pomodash.app.dev' : 'com.pomodash.app',
    icon: './assets/expo.icon',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.pomodash.app',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    permissions: [
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_MEDIA_VIDEO',
      'android.permission.READ_MEDIA_AUDIO',
    ],
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
      },
    ],
    'expo-notifications',
    'expo-sharing',
    'expo-secure-store',
    [
      'expo-media-library',
      {
        photosPermission: '집중 기록 공유 카드를 사진 앱에 저장하기 위해 접근 권한이 필요해요.',
        savePhotosPermission: '집중 기록 공유 카드를 사진 앱에 저장하기 위해 접근 권한이 필요해요.',
      },
    ],
    [
      '@react-native-seoul/kakao-login',
      {
        kakaoAppKey: '3cb071760cf3e4e10c48829511386b52',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: '5c82eb46-5c27-4fe3-a521-208277fb141c',
    },
  },
  owner: 'ytoko',
};

export default config;
