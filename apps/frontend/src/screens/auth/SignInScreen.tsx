import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useSignIn } from '@clerk/clerk-expo';
import { useClerkFirebaseSync } from '../../hooks/useClerkFirebaseSync';

interface SignInScreenProps {
  onSignInSuccess: () => void;
  onSwitchToSignUp: () => void;
  onBack: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onSignInSuccess,
  onSwitchToSignUp,
  onBack,
}) => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { syncToFirebase } = useClerkFirebaseSync();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      showToast('Please enter email and password', { type: 'error' });
      return;
    }

    if (!isLoaded) return;

    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        await syncToFirebase();
        showToast('Signed in successfully', { type: 'success' });
        onSignInSuccess();
      } else {
        showToast('Sign-in incomplete. Please try again.', { type: 'error' });
      }
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      
      let errorMessage = 'Invalid email or password';

      if (error.errors && error.errors[0]) {
        errorMessage = error.errors[0].message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
        {/* Back Button */}
        <TouchableOpacity
          className="w-10 h-10 rounded-full items-center justify-center mt-4"
          style={{ backgroundColor: theme.backgroundCard }}
          onPress={onBack}
        >
          <Text className="text-xl" style={{ color: theme.text }}>
            ←
          </Text>
        </TouchableOpacity>

        <View className="flex-1 justify-center py-8">
          {/* Welcome Text */}
          <Text
            className="text-3xl font-poppins-bold mb-2"
            style={{ color: theme.heading }}
          >
            Welcome Back!
          </Text>
          <Text
            className="text-base font-inter mb-8"
            style={{ color: theme.textSecondary }}
          >
            Sign in to continue
          </Text>

          {/* Email Input */}
          <View className="mb-4">
            <Text
              className="text-sm font-poppins-medium mb-2"
              style={{ color: theme.text }}
            >
              Email
            </Text>
            <TextInput
              className="w-full px-4 py-4 rounded-xl font-inter"
              style={{
                backgroundColor: theme.backgroundCard,
                color: theme.text,
                borderWidth: 1,
                borderColor: theme.border,
              }}
              placeholder="Enter your email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text
              className="text-sm font-poppins-medium mb-2"
              style={{ color: theme.text }}
            >
              Password
            </Text>
            <View className="relative">
              <TextInput
                className="w-full px-4 py-4 rounded-xl font-inter"
                style={{
                  backgroundColor: theme.backgroundCard,
                  color: theme.text,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
                placeholder="Enter your password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={{ color: theme.textSecondary }}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            className="w-full py-4 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: theme.primary }}
            onPress={handleEmailSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-base font-poppins-semibold text-white">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row items-center justify-center mt-4">
            <Text className="text-base font-inter" style={{ color: theme.textSecondary }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={onSwitchToSignUp}>
              <Text
                className="text-base font-poppins-semibold"
                style={{ color: theme.primary }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
