import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';

// TODO: swap AuthNavigator → MainNavigator after auth state is wired (Phase 3)

/**
 * Root navigation wrapper.
 * Provides NavigationContainer to the entire app.
 * Currently renders AuthNavigator; swap to MainNavigator once auth is live.
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}
