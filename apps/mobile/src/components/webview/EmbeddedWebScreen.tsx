import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { type WebViewNavigation } from 'react-native-webview';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { useAuth } from '@/store/AuthProvider';
import { buildWebviewAuthBridgeSource } from '@/lib/webviewAuthBridge';

interface Props {
  path: string;
}

export function EmbeddedWebScreen({ path }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const { session } = useAuth();
  const webAppUrl = process.env.EXPO_PUBLIC_WEB_APP_URL;
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack) return false;
      webViewRef.current?.goBack();
      return true;
    });
    return () => sub.remove();
  }, [canGoBack]);

  const source =
    webAppUrl && session
      ? buildWebviewAuthBridgeSource(webAppUrl, session, `${path}?embed=1`)
      : null;

  if (!source) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.center, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.message, { color: theme.destructive, fontFamily: FONTS.sansRegular }]}>
          {!webAppUrl ? 'EXPO_PUBLIC_WEB_APP_URL이 설정되지 않았어요' : '로그인 세션이 없어요'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.flex, { backgroundColor: theme.background }]}
    >
      <WebView
        ref={webViewRef}
        source={source}
        style={{ backgroundColor: theme.background }}
        injectedJavaScriptBeforeContentLoaded={`
          localStorage.setItem('theme', '${scheme}');
          if (window.navigator && window.navigator.serviceWorker) {
            window.navigator.serviceWorker.register = function () { return Promise.resolve(); };
          }
          true;
        `}
        onNavigationStateChange={(event: WebViewNavigation) => setCanGoBack(event.canGoBack)}
        startInLoadingState
        renderLoading={() => (
          <View
            style={[styles.center, styles.loadingOverlay, { backgroundColor: theme.background }]}
          >
            <ActivityIndicator color={theme.primary} />
          </View>
        )}
        renderError={() => (
          <View style={[styles.center, { backgroundColor: theme.background }]}>
            <Text
              style={[styles.message, { color: theme.destructive, fontFamily: FONTS.sansRegular }]}
            >
              페이지를 불러오지 못했어요
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
  },
});
