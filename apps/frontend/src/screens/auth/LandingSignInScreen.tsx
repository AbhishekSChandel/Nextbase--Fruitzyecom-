import React from 'react';
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
import { useToast } from '../../context/ToastContext';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useOAuth } from '@clerk/clerk-expo';
import { useClerkFirebaseSync } from '../../hooks/useClerkFirebaseSync';
import { Platform } from 'react-native';

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
  const { showToast } = useToast();
  const { syncToFirebase } = useClerkFirebaseSync();
  
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: 'oauth_apple' });

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
    icon: any;
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
      <View style={{ width: 24, alignItems: 'center', marginRight: 12 }}>
        {isLoading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          icon
        )}
      </View>
      <Text
        className="font-poppins-medium"
        style={{ color: textColor, fontSize: 16 }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleOAuth();
      
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        await syncToFirebase();
        showToast('Signed in with Google', { type: 'success' });
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      showToast(error.message || 'Failed to sign in with Google', { type: 'error' });
    }
  };

  const handleAppleSignIn = async () => {
    if (Platform.OS === 'ios') {
      try {
        const { createdSessionId, setActive } = await startAppleOAuth();
        
        if (createdSessionId) {
          await setActive!({ session: createdSessionId });
          await syncToFirebase();
          showToast('Signed in with Apple', { type: 'success' });
        }
      } catch (error: any) {
        console.error('Apple sign-in error:', error);
        showToast(error.message || 'Failed to sign in with Apple', { type: 'error' });
      }
    } else {
      showToast('Apple login is only available on iOS', { type: 'neutral' });
    }
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
            icon={<MaterialCommunityIcons name="email-outline" size={20} color="#666" />}
            backgroundColor="#F3F4F6"
            textColor="#1F2937"
            onPress={onEmailSignIn}
          />

          {/* Google Button */}
          <SocialButton
            label="Continue with Google"
            icon={<FontAwesome name="google" size={20} color="#DB4437" />}
            backgroundColor="#F3F4F6"
            textColor="#1F2937"
            onPress={handleGoogleSignIn}
          />

          {/* Or Separator */}
          <Text
            className="text-center font-inter my-2"
            style={{ color: theme.textSecondary, fontSize: 14 }}
          >
            or
          </Text>

          {/* Apple Button */}
          <SocialButton
            label="Continue with Apple"
            icon={<MaterialCommunityIcons name="apple" size={20} color="#FFFFFF" />}
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
                style={{ color: '#2ECC71' }}
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
