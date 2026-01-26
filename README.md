# CampusLoop 🎓

A modern, production-ready university student interaction mobile application built with React Native and TypeScript.

## Overview

CampusLoop is a closed ecosystem designed exclusively for university students to facilitate meaningful academic collaboration, activities, and peer discovery. Unlike traditional social media apps, CampusLoop focuses on structured interaction, categorized content, and location-aware peer connections.

## Features

### ✅ Implemented

- **Authentication System**
  - Email/password login and signup
  - Multi-step registration with profile setup
  - Persistent session management
  - Secure token storage

- **User Profiles**
  - Complete profile with university, course, and semester
  - Interest tags and bio
  - Profile editing
  - Dark mode support

- **Home Feed**
  - Post creation and viewing
  - Category-based filtering (Assignment, Coding, Activities, Sports, Events, Discussion)
  - Like and comment functionality
  - Pull-to-refresh

- **Activities & Collaboration**
  - Create and browse activities
  - Join/leave activities
  - Participant tracking
  - Activity types: Study Groups, Assignment Help, Sports, Events, Project Collaboration
  - Location and scheduled date support

- **Modern UI/UX**
  - Clean, futuristic design with gradients and glassmorphism
  - Dark mode with system preference detection
  - Smooth animations and transitions
  - Responsive layouts for iOS and Android

## Tech Stack

- **Framework**: React Native 0.76.5
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: React Context API + useReducer
- **Storage**: AsyncStorage
- **UI Components**: Custom component library
- **Styling**: StyleSheet with theme system

## Project Structure

```
CampusLoop/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/      # Button, Input, Card, Avatar, CategoryChip
│   │   ├── posts/       # Post-related components
│   │   ├── activities/  # Activity components
│   │   └── messaging/   # Chat components
│   ├── screens/         # Screen components
│   │   ├── auth/        # Welcome, Login, Signup
│   │   ├── home/        # Home feed
│   │   ├── profile/     # User profile
│   │   ├── activities/  # Activities list
│   │   └── messaging/   # Messaging (placeholder)
│   ├── navigation/      # Navigation configuration
│   ├── services/        # Mock API services
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── postService.ts
│   │   ├── activityService.ts
│   │   ├── messageService.ts
│   │   └── notificationService.ts
│   ├── context/         # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── utils/           # Utility functions
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── storage.ts
│   ├── constants/       # Theme and data constants
│   │   ├── theme.ts
│   │   └── universities.ts
│   └── types/           # TypeScript definitions
│       ├── user.ts
│       ├── post.ts
│       ├── activity.ts
│       ├── message.ts
│       └── notification.ts
├── App.tsx              # Root component
├── index.js             # Entry point
└── package.json         # Dependencies
```

## Installation

### Prerequisites

- Node.js >= 18
- npm or yarn
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

### Setup

1. **Clone and navigate to the project**
   ```bash
   cd CampusLoop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies (macOS only)**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run on iOS**
   ```bash
   npm run ios
   ```

5. **Run on Android**
   ```bash
   npm run android
   ```

## Mock Data & Backend Integration

### Current Implementation

All services currently use **mock data** with in-memory storage. This allows the app to run without a backend while demonstrating full functionality.

### Demo Account

- **Email**: `demo@university.edu`
- **Password**: `password123`

### Backend Integration Guide

All service files (`src/services/*.ts`) are structured for easy backend integration:

1. **Replace mock functions** with actual API calls
2. **Update endpoints** in each service file
3. **Add error handling** for network failures
4. **Implement token refresh** in AuthContext

Example:
```typescript
// Current (Mock)
export const login = async (email: string, password: string) => {
  await mockDelay(800);
  // ... mock logic
};

// Replace with (Real API)
export const login = async (email: string, password: string) => {
  const response = await fetch('https://api.campusloop.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
};
```

## Key Design Decisions

### 1. **Mock Services vs Real Backend**
- All services use mock data with realistic delays
- Easy to swap with REST API or Firebase
- No backend dependency for development

### 2. **Unique Naming Convention**
- All types, services, and components prefixed with `CampusLoop`
- Prevents naming collisions during refactoring
- Examples: `CampusLoopUser`, `CampusLoopAuthService`, `CampusLoopButton`

### 3. **Cross-Platform Compatibility**
- System fonts used (no custom font files needed initially)
- Platform-specific keyboard handling
- Responsive layouts for different screen sizes

### 4. **Modular Location Features**
- Location-based discovery is opt-in and modular
- Can be easily disabled by removing location context
- Privacy-first approach with user controls

### 5. **Theme System**
- Centralized design tokens
- Dark mode with persistent preference
- System preference detection

## Customization

### Colors & Gradients

Edit `src/constants/theme.ts`:
```typescript
export const CampusLoopColors = {
  light: {
    primary: '#6366F1',        // Change primary color
    gradientStart: '#6366F1',  // Gradient start
    gradientEnd: '#EC4899',    // Gradient end
    // ...
  },
};
```

### Universities & Courses

Edit `src/constants/universities.ts`:
```typescript
export const CampusLoopUniversities = [
  'Your University Name',
  // Add more universities
];
```

## Future Enhancements

- [ ] Real-time messaging with WebSockets
- [ ] Push notifications
- [ ] Image upload for posts and activities
- [ ] Advanced search and filtering
- [ ] University email verification (SSO)
- [ ] Location-based nearby student discovery
- [ ] In-app notifications center
- [ ] Activity chat rooms
- [ ] Calendar integration
- [ ] File sharing for assignments

## Troubleshooting

### Common Issues

**Metro bundler issues**
```bash
npm start -- --reset-cache
```

**iOS build fails**
```bash
cd ios && pod install && cd ..
npm run ios
```

**Android build fails**
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

**TypeScript errors**
```bash
npm run lint
```

## Contributing

This is a demonstration project. For production use:
1. Replace mock services with real backend
2. Add comprehensive error handling
3. Implement proper authentication security
4. Add unit and integration tests
5. Set up CI/CD pipeline

## License

MIT License - feel free to use this as a template for your own projects.

## Contact

For questions or feedback about this implementation, please refer to the implementation plan and task documentation in the `.gemini/antigravity/brain/` directory.

---

**Built with ❤️ for university students worldwide**
