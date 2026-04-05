import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import OnboardingShell from '../../components/auth/OnboardingShell';
import SelectablePill from '../../components/auth/SelectablePill';
import { PATIENT_ROUTES } from '../../constants/routes';

var DURATION_OPTIONS = [
  'Less than 1 week',
  '1–4 weeks',
  '1–3 months',
  'More than 3 months',
];

/**
 * Step 4 — Select how long the patient has had pain (single select).
 *
 * @param {{ navigation: object }} props
 */
export default function PainDurationScreen({ navigation }) {
  var { painDuration: contextDuration, updateOnboardingData } = useOnboarding();

  var [selectedDuration, setSelectedDuration] = useState(contextDuration || null);

  function handleContinue() {
    updateOnboardingData({ painDuration: selectedDuration });
    navigation.navigate(PATIENT_ROUTES.TREATMENT_HISTORY);
  }

  function handleBack() {
    navigation.goBack();
  }

  return (
    <OnboardingShell
      step={4}
      heading="How long have you had this pain?"
      subtitle="Select the closest option"
      onBack={handleBack}
      onContinue={handleContinue}
      isContinueDisabled={!selectedDuration}
    >
      <View style={styles.list}>
        {DURATION_OPTIONS.map(function (option) {
          return (
            <View key={option} style={styles.pillWrapper}>
              <SelectablePill
                label={option}
                isSelected={selectedDuration === option}
                onPress={function () { setSelectedDuration(option); }}
              />
            </View>
          );
        })}
      </View>
    </OnboardingShell>
  );
}

var styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  pillWrapper: {
    marginBottom: 12,
  },
});
