import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { useAuth } from '@/store/AuthProvider';
import { buildWebviewAuthBridgeSource } from '@/lib/webviewAuthBridge';

export default function WebViewAuthBridgeScreen() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const { session } = useAuth();
  const webAppUrl = process.env.EXPO_PUBLIC_WEB_APP_URL;

  if (!webAppUrl || !session) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.message, { color: theme.destructive, fontFamily: FONTS.sansRegular }]}>
          {!webAppUrl ? 'EXPO_PUBLIC_WEB_APP_URL이 설정되지 않았어요' : '로그인 세션이 없어요'}
        </Text>
      </View>
    );
  }

  return (
    <WebView
      source={buildWebviewAuthBridgeSource(webAppUrl, session)}
      style={{ backgroundColor: theme.background }}
      startInLoadingState
      renderLoading={() => (
        <View style={[styles.center, styles.loadingOverlay, { backgroundColor: theme.background }]}>
          <ActivityIndicator color={theme.primary} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
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
