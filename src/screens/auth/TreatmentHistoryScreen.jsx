import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import OnboardingShell from '../../components/auth/OnboardingShell';
import SelectablePill from '../../components/auth/SelectablePill';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { PATIENT_ROUTES } from '../../constants/routes';

/**
 * Step 5 — Has the patient received previous treatment? (single select yes/no)
 * If yes, show optional details text input.
 *
 * @param {{ navigation: object }} props
 */
export default function TreatmentHistoryScreen({ navigation }) {
  var {
    hadPreviousTreatment: contextHad,
    previousTreatmentDetails: contextDetails,
    updateOnboardingData,
  } = useOnboarding();

  var [hadTreatment, setHadTreatment] = useState(
    contextHad !== null && contextHad !== undefined ? contextHad : null
  );
  var [details, setDetails] = useState(contextDetails || '');

  function handleContinue() {
    updateOnboardingData({
      hadPreviousTreatment: hadTreatment,
      previousTreatmentDetails: hadTreatment ? details : '',
    });
    navigation.navigate(PATIENT_ROUTES.RECOVERY_GOALS);
  }

  function handleBack() {
    navigation.goBack();
  }

  return (
    <OnboardingShell
      step={5}
      heading="Have you been treated before?"
      subtitle="Previous physiotherapy or medical treatment"
      onBack={handleBack}
      onContinue={handleContinue}
      isContinueDisabled={hadTreatment === null}
    >
      <View style={styles.pillRow}>
        <View style={styles.pillHalf}>
          <SelectablePill
            label="Yes"
            isSelected={hadTreatment === true}
            onPress={function () { setHadTreatment(true); }}
          />
        </View>
        <View style={styles.pillHalf}>
          <SelectablePill
            label="No"
            isSelected={hadTreatment === false}
            onPress={function () {
              setHadTreatment(false);
              setDetails('');
            }}
          />
        </View>
      </View>

      {hadTreatment === true && (
        <View style={styles.detailsWrapper}>
          <Text style={styles.detailsLabel}>Brief details (optional)</Text>
          <TextInput
            style={styles.detailsInput}
            placeholder="e.g. 6 months of physiotherapy at a clinic"
            placeholderTextColor={colors.placeholder}
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            accessibilityLabel="Previous treatment details"
          />
        </View>
      )}
    </OnboardingShell>
  );
}

var styles = StyleSheet.create({
  pillRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  pillHalf: {
    flex: 1,
  },
  detailsWrapper: {
    width: '100%',
  },
  detailsLabel: {
    fontSize: fonts.sm,
    color: colors.textMedium,
    fontWeight: fonts.medium,
    marginBottom: 8,
  },
  detailsInput: {
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    padding: 14,
    fontSize: fonts.md,
    color: colors.textDark,
    backgroundColor: colors.inputBg,
    minHeight: 80,
  },
});
