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

interface LandingSignUpScreenProps {
  onEmailSignUp: () => void;
  onSwitchToSignIn: () => void;
}

export const LandingSignUpScreen: React.FC<LandingSignUpScreenProps> = ({
  onEmailSignUp,
  onSwitchToSignIn,
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

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);

    if (!result.success && result.error) {
      showToast(result.error, { type: 'error' });
    } else if (result.success) {
      showToast('Signed up with Google', { type: 'success' });
    }
  };

  const handleFacebookSignUp = () => {
    showToast('Facebook signup is a demo only for now', { type: 'neutral' });
  };

  const handleAppleSignUp = () => {
    showToast('Apple signup is a demo only for now', { type: 'neutral' });
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
            className="text-3xl font-poppins-bold text-center mb-12"
            style={{ color: theme.heading }}
          >
            Let's Get Started!
          </Text>

          {/* Email Button */}
          <SocialButton
            label="Continue with Email"
            icon="envelope-o"
            backgroundColor={theme.backgroundCard}
            textColor={theme.text}
            onPress={onEmailSignUp}
          />

          <SocialButton
            label="Continue with Facebook"
            icon="facebook"
            backgroundColor="#1877F2"
            textColor="#FFFFFF"
            onPress={handleFacebookSignUp}
          />

          <SocialButton
            label="Continue with Google"
            icon="google"
            backgroundColor="#FFFFFF"
            textColor={theme.text}
            iconColor="#DB4437"
            borderColor={theme.border}
            onPress={handleGoogleSignUp}
            disabled={loading}
            isLoading={loading}
          />

          <SocialButton
            label="Continue with Apple"
            icon="apple"
            backgroundColor="#000000"
            textColor="#FFFFFF"
            onPress={handleAppleSignUp}
            style={{ marginBottom: 32 }}
          />

          {/* Sign In Link */}
          <View className="flex-row items-center justify-center">
            <Text className="text-base font-inter" style={{ color: theme.textSecondary }}>
              Already Have an Account?{' '}
            </Text>
            <TouchableOpacity onPress={onSwitchToSignIn}>
              <Text
                className="text-base font-poppins-semibold"
                style={{ color: theme.primary }}
              >
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
