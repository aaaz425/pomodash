import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export function useKeyboardTop(): number | null {
  const [top, setTop] = useState<number | null>(null);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (e) => setTop(e.endCoordinates.screenY));
    const hideSub = Keyboard.addListener(hideEvent, () => setTop(null));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return top;
}
