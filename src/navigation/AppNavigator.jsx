import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// TODO: Backend dev — swap to MainNavigator after auth is confirmed
// Import like: import AuthNavigator from './AuthNavigator';
// Import like: import MainNavigator from './MainNavigator';

/**
 * Placeholder AuthNavigator shell.
 * Phase 2: Replace this with a real createNativeStackNavigator
 * containing Login → ClerkAuth → PersonalInfo → MedicalHistory → OnboardingComplete.
 */
const AuthNavigator = () => (
  <View style={styles.center}>
    <Text style={styles.placeholder}>Auth Navigator — Phase 2</Text>
  </View>
);

/**
 * Root navigation wrapper.
 * Wraps the entire app in NavigationContainer so all child navigators
 * have access to navigation context.
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      {/* TODO: Backend dev — swap AuthNavigator → MainNavigator once auth flow is live */}
      <AuthNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
  placeholder: {
    fontSize: 16,
    color: '#718096',
  },
});
