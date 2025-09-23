// src/screens/OnboardingErrorScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Svg, Path } from 'react-native-svg';
import CustomButton from '../components/CustomButton';
import { colors, spacing, typography } from '../theme/theme';

// Tipagem para a navegação
type RootStackParamList = {
  Login: undefined;
  OnboardingError: undefined;
};

type ErrorScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OnboardingError'
>;

interface Props {
  navigation: ErrorScreenNavigationProp;
}

// Componente para o ícone de erro
const ErrorIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
      stroke={colors.primary} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const OnboardingErrorScreen: React.FC<Props> = ({ navigation }) => {
  const handleContact = () => {
    console.log("Mock: Redirecionando para contato...");
  };

  const handleRetry = () => {
    // Substitui a tela de erro pela de Login, para o usuário não poder "voltar" para o erro
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ErrorIcon />
        <Text style={styles.title}>Conta não encontrada</Text>
        <Text style={styles.description}>
          Você precisa completar seu onboarding em uma Instituição Financeira antes de usar o app.
        </Text>

        <View style={styles.buttonContainer}>
          <CustomButton title="Entrar em Contato" onPress={handleContact} />
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xlarge,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing.large,
    marginBottom: spacing.medium,
  },
  description: {
    ...typography.body,
    color: colors.welcomeText,
    textAlign: 'center',
    marginBottom: spacing.xlarge,
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: spacing.xlarge,
    left: spacing.xlarge,
    right: spacing.xlarge
  },
  retryButton: {
    marginTop: spacing.medium,
    alignItems: 'center',
    padding: spacing.small,
  },
  retryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingErrorScreen;