// src/data/scenarioManager.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthorizationRequest } from '../contexts/UserContext';
import { UserToken } from './mockData';

// Scenario type definition matching the JSON structure
export interface Scenario {
  id: string;
  name: string;
  description: string;
  expectedOutcome: string;
  user: {
    cpf: string;
    dataNascimento: string;
    nome: string;
    rg: string;
    endereco: {
      rua: string;
      numero: string;
      complemento: string;
      bairro: string;
      cidade: string;
      estado: string;
      cep: string;
    };
    profissao: string;
    empresa: string;
    rendaMensal: number;
    telefone: string;
    email: string;
    aa_address: string;
    walletExistente: boolean;
  };
  kycResults: any;
  operationTokenResults: any;
  authorizationRequests: {
    [key: string]: AuthorizationRequest;
  };
  userTokens: UserToken[];
}

// Import all scenarios from the scenarios directory
import perfectCitizenScenario from './scenarios/perfect-citizen.json';
import badCreditScenario from './scenarios/bad-credit.json';
import ppeCitizenScenario from './scenarios/ppe-citizen.json';

// Available scenarios registry - automatically includes all imported scenarios
export const AVAILABLE_SCENARIOS: Scenario[] = [
  perfectCitizenScenario as Scenario,
  badCreditScenario as Scenario,
  ppeCitizenScenario as Scenario,
];

const SCENARIO_STORAGE_KEY = '@selected_scenario_id';

// Get all available scenarios
export const getAvailableScenarios = (): Scenario[] => {
  return AVAILABLE_SCENARIOS;
};

// Get scenario by ID
export const getScenarioById = (id: string): Scenario | undefined => {
  return AVAILABLE_SCENARIOS.find(scenario => scenario.id === id);
};

// Save selected scenario ID to AsyncStorage
export const saveSelectedScenarioId = async (scenarioId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(SCENARIO_STORAGE_KEY, scenarioId);
  } catch (error) {
    console.error('Error saving scenario ID:', error);
  }
};

// Load selected scenario ID from AsyncStorage
export const loadSelectedScenarioId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(SCENARIO_STORAGE_KEY);
  } catch (error) {
    console.error('Error loading scenario ID:', error);
    return null;
  }
};

// Get current scenario (loads from storage or returns default)
export const getCurrentScenario = async (): Promise<Scenario> => {
  const savedId = await loadSelectedScenarioId();

  if (savedId) {
    const scenario = getScenarioById(savedId);
    if (scenario) {
      return scenario;
    }
  }

  // Default to first scenario if none selected
  return AVAILABLE_SCENARIOS[0];
};

// Clear selected scenario
export const clearSelectedScenario = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SCENARIO_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing scenario:', error);
  }
};
