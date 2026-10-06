import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export default function WebViewSmokeScreen() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const webAppUrl = process.env.EXPO_PUBLIC_WEB_APP_URL;

  if (!webAppUrl) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.message, { color: theme.destructive, fontFamily: FONTS.sansRegular }]}>
          EXPO_PUBLIC_WEB_APP_URL이 설정되지 않았어요
        </Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: `${webAppUrl}/landing` }}
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
