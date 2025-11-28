import './global.css';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { NavigationContainer } from '@react-navigation/native';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import { tokenCache } from './src/utils/clerkTokenCache';
import Constants from 'expo-constants';
import { ThemeProvider } from './src/theme/ThemeContext';
import { ToastProvider } from './src/context/ToastContext';
import { CartProvider } from './src/context/CartContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LandingSignInScreen } from './src/screens/auth/LandingSignInScreen';
import { SignInScreen } from './src/screens/auth/SignInScreen';
import { LandingSignUpScreen } from './src/screens/auth/LandingSignUpScreen';
import { SignUpScreen } from './src/screens/auth/SignUpScreen';
import { auth } from './src/services/firebase';

type AuthView = 'landing-signin' | 'email-signin' | 'landing-signup' | 'email-signup';

const clerkPublishableKey = Constants.expoConfig?.extra?.clerkPublishableKey || '';

function AppContent() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const { isSignedIn, isLoaded: clerkLoaded, signOut: clerkSignOut } = useAuth();
  const { user: clerkUser } = useUser();
  const [authView, setAuthView] = useState<AuthView>('landing-signin');
  const [skipAuth, setSkipAuth] = useState(false);

  if (!fontsLoaded || !clerkLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  const handleSignOut = async () => {
    try {
      // Sign out from Clerk
      await clerkSignOut();
      // Sign out from Firebase
      await auth.signOut();
      // Reset local state
      setSkipAuth(false);
      setAuthView('landing-signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderAuthScreen = () => {
    switch (authView) {
      case 'landing-signin':
        return (
          <LandingSignInScreen
            onEmailSignIn={() => setAuthView('email-signin')}
            onSwitchToSignUp={() => setAuthView('landing-signup')}
            onSkipAuth={() => setSkipAuth(true)}
          />
        );
      case 'email-signin':
        return (
          <SignInScreen
            onSignInSuccess={() => {
              /* Clerk auth state will update automatically */
            }}
            onSwitchToSignUp={() => setAuthView('landing-signup')}
            onBack={() => setAuthView('landing-signin')}
          />
        );
      case 'landing-signup':
        return (
          <LandingSignUpScreen
            onEmailSignUp={() => setAuthView('email-signup')}
            onSwitchToSignIn={() => setAuthView('landing-signin')}
          />
        );
      case 'email-signup':
        return (
          <SignUpScreen
            onSignUpSuccess={() => setAuthView('email-signin')}
            onSwitchToSignIn={() => setAuthView('landing-signin')}
            onBack={() => setAuthView('landing-signup')}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          {isSignedIn || skipAuth ? (
            <NavigationContainer>
              <AppNavigator
                user={clerkUser}
                onSignOut={handleSignOut}
                isGuestMode={skipAuth && !isSignedIn}
              />
            </NavigationContainer>
          ) : (
            renderAuthScreen()
          )}
          <StatusBar style="auto" />
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <AppContent />
    </ClerkProvider>
  );
}
