import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type ToastType = 'neutral' | 'success' | 'error';

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATION = 2500;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('neutral');
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setMessage('');
    });
  }, [opacity]);

  const showToast = useCallback(
    (msg: string, options?: ToastOptions) => {
      if (!msg) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setMessage(msg);
      setType(options?.type ?? 'neutral');

      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      timeoutRef.current = setTimeout(hideToast, options?.duration ?? DEFAULT_DURATION);
    },
    [hideToast, opacity]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const backgroundColor =
    type === 'success'
      ? theme.primary
      : type === 'error'
        ? theme.accentRed
        : 'rgba(0, 0, 0, 0.85)';

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[styles.toastContainer, { opacity, backgroundColor }]}
      >
        <Text style={styles.toastText}>{message}</Text>
      </Animated.View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  toastText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    textAlign: 'center',
  },
});

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
