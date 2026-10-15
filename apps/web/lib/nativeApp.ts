import type { WebviewBridgeMessage } from '@pomoroutine/shared';

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage: (message: string) => void };
  }
}

export function isInNativeApp(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.ReactNativeWebView?.postMessage === 'function'
  );
}

export function postToNativeApp(message: WebviewBridgeMessage): void {
  window.ReactNativeWebView?.postMessage(JSON.stringify(message));
}
