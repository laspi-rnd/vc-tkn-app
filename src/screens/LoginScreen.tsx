// src/screens/LoginScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Alert, ActivityIndicator, TouchableOpacity, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import CustomButton from '../components/CustomButton';
import AppLogo from '../components/AppLogo';
import { colors, spacing, typography } from '../theme/theme';
import { useUser, User } from '../contexts/UserContext';
import { CommonActions } from '@react-navigation/native';
import { getCurrentScenario } from '../data/scenarioManager';
import { loadMockData, getMockNotifications } from '../data/mockData';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
interface Props { navigation: LoginScreenNavigationProp; }

// Fallback credentials if scenario not loaded
const fallbackCredentials = {
  cpf: "123.456.789-00",
  password: "12345678",
  userData: {
    name: "Joaquim Ferreira",
    hashAA: `0x${Math.random().toString(16).substring(2, 42)}`,
    cpf: "123.456.789-00",
    email: "leandro.assis@email.com",
    dateOfBirth: "15/08/1990"
  }
};

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, setInitialNotifications } = useUser();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [rememberCpf, setRememberCpf] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const loadSavedCpf = async () => {
      const savedCpf = await AsyncStorage.getItem('savedCpf');
      if (savedCpf) {
        setCpf(savedCpf);
        setRememberCpf(true);
      }
    };
    loadSavedCpf();

    // Auto-fill with scenario data for demo mode
    const loadScenarioData = async () => {
      const scenario = await getCurrentScenario();
      setCpf(scenario.user.cpf);
      setPassword('12345678');
      setRememberCpf(true);
    };
    loadScenarioData();
  }, []);

  useEffect(() => {
    if (lockedUntil) {
      const interval = setInterval(() => {
        const secondsLeft = Math.ceil((lockedUntil.getTime() - new Date().getTime()) / 1000);
        if (secondsLeft > 0) {
          setCountdown(secondsLeft);
        } else {
          setLockedUntil(null);
          setAttempts(0);
          setCountdown(0);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockedUntil]);
  
  const handleCpfChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 3) formatted = cleaned.slice(0, 3) + '.' + cleaned.slice(3);
    if (cleaned.length > 6) formatted = formatted.slice(0, 7) + '.' + formatted.slice(7);
    if (cleaned.length > 9) formatted = formatted.slice(0, 11) + '-' + formatted.slice(11);
    setCpf(formatted.slice(0, 14));
  };
  
  const handleLogin = async () => {
    if (lockedUntil) return;
    setIsLoading(true);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Load scenario data
    const scenario = await getCurrentScenario();
    const scenarioCpf = scenario.user.cpf;
    const defaultPassword = "12345678"; // All scenarios use this password for simplicity

    // Use scenario data if available, otherwise fallback
    const validCpf = scenarioCpf || fallbackCredentials.cpf;
    const validPassword = defaultPassword;

    if (cpf === validCpf && password === validPassword) {
      if (rememberCpf) {
        await AsyncStorage.setItem('savedCpf', cpf);
      } else {
        await AsyncStorage.removeItem('savedCpf');
      }

      // Load mock data from scenario
      await loadMockData();
      const notifications = getMockNotifications();

      // Create user data from scenario
      const userData: User = {
        name: scenario.user.nome,
        hashAA: scenario.user.aa_address,
        cpf: scenario.user.cpf,
        email: scenario.user.email,
        dateOfBirth: scenario.user.dataNascimento,
      };

      login(userData);
      setInitialNotifications(notifications);
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'App' }] }));
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setError(`Muitas tentativas. Tente novamente em ${LOCKOUT_DURATION} segundos.`);
        const newLockedUntil = new Date();
        newLockedUntil.setSeconds(newLockedUntil.getSeconds() + LOCKOUT_DURATION);
        setLockedUntil(newLockedUntil);
      } else {
        setError(`CPF ou senha inválidos. (${MAX_ATTEMPTS - newAttempts} tentativas restantes)`);
      }
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AppLogo />
        <Text style={styles.title}>Entrar na Conta</Text>
        
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={handleCpfChange}
          keyboardType="number-pad"
          maxLength={14}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <View style={styles.rememberContainer}>
          <Text>Lembrar CPF</Text>
          <Switch value={rememberCpf} onValueChange={setRememberCpf} />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {countdown > 0 ? <Text style={styles.countdownText}>Tente novamente em: {countdown}s</Text> : null}

        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <CustomButton title="Entrar" onPress={handleLogin} disabled={!!lockedUntil} />
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  // A CORREÇÃO ESTÁ AQUI: Adicionado 'alignItems: center'
  container: { 
    flex: 1, 
    padding: spacing.large, 
    justifyContent: 'center',
    alignItems: 'center', // Esta linha centraliza tudo horizontalmente
  },
  title: { ...typography.title, textAlign: 'center', marginVertical: spacing.large },
  // Adicionado width: '100%' para os inputs e containers se esticarem corretamente
  input: { 
    width: '100%',
    height: 50, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingHorizontal: 15, 
    fontSize: 16, 
    backgroundColor: colors.white, 
    marginBottom: spacing.medium 
  },
  rememberContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%', 
    marginBottom: spacing.medium 
  },
  errorText: { color: 'red', textAlign: 'center', marginBottom: spacing.small },
  countdownText: { color: colors.primary, textAlign: 'center', fontWeight: 'bold', marginBottom: spacing.small },
  buttonContainer: { width: '100%', marginTop: spacing.medium },
  backButtonText: { color: colors.primary, textAlign: 'center', marginTop: spacing.medium, fontSize: 16 },
});

export default LoginScreen;