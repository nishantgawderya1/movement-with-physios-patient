# MWP Patient — Claude Code Execution Plan

This document is an **ordered implementation checklist** for Claude Code.
Work through phases sequentially. Each phase must be complete and compiling before starting the next.

## Stack Reference
- Expo 54 / React Native 0.81.5 / React 19
- JavaScript only (NO TypeScript, NO .ts/.tsx files)
- StyleSheet.create() ONLY — no inline styles
- Colors from `src/constants/colors.js` (use the `colors` named export)
- Font sizes from `src/constants/fonts.js` (use `fonts` named export)
- Route names from `src/constants/routes.js` (use `PATIENT_ROUTES`)
- No linter / formatter / test runner

---

## Phase 1 — Install Dependencies (DONE — scaffold created)

Files already created:
- [x] `package.json`
- [x] `app.json`
- [x] `App.jsx`
- [x] `src/constants/colors.js`
- [x] `src/constants/fonts.js`
- [x] `src/constants/routes.js`
- [x] `src/navigation/AppNavigator.jsx`

**Your first task:** Run `npm install` in the repo root.

---

## Phase 2 — Auth Navigator (Stack)

Create `src/navigation/AuthNavigator.jsx`:
- Use `createNativeStackNavigator` from `@react-navigation/native-stack`
- Screens (in order): SPLASH → LOGIN → CLERK_AUTH → PERSONAL_INFO → MEDICAL_HISTORY → ONBOARDING_COMPLETE
- Each screen points to a placeholder screen component (see Phase 3)
- No header on any screen (`headerShown: false`)

Update `src/navigation/AppNavigator.jsx`:
- Import `AuthNavigator` from `./AuthNavigator`
- Replace the inline placeholder `AuthNavigator` component with the imported one
- Keep the TODO comment pointing to `MainNavigator` swap

---

## Phase 3 — Placeholder Screens for Auth Flow

Create one file per screen. Each screen is a simple `View` with a centered `Text` label.
Folder: `src/screens/auth/`

Files to create:
- `SplashScreen.jsx` — shows "Splash" label, white background
- `LoginScreen.jsx` — shows "Login" label
- `ClerkAuthScreen.jsx` — shows "Clerk Auth" label
- `PersonalInfoScreen.jsx` — shows "Personal Info" label
- `MedicalHistoryScreen.jsx` — shows "Medical History" label
- `OnboardingCompleteScreen.jsx` — shows "Onboarding Complete" label

Each file pattern:
```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function ExampleScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Screen Name</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  label: {
    fontSize: fonts.xl,
    color: colors.textDark,
  },
});
```

---

## Phase 4 — Bottom Tab Navigator (Main App)

Create `src/navigation/MainNavigator.jsx`:
- Use `createBottomTabNavigator` from `@react-navigation/bottom-tabs`
- 5 tabs: Home, Appointments, Exercises, Messages, Progress
- Each tab renders a placeholder stack navigator (see Phase 5)
- Tab icons from `@expo/vector-icons` (Ionicons)
  - Home: `home-outline` / `home`
  - Appointments: `calendar-outline` / `calendar`
  - Exercises: `barbell-outline` / `barbell`
  - Messages: `chatbubble-outline` / `chatbubble`
  - Progress: `trending-up-outline` / `trending-up`
- Active tint: `colors.primary` (`#1A5C4A`)
- Inactive tint: `colors.textLight`
- Tab bar background: `colors.white`
- No label shown (or short label in ALL CAPS)
- `headerShown: false` on the tab navigator

---

## Phase 5 — Per-Tab Stack Navigators

Create one stack navigator per tab. Each stack uses `createNativeStackNavigator`.
All header shown = false at stack level.

| File | Root Screen | Additional Screens |
|---|---|---|
| `src/navigation/stacks/HomeStack.jsx` | HOME | — |
| `src/navigation/stacks/AppointmentsStack.jsx` | APPOINTMENTS | BOOK_APPOINTMENT, APPOINTMENT_DETAIL, RESCHEDULE |
| `src/navigation/stacks/ExercisesStack.jsx` | EXERCISES | EXERCISE_DETAIL, EXERCISE_COMPLETE |
| `src/navigation/stacks/MessagesStack.jsx` | MESSAGES | CHAT |
| `src/navigation/stacks/ProgressStack.jsx` | PROGRESS | LOG_PAIN |

All screens are placeholder components in `src/screens/main/` (same pattern as Phase 3).

---

## Phase 6 — Shared UI Components

Create `src/components/` with these reusable components:

### `PrimaryButton.jsx`
Props: `{ title, onPress, disabled, loading }`
- Full-width, 48px height, rounded corners (borderRadius 12)
- Background: `colors.buttonPrimary`, text: `colors.buttonPrimaryText`
- Font: `fonts.md`, weight `fonts.semibold`
- Shows `ActivityIndicator` when `loading=true`
- Reduced opacity when `disabled=true`

### `OutlineButton.jsx`
Props: `{ title, onPress, disabled }`
- Full-width, 48px height, borderRadius 12
- Border: 1.5px `colors.buttonOutlineBorder`
- Text: `colors.buttonOutlineText`

### `TextInput.jsx` (custom)
Props: `{ label, placeholder, value, onChangeText, secureTextEntry, error, keyboardType }`
- Label above input in `fonts.sm`, `colors.textMedium`
- Input box with border `colors.inputBorder`, background `colors.inputBg`, borderRadius 10
- Error text below in `colors.error`, `fonts.xs`
- Placeholder color: `colors.placeholder`

### `ScreenHeader.jsx`
Props: `{ title, subtitle, showBack, onBack }`
- Renders title in InstrumentSerif font (`fontFamilies.instrumentSerif`)
- Optional subtitle in `fonts.sm`, `colors.subtext`
- Optional back chevron (Ionicons `chevron-back`) that calls `onBack`

### `Card.jsx`
Props: `{ children, style }`
- White background, borderRadius 16, shadow (iOS shadow + Android elevation 3)
- Border: 1px `colors.cardBorder`

---

## Phase 7 — Profile & Settings Screens

These screens are accessible from a Profile icon in the tab bar or via a stack from any tab.

Create `src/navigation/stacks/ProfileStack.jsx`:
- Screens: PROFILE → EDIT_PROFILE, SETTINGS

Add Profile tab to `MainNavigator.jsx` (6th tab or via modal):
- Icon: `person-outline` / `person`

Create placeholder screens in `src/screens/profile/`:
- `ProfileScreen.jsx`
- `EditProfileScreen.jsx`
- `SettingsScreen.jsx`

---

## Phase 8 — Invoice & Video Call Screens (Modal)

These screens are launched as modals from other screens (not in the tab bar).

In `MainNavigator.jsx`, wrap everything in a root `createNativeStackNavigator`:
- presentation: `'modal'` for: INVOICES, INVOICE_DETAIL, VIDEO_CALL

Create screens:
- `src/screens/main/InvoicesScreen.jsx`
- `src/screens/main/InvoiceDetailScreen.jsx`
- `src/screens/main/VideoCallScreen.jsx`

---

## Phase 9 — Wire Up AppNavigator Auth → Main Switch

In `AppNavigator.jsx`, add logic to switch between `AuthNavigator` and `MainNavigator`:
- Use a simple boolean state for now: `const [isAuthenticated, setIsAuthenticated] = useState(false)`
- When `isAuthenticated` is false → render `<AuthNavigator />`
- When `isAuthenticated` is true → render `<MainNavigator />`
- Pass a callback `onAuthComplete={() => setIsAuthenticated(true)}` through navigation params or context

> TODO: Replace this state toggle with a real auth context / Clerk session in a later phase.

---

## Coding Rules (ENFORCE FOR EVERY FILE)

1. **No TypeScript.** Files are `.jsx` or `.js` only. No `interface`, `type`, `: string`, etc.
2. **StyleSheet.create() only.** Never write `style={{ ... }}` inline. Define styles at the bottom of every file.
3. **Use constants.** Always import from `colors.js`, `fonts.js`, `routes.js`. No hex codes or raw numbers in component files.
4. **No libraries not in package.json.** If you think you need one, stop and ask first.
5. **JSDoc comments** on every exported component describing props.
6. **One component per file.** No multi-export component files.
7. **Folder structure:**
   ```
   src/
     components/     ← shared UI
     constants/      ← colors, fonts, routes
     navigation/     ← AppNavigator, AuthNavigator, MainNavigator, stacks/
     screens/
       auth/         ← onboarding screens
       main/         ← home, appointments, exercises, messages, progress, invoices, video
       profile/      ← profile, edit-profile, settings
   ```

---

## Verification Checklist (run after each phase)

- [ ] `npx expo start` launches without crashing
- [ ] No red error screen on device/simulator
- [ ] No TypeScript syntax in any `.js` / `.jsx` file
- [ ] No inline styles — all styles in `StyleSheet.create()`
- [ ] All color values come from `colors` import
- [ ] All font sizes come from `fonts` import
- [ ] All route strings come from `PATIENT_ROUTES` import
