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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      showToast('Please enter email and password', { type: 'error' });
      return;
    }

    setLoading(true);

    try {
      // Import auth functions dynamically
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../../services/firebase');

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // TODO: Re-enable email verification once emails are working
      // For now, allow sign in without verification for testing
      onSignInSuccess();
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      let errorMessage = 'Invalid email or password';

      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }

      showToast(errorMessage, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    showToast('Google Sign-In will be available soon', { type: 'neutral' });
  };

  const handleAppleSignIn = async () => {
    showToast('Apple Sign-In will be available soon', { type: 'neutral' });
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
            Welcome Back! 👋
          </Text>
          <Text
            className="text-base font-inter mb-8"
            style={{ color: theme.textSecondary }}
          >
            Great to see you again, You've been missed!
          </Text>

          {/* Email Input */}
          <View
            className="w-full mb-4 flex-row items-center px-4 py-4 rounded-2xl"
            style={{
              backgroundColor: theme.backgroundCard,
            }}
          >
            <Text className="text-xl mr-3">✉️</Text>
            <TextInput
              className="flex-1 font-inter text-base"
              style={{ color: theme.text }}
              placeholder="Email"
              placeholderTextColor={theme.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View
            className="w-full mb-6 flex-row items-center px-4 py-4 rounded-2xl"
            style={{
              backgroundColor: theme.backgroundCard,
            }}
          >
            <Text className="text-xl mr-3">🔒</Text>
            <TextInput
              className="flex-1 font-inter text-base"
              style={{ color: theme.text }}
              placeholder="Password"
              placeholderTextColor={theme.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="ml-2"
            >
              <Text className="text-lg">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            className="w-full py-4 rounded-full mb-6"
            style={{
              backgroundColor: email && password ? theme.primary : theme.backgroundCard,
            }}
            onPress={handleEmailSignIn}
            disabled={loading || !email || !password}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center text-base font-poppins-semibold">
                Sign in
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row items-center justify-center">
            <Text className="text-base font-inter" style={{ color: theme.textSecondary }}>
              Don't Have an Account?{' '}
            </Text>
            <TouchableOpacity onPress={onSwitchToSignUp} disabled={loading}>
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
