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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
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

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', { type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } =
        await import('firebase/auth');
      const { auth } = await import('../../services/firebase');

      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with display name (using email as name for now)
      await updateProfile(userCredential.user, {
        displayName: email.split('@')[0],
      });

      // Send verification email
      try {
        await sendEmailVerification(userCredential.user);
      } catch (emailError: any) {
        console.error('⚠️ Failed to send verification email:', emailError);
        // Continue anyway - user can request it later
      }

      // Sign out the user so they must verify before accessing the app
      await auth.signOut();

      showToast(
        `Account created for ${email}. Check your email to verify before signing in.`,
        { type: 'success', duration: 3500 }
      );
      onSignUpSuccess();
    } catch (error: any) {
      console.error('Sign up error:', error);
      let errorMessage = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
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
            className="text-3xl font-poppins-bold mb-8"
            style={{ color: theme.heading }}
          >
            Create Your Account ✨
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
            className="w-full mb-4 flex-row items-center px-4 py-4 rounded-2xl"
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

          {/* Confirm Password Input */}
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
              placeholder="Confirm Password"
              placeholderTextColor={theme.textLight}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="ml-2"
            >
              <Text className="text-lg">{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className="w-full py-4 rounded-full mb-6"
            style={{
              backgroundColor:
                email && password && confirmPassword
                  ? theme.primary
                  : theme.backgroundCard,
            }}
            onPress={handleEmailSignUp}
            disabled={loading || !email || !password || !confirmPassword}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center text-base font-poppins-semibold">
                Sign up
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="flex-row items-center justify-center">
            <Text className="text-base font-inter" style={{ color: theme.textSecondary }}>
              Already Have an Account?{' '}
            </Text>
            <TouchableOpacity onPress={onSwitchToSignIn} disabled={loading}>
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
