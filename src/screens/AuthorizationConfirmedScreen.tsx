// src/screens/AuthorizationConfirmedScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import { colors, spacing, typography } from '../theme/theme';
import { Svg, Path } from 'react-native-svg';

// 1. ATUALIZADO: A tipagem agora inclui a rota 'Home' para que possamos navegar até ela.
type RootStackParamList = {
  Home: undefined; // Adicionada para permitir a navegação
  AuthorizationConfirmed: { authorizedTokens: string[] };
};

type ConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'AuthorizationConfirmed'>;
type ConfirmationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AuthorizationConfirmed'>;

interface Props {
  route: ConfirmationScreenRouteProp;
  navigation: ConfirmationScreenNavigationProp;
}

const SuccessIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
    <Path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 4L12 14.01l-3-3" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const AuthorizationConfirmedScreen: React.FC<Props> = ({ route, navigation }) => {
  const { authorizedTokens } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <SuccessIcon />
        <Text style={styles.title}>Autorização Enviada!</Text>
        <Text style={styles.description}>
          {authorizedTokens.length > 0
            ? "Você autorizou a emissão dos seguintes tokens:"
            : "Nenhum token foi autorizado."}
        </Text>
        
        {authorizedTokens.length > 0 && (
          <View style={styles.summaryBox}>
            {authorizedTokens.map(tokenName => (
              <Text key={tokenName} style={styles.summaryItem}>• {tokenName}</Text>
            ))}
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          {/* 2. CORREÇÃO PRINCIPAL: Alterado de popToTop() para navigate('Home') */}
          <CustomButton title="Voltar ao Início" onPress={() => navigation.navigate('Home')} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xlarge },
  title: { ...typography.title, color: colors.text, marginTop: spacing.large, marginBottom: spacing.medium },
  description: { ...typography.body, color: colors.welcomeText, textAlign: 'center', marginBottom: spacing.large },
  summaryBox: { backgroundColor: colors.white, borderRadius: 8, padding: spacing.medium, width: '100%', marginBottom: spacing.xlarge },
  summaryItem: { fontSize: 16, color: colors.text, marginBottom: spacing.small },
  buttonContainer: { width: '100%', position: 'absolute', bottom: spacing.xlarge, left: spacing.xlarge, right: spacing.xlarge }
});

export default AuthorizationConfirmedScreen;