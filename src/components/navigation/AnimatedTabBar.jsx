import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { PATIENT_ROUTES } from '../../constants/routes';

var SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Icon name map for each tab route.
 */
var ICON_MAP = {
  [PATIENT_ROUTES.HOME]: { focused: 'home', unfocused: 'home-outline' },
  [PATIENT_ROUTES.BOOK_APPOINTMENT]: { focused: 'calendar', unfocused: 'calendar-outline' },
  [PATIENT_ROUTES.PROGRESS]: { focused: 'bar-chart', unfocused: 'bar-chart-outline' },
  [PATIENT_ROUTES.PROFILE]: { focused: 'person', unfocused: 'person-outline' },
};

/**
 * Label map for each tab route.
 */
var LABEL_MAP = {
  [PATIENT_ROUTES.HOME]: 'Home',
  [PATIENT_ROUTES.BOOK_APPOINTMENT]: 'Book',
  [PATIENT_ROUTES.PROGRESS]: 'Progress',
  [PATIENT_ROUTES.PROFILE]: 'Profile',
};

/**
 * Custom animated tab bar.
 *
 * Features:
 *  - Teal pill indicator (32×3) that spring-animates to the active tab
 *  - Light haptic feedback on every tab press
 *  - Reads all colours and fonts from the central constants files
 *
 * @param {{ state, descriptors, navigation }} props  — provided by React Navigation
 */
export default function AnimatedTabBar({ state, descriptors, navigation }) {
  var insets = useSafeAreaInsets();
  var tabCount = state.routes.length;
  var tabWidth = SCREEN_WIDTH / tabCount;

  // Animated X position of the pill — starts at the active tab
  var pillX = useRef(new Animated.Value(state.index * tabWidth)).current;

  // Animate pill to the newly-active tab on every index change
  useEffect(function () {
    Animated.spring(pillX, {
      toValue: state.index * tabWidth,
      stiffness: 300,
      damping: 30,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth, pillX]);

  var TAB_BAR_HEIGHT = 60 + insets.bottom;

  return (
    <View
      style={[
        styles.container,
        {
          height: TAB_BAR_HEIGHT,
          paddingBottom: insets.bottom + 4,
        },
      ]}
    >
      {/* Animated pill indicator — sits at the very top of the bar */}
      <Animated.View
        style={[
          styles.pill,
          {
            transform: [{ translateX: pillX }],
            // Centre the pill within each tab column
            marginLeft: (tabWidth - 32) / 2,
          },
        ]}
      />

      {/* Tab items */}
      {state.routes.map(function (route, index) {
        var descriptor = descriptors[route.key];
        var isFocused = state.index === index;
        var iconSet = ICON_MAP[route.name] || { focused: 'help', unfocused: 'help-outline' };
        var label = LABEL_MAP[route.name] || route.name;
        var tintColor = isFocused ? colors.primary : colors.textLight;

        function handlePress() {
          // Trigger light haptic on every press (focused or not)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          var event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true });
          }
        }

        function handleLongPress() {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={descriptor.options.tabBarAccessibilityLabel}
            onPress={handlePress}
            onLongPress={handleLongPress}
            style={styles.tab}
          >
            <Ionicons
              name={isFocused ? iconSet.focused : iconSet.unfocused}
              size={22}
              color={tintColor}
            />
            <Text style={[styles.label, { color: tintColor }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    paddingTop: 8,
  },
  pill: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 99,
    backgroundColor: colors.primary,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    marginBottom: 2,
  },
});
