module.exports = {
  expo: {
    name: 'Fruitzy',
    slug: 'fruitzy',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/Fruitzy app Icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    scheme: 'fruitzy',
    splash: {
      image: './assets/Fruitzy app Icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.fruitzy.app',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/Fruitzy app Icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.fruitzy.app',
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: ['expo-web-browser'],
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
      googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
      clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    },
  },
};
