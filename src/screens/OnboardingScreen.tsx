// src/screens/OnboardingScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import CustomButton from '../components/CustomButton';
import AppLogo from '../components/AppLogo';
import { colors, spacing, typography } from '../theme/theme';
import { RootStackParamList } from '../../App';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
interface Props { navigation: OnboardingScreenNavigationProp; }

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  
  const initialUrl = Linking.useURL();

  useEffect(() => {
    if (initialUrl) {
      console.log("Deep link inicial recebido:", initialUrl);
      const { queryParams } = Linking.parse(initialUrl);
      if (queryParams?.hashIF && queryParams?.callbackUrl) {
        navigation.navigate('ConfirmData', {
          hashIF: queryParams.hashIF as string,
          callbackUrl: queryParams.callbackUrl as string,
        });
      }
    }
  }, [initialUrl]);

  const handleCreateAccount = () => {
    // Simula um deep link genérico se o app for aberto normalmente
    // o hashIf será usado para autorizar a criação da conta no backend
    // o callbackUrl é onde a IF redirecionará com os dados do usuário
    navigation.navigate('ConfirmData', {
      hashIF: '0x68aa95c5580f80b2137808c5afc1c2a068a024132ce7eef01e14fc5af931b5f8',
      callbackUrl: 'http://192.168.1.16:3333/if-callback',
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