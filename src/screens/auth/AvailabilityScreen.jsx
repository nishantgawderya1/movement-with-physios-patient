import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import OnboardingShell from '../../components/auth/OnboardingShell';
import SelectablePill from '../../components/auth/SelectablePill';
import { submitOnboarding } from '../../services/auth/mockOnboardingService';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { PATIENT_ROUTES } from '../../constants/routes';

var SLOT_OPTIONS = [
  'Weekday Mornings',
  'Weekday Afternoons',
  'Weekday Evenings',
  'Weekend Mornings',
  'Weekend Afternoons',
  'Weekend Evenings',
];

/**
 * Step 7 — Select availability slots (multi-select, 2-column flex-wrap).
 * On Continue: submits full onboarding payload to mock service.
 * Success → replace to OnboardingComplete.
 * Failure → show inline error.
 *
 * @param {{ navigation: object }} props
 */
export default function AvailabilityScreen({ navigation }) {
  var onboardingData = useOnboarding();
  var { availability: contextSlots, updateOnboardingData } = onboardingData;

  var [selectedSlots, setSelectedSlots] = useState(
    contextSlots && contextSlots.length > 0 ? contextSlots : []
  );
  var [isSubmitting, setIsSubmitting] = useState(false);
  var [submitError, setSubmitError] = useState(null);

  function toggleSlot(slot) {
    setSelectedSlots(function (prev) {
      if (prev.includes(slot)) {
        return prev.filter(function (s) { return s !== slot; });
      }
      return prev.concat(slot);
    });
    // clear any prior error when user changes selection
    if (submitError) {
      setSubmitError(null);
    }
  }

  async function handleContinue() {
    if (isSubmitting) { return; }

    updateOnboardingData({ availability: selectedSlots });

    var payload = Object.assign({}, onboardingData, { availability: selectedSlots });
    delete payload.updateOnboardingData;

    setIsSubmitting(true);
    setSubmitError(null);

    var result = await submitOnboarding(payload);

    setIsSubmitting(false);

    if (result.success) {
      navigation.replace(PATIENT_ROUTES.ONBOARDING_COMPLETE);
    } else {
      setSubmitError(result.error || 'Something went wrong. Please try again.');
    }
  }

  function handleBack() {
    navigation.goBack();
  }

  return (
    <OnboardingShell
      step={7}
      heading="When are you available?"
      subtitle="Select your preferred session times"
      onBack={handleBack}
      onContinue={handleContinue}
      isContinueDisabled={selectedSlots.length === 0 || isSubmitting}
      continueLabel={isSubmitting ? 'Submitting…' : 'Finish'}
    >
      <View style={styles.grid}>
        {SLOT_OPTIONS.map(function (slot) {
          return (
            <View key={slot} style={styles.pillWrapper}>
              <SelectablePill
                label={slot}
                isSelected={selectedSlots.includes(slot)}
                onPress={function () { toggleSlot(slot); }}
              />
            </View>
          );
        })}
      </View>

      {isSubmitting && (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.spinner}
        />
      )}

      {submitError !== null && (
        <Text style={styles.errorText}>{submitError}</Text>
      )}
    </OnboardingShell>
  );
}

var styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  pillWrapper: {
    width: '48%',
  },
  spinner: {
    marginTop: 12,
  },
  errorText: {
    fontSize: fonts.sm,
    color: colors.error,
    marginTop: 12,
    textAlign: 'center',
  },
});
