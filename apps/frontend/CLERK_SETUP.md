# Clerk + Firebase Authentication Setup Guide

## ✅ What's Been Done

1. **Installed Dependencies:**
   - `@clerk/clerk-expo` - Clerk SDK for React Native
   - `expo-secure-store` - Secure token storage
   - `expo-apple-authentication` - Apple Sign-In support

2. **Created Services:**
   - `src/services/clerkFirebaseAuth.ts` - Token exchange logic
   - `src/hooks/useClerkFirebaseSync.ts` - Hook to sync Clerk → Firebase
   - `src/utils/clerkTokenCache.ts` - Secure token caching

3. **Updated Auth Screens:**
   - Landing screens now use Clerk's `useOAuth` for Google/Apple
   - Email sign-in uses Clerk's `useSignIn`
   - Email sign-up uses Clerk's `useSignUp` with email verification
   - Removed old Firebase auth code

4. **Updated App.tsx:**
   - Wrapped with `ClerkProvider`
   - Uses Clerk's `useAuth()` for auth state
   - Automatically syncs to Firebase after Clerk sign-in

## 🔧 Setup Steps (You Need to Do This)

### Step 1: Create Clerk Account
1. Go to https://clerk.com
2. Sign up for a free account
3. Create a new application (name it "Fruitzy")

### Step 2: Get Firebase Service Account Key
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Click Settings (⚙️) → Project Settings
4. Go to **Service Accounts** tab
5. Click **Generate new private key**
6. Download the JSON file (keep it secure!)

### Step 3: Configure Clerk Dashboard

#### A. Create Custom JWT Template (Alternative to Firebase Integration)
Since Firebase integration might not be available, we'll create a custom JWT template:

1. In Clerk Dashboard, go to **JWT Templates** (under Developers section)
2. Click **New template**
3. **Name:** `firebase` (NOT `integration_firebase` - that prefix is reserved)
4. **Token lifetime:** 3600 seconds
5. **Template:** Blank
6. **Claims:** Only add these (Clerk handles `iss`, `aud`, `sub` automatically):
   ```json
   {
     "user_id": "{{user.id}}",
     "email": "{{user.primary_email_address}}",
     "email_verified": true
   }
   ```
7. Save the template

**Note:** Don't add `iss`, `aud`, or `sub` claims - these are reserved and Clerk adds them automatically. The minimal claims above are sufficient for Firebase authentication.

#### B. Enable Auth Providers
1. Go to **User & Authentication** → **Email, Phone, Username**
2. Enable **Email address** and **Password**
3. Go to **User & Authentication** → **Social Connections**
4. Enable **Google** (configure OAuth client)
5. Enable **Apple** (optional, iOS only)

#### C. Get Publishable Key
1. Go to **API Keys**
2. Copy the **Publishable key** (starts with `pk_test_` or `pk_live_`)

### Step 4: Update Environment Variables
1. Open `apps/frontend/.env`
2. Add your Clerk key:
   ```
   CLERK_PUBLISHABLE_KEY=pk_test_your-key-here
   ```
3. Keep your existing Firebase config

### Step 5: Test the App
1. Restart Expo: `npm start --clear`
2. Test each auth method:
   - ✅ Email/Password sign-up (with verification)
   - ✅ Email/Password sign-in
   - ✅ Google Sign-In
   - ✅ Apple Sign-In (iOS only)
3. Verify Firebase session is created (check Firestore access)

## 📱 How It Works

1. **User signs in via Clerk** (Google, Apple, or Email)
2. **Clerk creates a session** and returns a session ID
3. **App calls `syncToFirebase()`** automatically
4. **Clerk generates a Firebase custom token** via the integration
5. **Firebase signs in the user** with the custom token
6. **User can now access Firestore** with Firebase security rules

## 🎯 Benefits

- ✅ **No more OAuth redirect issues** - Clerk handles all OAuth flows
- ✅ **Email verification built-in** - Clerk manages verification codes
- ✅ **Works in Expo Go** - No custom builds needed
- ✅ **Firebase security rules work** - Users have valid Firebase sessions
- ✅ **Production-ready** - Clerk is enterprise-grade auth

## 🐛 Troubleshooting

**"Clerk Publishable Key is missing"**
- Add `CLERK_PUBLISHABLE_KEY` to your `.env` file
- Restart Expo server

**"Failed to get Firebase token from Clerk"**
- Check that you created the `firebase` JWT template in Clerk Dashboard
- Verify the template name is exactly `firebase` (lowercase)
- Check that the `iss` claim matches your Firebase Service Account email
- Verify the Firebase project ID is correct

**"Google Sign-In not working"**
- Enable Google provider in Clerk Dashboard
- Configure OAuth client in Clerk (not Google Cloud Console!)

**"Firebase permission denied"**
- The Firebase session wasn't created
- Check console logs for token exchange errors
- Verify `syncToFirebase()` is being called after sign-in

