import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import OnboardingShell from '../../components/auth/OnboardingShell';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { PATIENT_ROUTES } from '../../constants/routes';

var SCREEN_WIDTH = Dimensions.get('window').width;
var HORIZONTAL_PADDING = 48;
var BUTTON_GAP = 6;
var BUTTON_SIZE = Math.floor(
  (SCREEN_WIDTH - HORIZONTAL_PADDING - BUTTON_GAP * 9) / 10
);

var SEVERITY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Step 3 — Rate pain severity on a scale of 1–10 (single select).
 *
 * @param {{ navigation: object }} props
 */
export default function PainSeverityScreen({ navigation }) {
  var { painSeverity: contextSeverity, updateOnboardingData } = useOnboarding();

  var [selectedSeverity, setSelectedSeverity] = useState(
    contextSeverity !== null && contextSeverity !== undefined ? contextSeverity : null
  );

  function handleContinue() {
    updateOnboardingData({ painSeverity: selectedSeverity });
    navigation.navigate(PATIENT_ROUTES.PAIN_DURATION);
  }

  function handleBack() {
    navigation.goBack();
  }

  return (
    <OnboardingShell
      step={3}
      heading="How severe is your pain?"
      subtitle="On a scale of 1 to 10"
      onBack={handleBack}
      onContinue={handleContinue}
      isContinueDisabled={selectedSeverity === null}
    >
      <View style={styles.row}>
        {SEVERITY_LEVELS.map(function (level) {
          var isSelected = selectedSeverity === level;
          return (
            <Pressable
              key={level}
              onPress={function () { setSelectedSeverity(level); }}
              style={[styles.button, isSelected ? styles.buttonSelected : styles.buttonDefault]}
              accessibilityRole="button"
              accessibilityLabel={'Pain level ' + level}
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelDefault]}>
                {level}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>1 = No pain</Text>
        <Text style={styles.legendText}>10 = Worst pain</Text>
      </View>
    </OnboardingShell>
  );
}

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDefault: {
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
  },
  buttonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: fonts.sm,
    fontWeight: fonts.semibold,
  },
  labelDefault: {
    color: colors.textDark,
  },
  labelSelected: {
    color: colors.white,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendText: {
    fontSize: fonts.xs,
    color: colors.textLight,
  },
});
