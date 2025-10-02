// src/screens/ScenarioPickerScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { colors, spacing, typography } from '../theme/theme';
import { getAvailableScenarios, saveSelectedScenarioId, loadSelectedScenarioId, Scenario } from '../data/scenarioManager';
import AppLogo from '../components/AppLogo';

type ScenarioPickerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ScenarioPicker'>;
interface Props { navigation: ScenarioPickerScreenNavigationProp; }

const ScenarioPickerScreen: React.FC<Props> = ({ navigation }) => {
  const [scenarios] = useState<Scenario[]>(getAvailableScenarios());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadSelectedScenarioId().then(id => setSelectedId(id));
  }, []);

  const handleSelectScenario = async (scenario: Scenario) => {
    await saveSelectedScenarioId(scenario.id);
    setSelectedId(scenario.id);
    navigation.navigate('Onboarding');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <AppLogo />
          <Text style={styles.title}>Modo Demo</Text>
          <Text style={styles.subtitle}>Escolha um cenário para demonstração</Text>
        </View>

        <ScrollView style={styles.scenarioList} showsVerticalScrollIndicator={false}>
          {scenarios.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              style={[
                styles.scenarioCard,
                selectedId === scenario.id && styles.scenarioCardSelected
              ]}
              onPress={() => handleSelectScenario(scenario)}
            >
              <View style={styles.scenarioHeader}>
                <Text style={styles.scenarioName}>{scenario.name}</Text>
                {selectedId === scenario.id && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.scenarioDescription}>{scenario.description}</Text>
              <View style={styles.scenarioMeta}>
                <Text style={styles.scenarioMetaText}>👤 {scenario.user.nome}</Text>
                <Text style={styles.scenarioMetaText}>📄 CPF: {scenario.user.cpf}</Text>
                <Text style={styles.scenarioMetaText}>
                  📊 Resultado esperado: <Text style={styles.expectedOutcome}>{scenario.expectedOutcome}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    padding: spacing.large
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xlarge,
    marginTop: spacing.medium,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing.large,
    marginBottom: spacing.small,
  },
  subtitle: {
    fontSize: 16,
    color: colors.welcomeText,
    textAlign: 'center',
  },
  scenarioList: {
    flex: 1,
  },
  scenarioCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.large,
    marginBottom: spacing.medium,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scenarioCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#E3F2FD',
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  scenarioName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  selectedBadge: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scenarioDescription: {
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.medium,
    lineHeight: 22,
  },
  scenarioMeta: {
    marginTop: spacing.small,
    paddingTop: spacing.small,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  scenarioMetaText: {
    fontSize: 14,
    color: colors.welcomeText,
    marginBottom: 4,
  },
  expectedOutcome: {
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default ScenarioPickerScreen;
