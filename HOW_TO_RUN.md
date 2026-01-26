# How to Run CampusLoop

## ✅ Quick Start (Easiest Method - Expo)

The project has been converted to use Expo for the easiest setup and running experience.

### 1. Start the Development Server

```bash
cd /Users/aliahmed/CampusLoop
npx expo start
```

### 2. Choose How to Run

Once the server starts, you'll see a QR code and menu options:

**Option A: Run on Physical Device (Recommended)**
- Install "Expo Go" app from App Store (iOS) or Play Store (Android)
- Scan the QR code with your camera (iOS) or Expo Go app (Android)
- App will load on your device

**Option B: Run on iOS Simulator**
- Press `i` in the terminal
- Requires Xcode installed

**Option C: Run on Android Emulator**
- Press `a` in the terminal
- Requires Android Studio and emulator running

**Option D: Run in Web Browser**
- Press `w` in the terminal
- Opens in your default browser

## Demo Account

- **Email:** `demo@university.edu`
- **Password:** `password123`

## Troubleshooting

**If you get "command not found: expo":**
```bash
npm install -g expo-cli
```

**If Metro bundler has issues:**
```bash
npx expo start --clear
```

**If you see dependency warnings:**
These are normal and won't affect the app running.

## What Changed

The project was converted from React Native CLI to Expo because:
- ❌ React Native CLI requires complex native iOS/Android project setup
- ✅ Expo handles all native configuration automatically
- ✅ Much easier to run and test
- ✅ Works on physical devices without cables
- ✅ Same React Native code, just easier tooling

All your code remains the same - just the build tooling changed!

## Next Steps

1. Run `npx expo start`
2. Scan QR code with Expo Go app
3. Test the app features
4. When ready for production, run `expo build` to create native apps
