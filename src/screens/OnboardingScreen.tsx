// src/screens/OnboardingScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { jwtDecode } from 'jwt-decode';
import { Buffer } from 'buffer'; // Necessário para a decodificação base64 do JWT
global.Buffer = Buffer; // Polyfill global

import CustomButton from '../components/CustomButton';
import AppLogo from '../components/AppLogo';
import { colors, spacing, typography } from '../theme/theme';
import { RootStackParamList } from '../../App';
import { User } from '../contexts/UserContext';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
interface Props { navigation: OnboardingScreenNavigationProp; }

// Mock de uma função que criaria um JWT (apenas para simulação do botão)
const createMockJwt = (data: any) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify(data)).toString('base64');
  return `${header}.${payload}.mock_signature`;
};

// Dados para a simulação do deep link
const mockLinkData = {
  name: "Maria Oliveira",
  cpf: "98765432100", // CPF sem formatação
  dateOfBirth: "1990-07-22"
};

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  
  const initialUrl = Linking.useURL();

  useEffect(() => {
    if (initialUrl) {
      console.log("Deep link inicial recebido:", initialUrl);
      const { queryParams } = Linking.parse(initialUrl);
      
      if (queryParams?.token) {
        try {
          // Decodifica o JWT recebido no link
          const decodedToken: Omit<User, 'hashAA' | 'email'> = jwtDecode(queryParams.token as string);
          console.log("Dados decodificados do token:", decodedToken);
          
          // Navega para a tela de confirmação com os dados do token
          navigation.navigate('ConfirmData', {
            userData: decodedToken
          });
        } catch (error) {
          Alert.alert("Link Inválido", "O link de convite é inválido ou expirou.");
        }
      }
    }
  }, [initialUrl]);

  const handleCreateAccount = () => {
    // Simula um deep link com um JWT mockado
    const mockJwt = createMockJwt(mockLinkData);
    const mockUrl = `vctkapp://invite?token=${mockJwt}`;
    console.log("Simulando clique em deep link:", mockUrl);
    
    // Simula o processo de decodificação e navegação
    try {
      const decodedToken: Omit<User, 'hashAA' | 'email'> = jwtDecode(mockJwt);
      navigation.navigate('ConfirmData', {
        userData: decodedToken
      });
    } catch (error) {
      console.error("Erro ao simular deep link:", error);
      Alert.alert("Erro", "Não foi possível processar a simulação do link.");
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppLogo />
          <Text style={styles.title}>VC-TKN-APP</Text>
        </View>
        <View style={styles.welcomeMessageContainer}>
          <Text style={styles.welcomeText}>
            Sua identidade digital, segura e descentralizada.
          </Text>
        </View>
        <View style={styles.footer}>
          <CustomButton title="Criar Minha Conta" onPress={handleCreateAccount} />
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Já tenho uma conta? Entre!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: spacing.large },
  header: { alignItems: 'center', marginTop: spacing.xlarge },
  title: { ...typography.title, color: colors.text, marginTop: spacing.large },
  welcomeMessageContainer: { paddingHorizontal: spacing.medium },
  welcomeText: { ...typography.welcome, color: colors.welcomeText, marginBottom: spacing.medium },
  footer: { width: '100%', paddingBottom: spacing.large },
  loginButton: { marginTop: spacing.medium, alignItems: 'center' },
  loginButtonText: { color: colors.primary, fontSize: 16 },
});

export default OnboardingScreen;