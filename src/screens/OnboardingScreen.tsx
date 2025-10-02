// src/screens/OnboardingScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import AppLogo from '../components/AppLogo';
import { colors, spacing, typography } from '../theme/theme';
import { RootStackParamList } from '../../App';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
interface Props { navigation: OnboardingScreenNavigationProp; }

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const handleCreateAccount = () => {
    // NAVEGA PARA A NOVA TELA DE CONFIRMAÇÃO DE DADOS
    navigation.navigate('ConfirmData');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <AppLogo />
          <Text style={styles.title}>VC-TK-APP</Text>
        </View>
        <View style={styles.welcomeMessageContainer}>
          <Text style={styles.welcomeText}>
            Seja bem-vindo(a) à sua identidade digital, segura e descentralizada.
          </Text>
        </View>
        <View style={styles.footer}>
          <CustomButton title="Criar Minha Conta" onPress={handleCreateAccount} />
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Já tem uma conta? Entre!</Text>
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