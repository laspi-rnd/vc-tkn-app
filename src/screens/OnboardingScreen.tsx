// src/screens/OnboardingScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { jwtDecode } from 'jwt-decode';
import { Buffer } from 'buffer'; // Necessário para a decodificação base64 do JWT
global.Buffer = Buffer; // Polyfill global
import { getValueFor } from '../services/secureStorage';

import CustomButton from '../components/CustomButton';
import AppLogo from '../components/AppLogo';
import { colors, spacing, typography } from '../theme/theme';
import { RootStackParamList } from '../../App';
import { User } from '../contexts/UserContext';
import { CommonActions } from '@react-navigation/native';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
interface Props { navigation: OnboardingScreenNavigationProp; }

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  
  const initialUrl = Linking.useURL();
  const [decodedToken, setDecodedToken] = React.useState<Omit<User, 'hashAA' | 'email'> | null>(null);

  useEffect(() => {
    if (initialUrl) {
      console.log("Deep link inicial recebido:", initialUrl);
      const { queryParams } = Linking.parse(initialUrl);

      console.log("Parâmetros da query extraídos:", queryParams);
      
      if (queryParams?.token) {
        try {
          // Decodifica o JWT recebido no parâmetro 'token'
          const tokenData: Omit<User, 'hashAA' | 'email'> = jwtDecode(queryParams.token as string);
          setDecodedToken(tokenData);
          console.log("Dados decodificados do token:", tokenData);
        } catch (error) {
          console.error("Erro ao decodificar o token:", error);
          Alert.alert("Link Inválido", "O link de convite é inválido ou expirou.");
        }
      }
    }
  }, [initialUrl]);

  const handleCreateAccount = async () => {

    const firstLoginCompleted = await getValueFor('firstLoginCompleted');
    if (firstLoginCompleted === 'true') {
      navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: 'App' }],
      }));
      return;
    }

    if (!decodedToken) {
      Alert.alert("Link Inválido", "O link de convite é inválido ou expirou.");
      return;
    }
    // Navega para a tela de confirmação com os dados do token
    navigation.navigate('ConfirmData', {
      userData: decodedToken
    });
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