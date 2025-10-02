// src/components/ScenarioSelector.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';
import { getAvailableScenarios, saveSelectedScenarioId, loadSelectedScenarioId, Scenario } from '../data/scenarioManager';

interface ScenarioSelectorProps {
  visible: boolean;
  onClose: () => void;
  onScenarioSelected: (scenario: Scenario) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ visible, onClose, onScenarioSelected }) => {
  const [scenarios] = useState<Scenario[]>(getAvailableScenarios());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadSelectedScenarioId().then(id => setSelectedId(id));
  }, []);

  const handleSelectScenario = async (scenario: Scenario) => {
    await saveSelectedScenarioId(scenario.id);
    setSelectedId(scenario.id);
    onScenarioSelected(scenario);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar Cenário</Text>
            <Text style={styles.subtitle}>Escolha um cenário de teste para usar no app</Text>
          </View>

          <ScrollView style={styles.scenarioList}>
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
                      <Text style={styles.selectedBadgeText}>Selecionado</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.scenarioDescription}>{scenario.description}</Text>
                <View style={styles.scenarioMeta}>
                  <Text style={styles.scenarioMetaText}>CPF: {scenario.user.cpf}</Text>
                  <Text style={styles.scenarioMetaText}>Resultado esperado: {scenario.expectedOutcome}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: spacing.large,
  },
  header: {
    marginBottom: spacing.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.small,
  },
  subtitle: {
    fontSize: 14,
    color: colors.welcomeText,
  },
  scenarioList: {
    marginBottom: spacing.medium,
  },
  scenarioCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    borderWidth: 2,
    borderColor: 'transparent',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  selectedBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  selectedBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  scenarioDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.small,
  },
  scenarioMeta: {
    marginTop: spacing.small,
  },
  scenarioMetaText: {
    fontSize: 12,
    color: colors.welcomeText,
    marginBottom: 2,
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
