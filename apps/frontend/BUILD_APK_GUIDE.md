# 📱 Building and Sharing APK for Review

This guide will help you build a production-ready APK and share it professionally with your manager.

## Prerequisites

✅ EAS CLI is already installed (v16.9.0)

## Step 1: Login to Expo Account

```bash
cd apps/frontend
eas login
```

If you don't have an Expo account, create one at [expo.dev](https://expo.dev)

## Step 2: Configure Your Project

The `eas.json` file is already created with the correct configuration for building APKs.

## Step 3: Build the APK

### Option A: Build Locally (Faster, but requires Android SDK)
```bash
eas build --platform android --profile preview --local
```

### Option B: Build on Expo Servers (Recommended - No setup needed)
```bash
eas build --platform android --profile preview
```

**What happens:**
- Expo will build your APK in the cloud
- You'll get a download link when it's ready (usually 10-20 minutes)
- The APK will be optimized and ready for distribution

## Step 4: Download the APK

Once the build completes:
1. You'll receive a link in the terminal or email
2. Download the APK file (usually named like `app-*.apk`)
3. The file will be ~20-50MB depending on assets

## Step 5: Share with Your Manager

### Professional Sharing Options:

#### Option 1: Google Drive (Recommended)
1. Upload APK to Google Drive
2. Right-click → Share → Get link
3. Set permission to "Anyone with the link"
4. Send the link via email

#### Option 2: WeTransfer / Send Anywhere
1. Upload APK to [WeTransfer.com](https://wetransfer.com) or [SendAnywhere.com](https://sendanywhere.com)
2. Get a download link (valid for 7 days)
3. Send link via email

#### Option 3: GitHub Release (Best for Tech Managers)
1. Go to your GitHub repository
2. Create a new Release (Releases → Draft a new release)
3. Upload the APK as an asset
4. Tag it as `v1.0.0` or similar
5. Share the release link

## Step 6: Include Installation Instructions

Create a professional email with:

**Subject:** Fruitzy App - APK for Review

**Body:**
```
Hi [Manager Name],

I've completed the Fruitzy e-commerce app development and would like to share it for your review.

📱 APK Download: [Your Link Here]

📋 Installation Instructions:
1. Download the APK file to your Android device
2. Enable "Install from Unknown Sources" in Settings → Security
3. Open the downloaded APK file
4. Tap "Install"
5. Open the app and explore!

🔑 Test Credentials:
- Email: test@example.com
- Password: test123456

✨ Key Features to Review:
- Home screen with product carousel
- Search functionality
- Shopping cart and checkout
- Dark/Light mode toggle
- User authentication (Email, Google)

Please let me know if you have any questions or feedback.

Best regards,
[Your Name]
```

## Troubleshooting

### Build Fails?
- Check that all environment variables are set in `.env`
- Ensure `app.config.js` is properly configured
- Review the build logs in the Expo dashboard

### APK Won't Install?
- Make sure "Install from Unknown Sources" is enabled
- Check Android version compatibility (minimum Android 6.0)
- Try downloading on a different device

### Need to Update?
- Make changes to your code
- Run `eas build --platform android --profile preview` again
- Share the new APK link

## Additional Tips

1. **Version Numbering**: Update `version` in `app.config.js` before each build
2. **Build Notes**: Add notes about what changed in this version
3. **Testing**: Test the APK on your own device first before sharing
4. **File Size**: If APK is too large, consider using `expo-optimize` or reducing assets

## Quick Reference Commands

```bash
# Build APK (cloud)
eas build --platform android --profile preview

# Build APK (local - requires Android SDK)
eas build --platform android --profile preview --local

# Check build status
eas build:list

# View build logs
eas build:view [build-id]
```

---

**Need Help?** Check [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)

