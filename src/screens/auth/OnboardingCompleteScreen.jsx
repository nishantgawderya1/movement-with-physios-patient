import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { fonts, fontFamilies } from '../../constants/fonts';
import { PATIENT_ROUTES } from '../../constants/routes';

/**
 * Onboarding success screen — shown after payload is submitted.
 * CTA navigates to the main app dashboard (HOME).
 *
 * @param {{ navigation: object }} props
 */
export default function OnboardingCompleteScreen({ navigation }) {
  function handleGoToDashboard() {
    navigation.replace(PATIENT_ROUTES.HOME);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Ionicons name="checkmark-circle" size={80} color={colors.white} />
        <Text style={styles.heading}>You're all set!</Text>
        <Text style={styles.subtitle}>Your recovery journey begins now.</Text>
        <Pressable onPress={handleGoToDashboard} style={styles.outlineBtn}>
          <Text style={styles.outlineBtnText}>Go to Dashboard</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

var styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  heading: {
    fontFamily: fontFamilies.instrumentSerif,
    fontSize: fonts.xxl,
    color: colors.white,
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fonts.md,
    color: colors.white,
    opacity: 0.85,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: fonts.md * 1.5,
  },
  outlineBtn: {
    marginTop: 40,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: colors.white,
    paddingHorizontal: 32,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineBtnText: {
    color: colors.white,
    fontSize: fonts.md,
    fontWeight: fonts.semibold,
  },
});
