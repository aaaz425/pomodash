import type { ExpoConfig } from 'expo/config';
import { withEntitlementsPlist, type ConfigPlugin } from 'expo/config-plugins';

// com.pomodash.app이 다른 팀에 이미 등록돼 서명이 안 되므로 개발 빌드만 별도 bundle identifier 사용
// (카카오 개발자 콘솔에도 com.pomodash.app.dev를 iOS 플랫폼으로 추가 등록해야 함)
const IS_DEV = process.env.APP_VARIANT === 'development';

// expo-notifications가 무조건 aps-environment 엔타이틀먼트를 추가하는데, 무료 개인 Apple 팀은
// Push Notifications capability를 지원 안 해 이게 있으면 로컬 서명이 막힘 — 로컬 알림만 쓰므로 제거
const withoutPushEntitlement: ConfigPlugin = (config) =>
  withEntitlementsPlist(config, (config) => {
    delete config.modResults['aps-environment'];
    return config;
  });

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
    withoutPushEntitlement,
    'expo-notifications',
    'expo-sharing',
    'expo-secure-store',
    'expo-audio',
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
    // ExpoConfig 타입이 아직 함수형 config plugin을 반영 안 해 캐스팅 필요 — 런타임은 정식 지원함
  ] as ExpoConfig['plugins'],
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
