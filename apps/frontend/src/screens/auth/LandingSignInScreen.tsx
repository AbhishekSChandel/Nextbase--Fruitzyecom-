import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { signInWithGoogle } from '../../services/googleAuth';
import { useToast } from '../../context/ToastContext';
import { FontAwesome } from '@expo/vector-icons';

interface LandingSignInScreenProps {
  onEmailSignIn: () => void;
  onSwitchToSignUp: () => void;
  onSkipAuth?: () => void;
}

export const LandingSignInScreen: React.FC<LandingSignInScreenProps> = ({
  onEmailSignIn,
  onSwitchToSignUp,
  onSkipAuth,
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const SocialButton = ({
    label,
    icon,
    backgroundColor,
    textColor,
    iconColor,
    onPress,
    borderColor,
    disabled,
    isLoading,
    style,
  }: {
    label: string;
    icon: string;
    backgroundColor: string;
    textColor: string;
    iconColor?: string;
    borderColor?: string;
    onPress: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    style?: ViewStyle;
  }) => (
    <TouchableOpacity
      className="w-full rounded-full mb-3 flex-row items-center justify-center"
      style={{
        backgroundColor,
        borderWidth: borderColor ? 1 : 0,
        borderColor: borderColor ?? 'transparent',
        paddingVertical: 16,
        ...(style || {}),
      }}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={{ width: 24, alignItems: 'center' }}>
        {isLoading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <FontAwesome name={icon as any} size={20} color={iconColor ?? textColor} />
        )}
      </View>
      <Text
        className="font-poppins-medium"
        style={{ color: textColor, fontSize: 16, marginLeft: 12 }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);

    if (!result.success && result.error) {
      showToast(result.error, { type: 'error' });
    } else if (result.success) {
      showToast('Signed in with Google', { type: 'success' });
    }
  };

  const handleFacebookSignIn = () => {
    showToast('Facebook login is a demo only for now', { type: 'neutral' });
  };

  const handleAppleSignIn = () => {
    showToast('Apple login is a demo only for now', { type: 'neutral' });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="px-6"
      >
        <View className="items-center py-12">
          {/* Welcome Text */}
          <Text
            className="text-3xl font-poppins-bold text-center mb-2"
            style={{ color: theme.heading }}
          >
            Welcome Back! 👋
          </Text>
          <Text
            className="text-base font-inter text-center mb-12"
            style={{ color: theme.textSecondary }}
          >
            Great to see you again, You've been missed!
          </Text>

          {/* Email Button */}
          <SocialButton
            label="Continue with Email"
            icon="envelope-o"
            backgroundColor={theme.backgroundCard}
            textColor={theme.text}
            onPress={onEmailSignIn}
          />

          <SocialButton
            label="Continue with Facebook"
            icon="facebook"
            backgroundColor="#1877F2"
            textColor="#FFFFFF"
            onPress={handleFacebookSignIn}
          />

          <SocialButton
            label="Continue with Google"
            icon="google"
            backgroundColor="#FFFFFF"
            textColor={theme.text}
            iconColor="#DB4437"
            borderColor={theme.border}
            onPress={handleGoogleSignIn}
            disabled={loading}
            isLoading={loading}
          />

          <SocialButton
            label="Continue with Apple"
            icon="apple"
            backgroundColor="#000000"
            textColor="#FFFFFF"
            onPress={handleAppleSignIn}
            style={{ marginBottom: 32 }}
          />

          {/* Continue Without Login */}
          {onSkipAuth && (
            <TouchableOpacity onPress={onSkipAuth} className="mb-4">
              <Text
                className="text-center text-base font-poppins-medium"
                style={{ color: theme.textSecondary }}
              >
                Continue without login →
              </Text>
            </TouchableOpacity>
          )}

          {/* Sign Up Link */}
          <View className="flex-row items-center justify-center">
            <Text className="text-base font-inter" style={{ color: theme.textSecondary }}>
              Don't Have an Account?{' '}
            </Text>
            <TouchableOpacity onPress={onSwitchToSignUp}>
              <Text
                className="text-base font-poppins-semibold"
                style={{ color: theme.primary }}
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
