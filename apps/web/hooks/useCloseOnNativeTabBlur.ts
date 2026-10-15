import { useEffect } from 'react';
import { WEBVIEW_TAB_BLUR_EVENT } from '@pomoroutine/shared';

export function useCloseOnNativeTabBlur(onClose: () => void) {
  useEffect(() => {
    window.addEventListener(WEBVIEW_TAB_BLUR_EVENT, onClose);
    return () => window.removeEventListener(WEBVIEW_TAB_BLUR_EVENT, onClose);
  }, [onClose]);
}
