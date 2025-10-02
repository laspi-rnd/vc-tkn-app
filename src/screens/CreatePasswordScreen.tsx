// src/screens/CreatePasswordScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import CustomButton from '../components/CustomButton';
import AppLogo from '../components/AppLogo'; // Import do Logo
import { colors, spacing, typography } from '../theme/theme';
import { useUser, User } from '../contexts/UserContext';
import { CommonActions } from '@react-navigation/native';
import { loadMockData, getMockNotifications } from '../data/mockData';

type CreatePasswordScreenRouteProp = RouteProp<RootStackParamList, 'CreatePassword'>;
type CreatePasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePassword'>;
interface Props { route: CreatePasswordScreenRouteProp; navigation: CreatePasswordScreenNavigationProp; }

// NOVO: Componente para a arte de fundo
const BackgroundArt = () => (
  <View style={styles.backgroundArt}>
    <Feather name="key" size={250} color="rgba(0, 0, 0, 0.05)" />
  </View>
);

const CreatePasswordScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userData } = route.params;
  const { login, setInitialNotifications } = useUser();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Auto-fill password for demo mode
    setPassword('12345678');
    setConfirmPassword('12345678');
  }, []);

  const handleCreateAccount = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Campos Vazios", "Por favor, preencha ambos os campos de senha.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Senhas Diferentes", "As senhas digitadas não conferem.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Senha Curta", "A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3500));

    // Load mock data from scenario
    await loadMockData();
    const notifications = getMockNotifications();

    const finalUserData: User = { ...userData, hashAA: userData.hashAA || '0x_newly_created_hash_123' };

    login(finalUserData);
    setInitialNotifications(notifications);
    setIsLoading(false);

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'App' }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BackgroundArt />
        <AppLogo />
        <Text style={styles.title}>Crie sua Senha de Acesso</Text>
        <Text style={styles.subtitle}>
          Esta senha será usada para acessar sua conta com segurança.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha (mín. 8 caracteres)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirme sua senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <CustomButton title="Finalizar Cadastro" onPress={handleCreateAccount} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.large, justifyContent: 'center', alignItems: 'center' },
  backgroundArt: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  title: { ...typography.title, textAlign: 'center', marginTop: spacing.large, marginBottom: spacing.small },
  subtitle: { ...typography.body, textAlign: 'center', color: colors.welcomeText, marginBottom: spacing.xlarge },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: colors.white,
    marginBottom: spacing.medium,
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.large,
  },
});

export default CreatePasswordScreen;