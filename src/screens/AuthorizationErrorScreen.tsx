// src/screens/AuthorizationErrorScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import { colors, spacing, typography } from '../theme/theme';
import { Svg, Path } from 'react-native-svg';

type RootStackParamList = {
  Home: undefined;
  TokenSelection: undefined;
};

type ErrorScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TokenSelection'>;

interface Props {
  navigation: ErrorScreenNavigationProp;
}

const ErrorIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
      stroke="#D32F2F" // Cor vermelha para erro
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const AuthorizationErrorScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ErrorIcon />
        <Text style={styles.title}>Falha na Autorização</Text>
        <Text style={styles.description}>
          Não foi possível processar sua autorização. Por favor, verifique sua conexão e tente novamente.
        </Text>
        
        <View style={styles.buttonContainer}>
          <CustomButton title="Tentar Novamente" onPress={() => navigation.goBack()} />
          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.homeButtonText}>Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xlarge },
  title: { ...typography.title, color: colors.text, marginTop: spacing.large, marginBottom: spacing.medium },
  description: { ...typography.body, color: colors.welcomeText, textAlign: 'center', marginBottom: spacing.xlarge },
  buttonContainer: { width: '100%', position: 'absolute', bottom: spacing.xlarge, left: spacing.xlarge, right: spacing.xlarge },
  homeButton: { marginTop: spacing.medium, alignItems: 'center', padding: spacing.small },
  homeButtonText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
});

export default AuthorizationErrorScreen;