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
import { useSignUp } from '@clerk/clerk-expo';
import { useClerkFirebaseSync } from '../../hooks/useClerkFirebaseSync';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onSwitchToSignIn: () => void;
  onBack: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignUpSuccess,
  onSwitchToSignIn,
  onBack,
}) => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { signUp, setActive, isLoaded } = useSignUp();
  const { syncToFirebase } = useClerkFirebaseSync();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      showToast('Please fill in all fields', { type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords don't match", { type: 'error' });
      return;
    }

    if (password.length < 8) {
      showToast('Password must be at least 8 characters', { type: 'error' });
      return;
    }

    if (!isLoaded) return;

    setLoading(true);
    try {
      await signUp.create({
        emailAddress: email.trim(),
        password,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      setPendingVerification(true);
      showToast('Verification code sent to your email', { type: 'success' });
    } catch (error: any) {
      console.error('Sign up error:', error);
      let errorMessage = 'Failed to create account';
      
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

  const handleVerifyEmail = async () => {
    if (!code) {
      showToast('Please enter the verification code', { type: 'error' });
      return;
    }

    if (!isLoaded) return;

    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        await syncToFirebase();
        showToast('Account created successfully!', { type: 'success' });
        onSignUpSuccess();
      } else {
        showToast('Verification incomplete. Please try again.', { type: 'error' });
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      let errorMessage = 'Invalid verification code';
      
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

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
          <TouchableOpacity
            className="w-10 h-10 rounded-full items-center justify-center mt-4"
            style={{ backgroundColor: theme.backgroundCard }}
            onPress={() => setPendingVerification(false)}
          >
            <Text className="text-xl" style={{ color: theme.text }}>
              ←
            </Text>
          </TouchableOpacity>

          <View className="flex-1 justify-center py-8">
            <Text
              className="text-3xl font-poppins-bold mb-2"
              style={{ color: theme.heading }}
            >
              Verify Email
            </Text>
            <Text
              className="text-base font-inter mb-8"
              style={{ color: theme.textSecondary }}
            >
              Enter the verification code sent to {email}
            </Text>

            <View className="mb-6">
              <Text
                className="text-sm font-poppins-medium mb-2"
                style={{ color: theme.text }}
              >
                Verification Code
              </Text>
              <TextInput
                className="w-full px-4 py-4 rounded-xl font-inter"
                style={{
                  backgroundColor: theme.backgroundCard,
                  color: theme.text,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
                placeholder="Enter 6-digit code"
                placeholderTextColor={theme.textSecondary}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              className="w-full py-4 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.primary }}
              onPress={handleVerifyEmail}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-base font-poppins-semibold text-white">
                  Verify Email
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
            Create Account
          </Text>
          <Text
            className="text-base font-inter mb-8"
            style={{ color: theme.textSecondary }}
          >
            Sign up to get started
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
          <View className="mb-4">
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

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text
              className="text-sm font-poppins-medium mb-2"
              style={{ color: theme.text }}
            >
              Confirm Password
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
                placeholder="Confirm your password"
                placeholderTextColor={theme.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                editable={!loading}
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={{ color: theme.textSecondary }}>
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className="w-full py-4 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: theme.primary }}
            onPress={handleEmailSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-base font-poppins-semibold text-white">
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="flex-row items-center justify-center mt-4">
            <Text className="text-base font-inter" style={{ color: theme.textSecondary }}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={onSwitchToSignIn}>
              <Text
                className="text-base font-poppins-semibold"
                style={{ color: theme.primary }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
