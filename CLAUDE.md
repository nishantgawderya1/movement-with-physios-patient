# MWP Patient — Claude Code Reference

This document is the **single source of truth** for the current state of the MWP Patient app.
It captures every decision, convention, and completed change made by Claude Code.
Update this file after every session.

---

## Stack

| Item | Version |
|---|---|
| Expo SDK | 54 |
| React Native | 0.81.5 |
| React | 19.1.0 |
| Language | JavaScript only — `.jsx` / `.js`. NO TypeScript, NO `.ts`/`.tsx` |
| Navigation | `@react-navigation/stack` v7 (NOT native-stack — needed for TransitionPresets) |
| Tab navigation | `@react-navigation/bottom-tabs` v7 |
| Fonts | `@expo-google-fonts/lora` + `@expo-google-fonts/nunito` |
| Icons | `@expo/vector-icons` (Ionicons) |
| Haptics | `expo-haptics` |
| Gestures | `react-native-gesture-handler` ~2.28.0 |
| Safe Area | `react-native-safe-area-context` ~5.6.0 |

---

## Coding Rules (ENFORCE FOR EVERY FILE)

1. **No TypeScript.** Files are `.jsx` or `.js` only. No `interface`, `type`, `: string`, etc.
2. **StyleSheet.create() only.** Never write `style={{ ... }}` inline. Exception: dynamic values that depend on runtime hooks (e.g. `insets.bottom`) can be merged with `[styles.x, { paddingBottom: 60 + insets.bottom }]`.
3. **Use constants.** Always import from `colors.js`, `fonts.js`, `routes.js`. No raw hex codes or magic numbers in component files.
4. **No libraries not in package.json.** Stop and ask first.
5. **JSDoc comments** on every exported component describing props.
6. **One component per file.** No multi-export component files.
7. **`var` declarations** are preferred over `const`/`let` in component files (existing code style).
8. **Folder structure:**
   ```
   src/
     components/
       booking/        ← TherapistCard
       navigation/     ← AnimatedTabBar
       ui/             ← PrimaryButton, OutlineButton
     constants/        ← colors.js, fonts.js, routes.js
     context/          ← OnboardingContext, PatientContext
     navigation/
       stacks/         ← BookStack
       AppNavigator.jsx
       AuthNavigator.jsx
       MainNavigator.jsx
       RootNavigator.jsx
     screens/
       auth/           ← LoginScreen, onboarding steps, OnboardingCompleteScreen
       main/           ← HomeScreen, Book*, Progress, Profile
       splash/         ← SplashScreen
   ```

---

## Constants Reference

### `src/constants/colors.js`
```js
colors.background      // #FFFFFF
colors.surface         // #F4F6F9
colors.primary         // #00B894  (teal)
colors.primaryLight    // #E0F7F2  (soft teal tint)
colors.primaryDark     // #007A5E
colors.textDark        // #1A1A2E
colors.textMedium      // #4A5568
colors.textLight       // #A0AEC0
colors.textOnPrimary   // #FFFFFF
colors.border          // #E2E8F0
colors.divider         // #EDF2F7
colors.danger          // #E53E3E
colors.planCardStart   // #00B894  (gradient start)
colors.planCardEnd     // #007A5E  (gradient end)
```

### `src/constants/fonts.js`
```js
// Heading font — Lora (serif)
fonts.heading.regular  → 'Lora_400Regular'
fonts.heading.italic   → 'Lora_400Regular_Italic'
fonts.heading.semibold → 'Lora_600SemiBold'

// Body font — Nunito (rounded sans-serif)
fonts.body.regular     → 'Nunito_400Regular'
fonts.body.medium      → 'Nunito_500Medium'
fonts.body.semibold    → 'Nunito_600SemiBold'

// Size scale (also top-level for backward compat)
fonts.xs  = 11   fonts.sm  = 13   fonts.md  = 15
fonts.lg  = 17   fonts.xl  = 20   fonts.xxl = 26   fonts.xxxl = 32

// Weight shorthands
fonts.regular = '400'  fonts.medium = '500'  fonts.semibold = '600'
fonts.bold    = '700'  fonts.extrabold = '800'
```

**Typography rules:**
- `fonts.heading.regular` — screen titles, plan card titles, section headings, `lineHeight = fontSize * 1.35`
- `fonts.body.*` — all other text: labels, buttons, pills, tab labels, body copy
- `fonts.body.semibold` + `letterSpacing: 0.3` — button labels (PrimaryButton, OutlineButton)
- `fonts.body.medium` + `fontSize: 11` — tab bar labels

### `src/constants/routes.js` — Key values
```js
PATIENT_ROUTES.HOME              = 'HOME'
PATIENT_ROUTES.SESSION           = 'SESSION'   // ← exercise player screen
PATIENT_ROUTES.BOOK_APPOINTMENT  = 'BOOK_APPOINTMENT'
PATIENT_ROUTES.BOOK_THERAPIST    = 'BOOK_THERAPIST'
PATIENT_ROUTES.SLOT_SELECTION    = 'SLOT_SELECTION'
PATIENT_ROUTES.BOOKING_CONFIRMED = 'BOOKING_CONFIRMED'
PATIENT_ROUTES.PROGRESS          = 'PROGRESS'
PATIENT_ROUTES.PROFILE           = 'PROFILE'
// Auth
PATIENT_ROUTES.SPLASH            = 'SPLASH'
PATIENT_ROUTES.LOGIN             = 'LOGIN'
PATIENT_ROUTES.PERSONAL_INFO     = 'PERSONAL_INFO'
// ... (PAIN_LOCATION, PAIN_SEVERITY, PAIN_DURATION, TREATMENT_HISTORY,
//      RECOVERY_GOALS, AVAILABILITY, ONBOARDING_COMPLETE)
```

---

## Navigation Architecture

```
App.jsx
└── GestureHandlerRootView         ← required by @react-navigation/stack for swipe-back
    └── SafeAreaProvider           ← required for useSafeAreaInsets everywhere
        └── AppNavigator.jsx
            ├── BackHandler (Android hardware back)
            └── NavigationContainer (ref attached)
                └── PatientProvider
                    └── RootNavigator.jsx
                        ├── isOnboardingComplete=false → AuthNavigator.jsx
                        └── isOnboardingComplete=true  → MainNavigator.jsx
```

### AuthNavigator — `src/navigation/AuthNavigator.jsx`
- Uses `createStackNavigator` from `@react-navigation/stack`
- `TransitionPresets.SlideFromRightIOS` with spring config:
  `{ stiffness: 1000, damping: 500, mass: 3, overshootClamping: true }`
- `gestureEnabled: true`, `gestureDirection: 'horizontal'`
- Wrapped in `<OnboardingProvider>`
- Screens: Splash → Login → ClerkAuth → PersonalInfo → PainLocation → PainSeverity → PainDuration → TreatmentHistory → RecoveryGoals → Availability → OnboardingComplete

### MainNavigator — `src/navigation/MainNavigator.jsx`
- Uses `createBottomTabNavigator`
- `tabBar` prop → renders `<AnimatedTabBar>` (custom component)
- `lazy: false` — preloads all 4 tabs for instant switching
- `headerShown: false` on all screens
- 4 tabs: HOME → BookStack → PROGRESS → PROFILE
- HOME tab uses **HomeStack** (not bare HomeScreen) so SESSION can be pushed inside it

### HomeStack — `src/navigation/stacks/HomeStack.jsx`
- Uses `createStackNavigator` (NOT native-stack)
- Same `TransitionPresets.SlideFromRightIOS` spring config as BookStack
- Screens: Home → Session

### BookStack — `src/navigation/stacks/BookStack.jsx`
- Uses `createStackNavigator` (NOT native-stack)
- Same `TransitionPresets.SlideFromRightIOS` spring config as AuthNavigator
- Screens: BookTherapist → SlotSelection → BookingConfirmed

### AnimatedTabBar — `src/components/navigation/AnimatedTabBar.jsx`
- Custom tab bar component, receives `{ state, descriptors, navigation }` from React Navigation
- **Teal pill indicator**: `width: 32, height: 3, borderRadius: 99, backgroundColor: colors.primary`
- **Position**: `position: 'absolute', top: 0`, centered via `marginLeft: (tabWidth - 32) / 2`
- **Animation**: `Animated.spring` on `pillX` value — `{ stiffness: 300, damping: 30, useNativeDriver: true }`
- **Haptics**: `Haptics.impactAsync(ImpactFeedbackStyle.Light)` on every tab press
- **Safe area**: `useSafeAreaInsets()` — height = `60 + insets.bottom`
- Uses `navigation.emit({ type: 'tabPress' })` for correct React Navigation event handling

---

## Button Components

### `src/components/ui/PrimaryButton.jsx`
```
backgroundColor: colors.primary   borderRadius: 12   height: 52
label: fonts.body.semibold, color: colors.textOnPrimary, fontSize: 15, letterSpacing: 0.3
disabled: backgroundColor: colors.primaryLight, opacity: 0.7
```

### `src/components/ui/OutlineButton.jsx`
```
backgroundColor: colors.primaryLight   borderWidth: 1.5   borderColor: colors.primary
borderRadius: 12   height: 52
label: fonts.body.semibold, color: colors.primary, fontSize: 15, letterSpacing: 0.3
```

---

## Screen Inventory & Navigation Wiring

### Auth Screens (`src/screens/auth/`)
All wrapped in `OnboardingProvider` via `AuthNavigator`.

| Screen | Notes |
|---|---|
| `SplashScreen.jsx` | Logo + auto-advance |
| `LoginScreen.jsx` | Heading: `fonts.heading.regular` |
| `PersonalInfoScreen.jsx` | — |
| `PainLocationScreen.jsx` | — |
| `PainSeverityScreen.jsx` | — |
| `PainDurationScreen.jsx` | — |
| `TreatmentHistoryScreen.jsx` | — |
| `RecoveryGoalsScreen.jsx` | — |
| `AvailabilityScreen.jsx` | — |
| `OnboardingCompleteScreen.jsx` | Heading: `fonts.heading.regular` |

`OnboardingShell.jsx` (`src/components/auth/`) — step progress wrapper used by onboarding screens.

### Main Screens (`src/screens/main/`)

#### `HomeScreen.jsx`
- Accepts `{ navigation }` prop
- Imports `PATIENT_ROUTES` from routes
- Interactive elements wired:
  - 🔔 Bell icon → `onPress: () => {}` (TODO stub)
  - 👤 Avatar → `navigation.navigate(PATIENT_ROUTES.PROFILE)`
  - **START SESSION** → `navigation.navigate(PATIENT_ROUTES.SESSION)` ← updated
  - **View All** (Pain Trend) → `navigation.navigate(PATIENT_ROUTES.PROGRESS)`
  - **Book Session** quick action → `navigation.navigate(BOOK_APPOINTMENT, { screen: BOOK_THERAPIST })`
  - **View Progress** quick action → `navigation.navigate(PATIENT_ROUTES.PROGRESS)`
- ScrollView `contentContainerStyle` uses `[styles.scrollContent, { paddingBottom: 60 + insets.bottom }]`
- Headings: `fonts.heading.regular` + `lineHeight: fontSize * 1.35`

#### `BookTherapistScreen.jsx`
- Accepts `{ navigation }` prop
- TherapistCard onPress → `navigation.navigate(PATIENT_ROUTES.SLOT_SELECTION, { therapist })`
- Back button → `navigation.goBack()`

#### `SlotSelectionScreen.jsx`
- Accepts `{ navigation, route }` prop
- Reads `therapist` from `route.params`
- Confirm Booking → `navigation.navigate(PATIENT_ROUTES.BOOKING_CONFIRMED, { therapist, slot, date })`
- Back button → `navigation.goBack()`

#### `BookingConfirmedScreen.jsx`
- Accepts `{ navigation, route }` prop
- Reads `therapist`, `slot`, `date` from `route.params`
- Back to Home → `navigation.navigate(PATIENT_ROUTES.HOME)` (navigate, not goBack)
- Animated scale-in checkmark on mount

#### `ProgressScreen.jsx`
- ScrollView `contentContainerStyle` uses dynamic `paddingBottom: 60 + insets.bottom`
- Heading: `fonts.heading.regular` + lineHeight

#### `ProfileScreen.jsx`
- Accepts `{ navigation }` prop (even though not navigating away currently)
- Menu rows now have `onPress` handlers via `handleComingSoon()` → `Alert.alert('Coming soon', '', [{ text: 'OK' }])`
- ScrollView uses dynamic `paddingBottom: 60 + insets.bottom`

---

## Tab Bar — Safe Area Fix

Tab bar is `position: 'absolute'` inside `AnimatedTabBar`. This means **all tab screens with ScrollView must add paddingBottom** to prevent content hiding behind the tab bar.

**Pattern (in every main screen with ScrollView):**
```jsx
var insets = useSafeAreaInsets();
// ...
<ScrollView
  contentContainerStyle={[styles.scrollContent, { paddingBottom: 60 + insets.bottom }]}
>
```

Screens already updated: `HomeScreen`, `ProgressScreen`, `ProfileScreen`.

---

## Cross-Tab Navigation Pattern

When navigating from one tab into a screen nested inside another tab's stack:
```js
// CORRECT — switches to BOOK_APPOINTMENT tab then pushes BOOK_THERAPIST
navigation.navigate(PATIENT_ROUTES.BOOK_APPOINTMENT, {
  screen: PATIENT_ROUTES.BOOK_THERAPIST,
});

// WRONG — won't find the screen if called from a different tab
navigation.navigate(PATIENT_ROUTES.BOOK_THERAPIST);
```

---

## Android BackHandler

Implemented in `AppNavigator.jsx`:
```js
var sub = BackHandler.addEventListener('hardwareBackPress', function () {
  if (navigationRef.current?.canGoBack()) {
    navigationRef.current.goBack();
    return true;   // consumed
  }
  return false;   // let system handle (exit/minimise)
});
return () => sub.remove();  // cleanup on unmount
```

---

## Font Loading — `App.jsx`

```js
// Loaded at startup via useFonts()
Lora_400Regular, Lora_400Regular_Italic, Lora_600SemiBold,
Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold
```

App renders `null` until fonts are loaded (or error). SplashScreen held via `expo-splash-screen`.

---

## Known Stubs / TODO

| Item | Status |
|---|---|
| Notifications screen | No-op `onPress: () => {}` in HomeScreen bell icon |
| Profile menu rows (Personal Info, Notifications, Settings, Help) | `Alert.alert('Coming soon')` |
| Clerk auth integration | Stub `ClerkAuthScreen` shows "Login coming soon" |
| Session screen (exercise player) | ✅ Built — `SessionScreen.jsx`, 5 mock exercises, rep + duration modes |
| Real therapy session data | All data is mock from `PatientContext` / hardcoded in SessionScreen |

---

## Verification Checklist (run after each session)

- [ ] `npx expo start` launches without crashing
- [ ] No red error screen on device/simulator
- [ ] No TypeScript syntax in any `.js` / `.jsx` file
- [ ] No inline styles — use `StyleSheet.create()` + array merge for dynamic values
- [ ] All color values come from `colors` import (no raw hex)
- [ ] All font sizes/families come from `fonts` import
- [ ] All route strings come from `PATIENT_ROUTES` import
- [ ] Every screen with ScrollView inside a tab has `paddingBottom: 60 + insets.bottom`
- [ ] New stack navigators use `@react-navigation/stack` (not `native-stack`)
- [ ] `GestureHandlerRootView` and `SafeAreaProvider` are the outermost wrappers in `App.jsx`
