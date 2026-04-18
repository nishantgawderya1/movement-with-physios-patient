import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PATIENT_ROUTES } from '../constants/routes';

import HomeStack from './stacks/HomeStack';
import BookStack from './stacks/BookStack';
import ProgressScreen from '../screens/main/ProgressScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import AnimatedTabBar from '../components/navigation/AnimatedTabBar';

const Tab = createBottomTabNavigator();

/**
 * Main app bottom tab navigator.
 * 4 tabs: Home (HomeStack), Book (BookStack), Progress, Profile.
 *
 * Uses AnimatedTabBar for:
 *  - Spring-animated teal pill indicator above the active icon
 *  - Light haptic feedback on every tab press
 *  - Safe-area-aware height (home indicator clearance)
 *
 * lazy: false preloads all tabs so switching feels instant.
 * HOME tab uses HomeStack so SessionScreen can be pushed inside it.
 */
export default function MainNavigator() {
  var fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(function () {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 300,
      delay: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeIn }}>
      <Tab.Navigator
        tabBar={function (props) { return <AnimatedTabBar {...props} />; }}
        screenOptions={{ headerShown: false, lazy: false }}
      >
        <Tab.Screen name={PATIENT_ROUTES.HOME} component={HomeStack} />
        <Tab.Screen name={PATIENT_ROUTES.BOOK_APPOINTMENT} component={BookStack} />
        <Tab.Screen name={PATIENT_ROUTES.PROGRESS} component={ProgressScreen} />
        <Tab.Screen name={PATIENT_ROUTES.PROFILE} component={ProfileScreen} />
      </Tab.Navigator>
    </Animated.View>
  );
}
