import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import OnboardingShell from '../../components/auth/OnboardingShell';
import SelectablePill from '../../components/auth/SelectablePill';
import { PATIENT_ROUTES } from '../../constants/routes';

var GOAL_OPTIONS = [
  'Reduce Pain',
  'Improve Mobility',
  'Post-Surgery Recovery',
  'Sports Performance',
  'Posture Correction',
  'General Wellness',
];

/**
 * Step 6 — Select recovery goals (multi-select, 2-column flex-wrap).
 *
 * @param {{ navigation: object }} props
 */
export default function RecoveryGoalsScreen({ navigation }) {
  var { recoveryGoals: contextGoals, updateOnboardingData } = useOnboarding();

  var [selectedGoals, setSelectedGoals] = useState(
    contextGoals && contextGoals.length > 0 ? contextGoals : []
  );

  function toggleGoal(goal) {
    setSelectedGoals(function (prev) {
      if (prev.includes(goal)) {
        return prev.filter(function (g) { return g !== goal; });
      }
      return prev.concat(goal);
    });
  }

  function handleContinue() {
    updateOnboardingData({ recoveryGoals: selectedGoals });
    navigation.navigate(PATIENT_ROUTES.AVAILABILITY);
  }

  function handleBack() {
    navigation.goBack();
  }

  return (
    <OnboardingShell
      step={6}
      heading="What's your goal?"
      subtitle="Select all that apply"
      onBack={handleBack}
      onContinue={handleContinue}
      isContinueDisabled={selectedGoals.length === 0}
    >
      <View style={styles.grid}>
        {GOAL_OPTIONS.map(function (goal) {
          return (
            <View key={goal} style={styles.pillWrapper}>
              <SelectablePill
                label={goal}
                isSelected={selectedGoals.includes(goal)}
                onPress={function () { toggleGoal(goal); }}
              />
            </View>
          );
        })}
      </View>
    </OnboardingShell>
  );
}

var styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pillWrapper: {
    width: '48%',
  },
});
