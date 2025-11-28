import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
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
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  // Email validation helper
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Password strength validation
  const isStrongPassword = (password: string) => {
    return password.length >= 8;
  };

  const handleEmailSignUp = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      showToast('Please fill in all fields', { type: 'error' });
      return;
    }

    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address', { type: 'error' });
      return;
    }

    if (!isStrongPassword(password)) {
      showToast('Password must be at least 8 characters', { type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords don't match", { type: 'error' });
      return;
    }

    if (!isLoaded) return;

    setLoading(true);
    try {
      await signUp.create({
        emailAddress: email.trim().toLowerCase(),
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
        const errorCode = error.errors[0].code;
        const errorMsg = error.errors[0].message?.toLowerCase() || '';
        
        // Check if email already exists
        if (
          errorCode === 'form_identifier_exists' ||
          errorMsg.includes('already exists') ||
          errorMsg.includes('already registered') ||
          errorMsg.includes('email already')
        ) {
          errorMessage = 'This email is already registered. Please sign in instead.';
        } else {
          errorMessage = error.errors[0].message || errorMessage;
        }
      } else if (error.message) {
        const errorMsg = error.message.toLowerCase();
        if (
          errorMsg.includes('already exists') ||
          errorMsg.includes('already registered') ||
          errorMsg.includes('email already')
        ) {
          errorMessage = 'This email is already registered. Please sign in instead.';
        } else {
          errorMessage = error.message;
        }
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

    if (code.length !== 6) {
      showToast('Verification code must be 6 digits', { type: 'error' });
      return;
    }

    if (!isLoaded) return;

    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      backgroundColor: theme.backgroundCard,
    },
    backButtonText: {
      fontSize: 20,
      color: theme.text,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 32,
    },
    title: {
      fontSize: 30,
      fontFamily: 'Poppins_700Bold',
      marginBottom: 8,
      color: theme.heading,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      marginBottom: 32,
      color: theme.textSecondary,
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontFamily: 'Poppins_500Medium',
      marginBottom: 8,
      color: theme.text,
    },
    passwordInputContainer: {
      marginBottom: 16,
    },
    lastInputContainer: {
      marginBottom: 24,
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      fontFamily: 'Inter_400Regular',
      backgroundColor: theme.backgroundCard,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    passwordToggle: {
      position: 'absolute',
      right: 16,
      top: 16,
    },
    signUpButton: {
      width: '100%',
      paddingVertical: 16,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      backgroundColor: theme.primary,
    },
    signUpButtonText: {
      fontSize: 16,
      fontFamily: 'Poppins_600SemiBold',
      color: '#FFFFFF',
    },
    linkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    linkText: {
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      color: theme.textSecondary,
    },
    linkButtonText: {
      fontSize: 16,
      fontFamily: 'Poppins_600SemiBold',
      color: theme.primary,
    },
  });

  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setPendingVerification(false)}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.subtitle}>
              Enter the verification code sent to {email}
            </Text>

            <View style={styles.lastInputContainer}>
              <Text style={styles.inputLabel}>Verification Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit code"
                placeholderTextColor={theme.textSecondary}
                value={code}
                onChangeText={(text) => {
                  // Auto-submit when 6 digits are entered
                  const numericText = text.replace(/[^0-9]/g, '');
                  setCode(numericText);
                  if (numericText.length === 6 && !loading) {
                    handleVerifyEmail();
                  }
                }}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleVerifyEmail}
              />
            </View>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleVerifyEmail}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signUpButtonText}>Verify Email</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Welcome Text */}
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              editable={!loading}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={passwordInputRef}
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password-new"
                textContentType="newPassword"
                editable={!loading}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={{ color: theme.textSecondary }}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.lastInputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={confirmPasswordInputRef}
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={theme.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleEmailSignUp}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={{ color: theme.textSecondary }}>
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleEmailSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <TouchableOpacity onPress={onSwitchToSignIn}>
              <Text style={styles.linkButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
