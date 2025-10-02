// src/screens/ConfirmDataScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import CustomButton from '../components/CustomButton';
import { colors, spacing, typography } from '../theme/theme';
import { User } from '../contexts/UserContext';

type ConfirmDataScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConfirmData'>;
interface Props { navigation: ConfirmDataScreenNavigationProp; }

// Mock dos dados que viriam do link de convite da IF
const mockInvitedUserData: User = {
  name: "Leandro Assis",
  hashAA: '',
  cpf: "123.456.789-00",
  email: "leandro.assis@email.com",
  dateOfBirth: "15/08/1990"
};

const ConfirmDataScreen: React.FC<Props> = ({ navigation }) => {
  const [cpfConfirmation, setCpfConfirmation] = useState('');
  
  const handleConfirm = () => {
    // CORREÇÃO: Valida contra os 5 primeiros dígitos do CPF
    const enteredCpf = cpfConfirmation.replace(/\D/g, '').slice(0, 11);
    const mockCpf = mockInvitedUserData.cpf.replace(/\D/g, '').slice(0, 11);
    if (enteredCpf === mockCpf) {
      navigation.navigate('CreatePassword', { userData: mockInvitedUserData });
    } else {
      Alert.alert("Confirmação Falhou", "Os dígitos do CPF não conferem. Por favor, tente novamente.");
    }
  };

  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Confirme seus Dados</Text>
        <Text style={styles.subtitle}>
          Verifique se os dados fornecidos pela instituição estão corretos antes de continuar.
        </Text>

        <View style={styles.detailsContainer}>
          {/* CORREÇÃO: Dados agora em texto claro, sem mascaramento */}
          <DetailRow label="Nome Completo" value={mockInvitedUserData.name} />
          <DetailRow label="E-mail" value={mockInvitedUserData.email} />
        </View>

        <View style={styles.challengeContainer}>
          {/* CORREÇÃO: Desafio alterado para os 5 primeiros dígitos */}
          <Text style={styles.challengeLabel}>Para continuar, insira seu CPF:</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={14}
            value={cpfConfirmation}
            onChangeText={text => {
              // Remove tudo que não for número
              let cleaned = text.replace(/\D/g, '');
              // Limita a 11 dígitos
              cleaned = cleaned.slice(0, 11);
              // Aplica a máscara xxx.xxx.xxx-xx
              let formatted = cleaned;
              if (cleaned.length > 3) {
          formatted = cleaned.slice(0, 3) + '.' + cleaned.slice(3);
              }
              if (cleaned.length > 6) {
          formatted = formatted.slice(0, 7) + '.' + formatted.slice(7);
              }
              if (cleaned.length > 9) {
          formatted = formatted.slice(0, 11) + '-' + formatted.slice(11);
              }
              setCpfConfirmation(formatted);
            }}
            placeholder="xxx.xxx.xxx-xx"
            textAlign="center"
            selection={{
              start: cpfConfirmation.length,
              end: cpfConfirmation.length,
            }}
          />
        </View>

        <Text style={[styles.subtitle, { marginBottom: 10, opacity: 0.8 }]}>
          Ao confirmar, você concorda com a criação de uma Credencial Verificável, conforme Termos de Uso e Política de Privacidade.
        </Text>
        <CustomButton title="Confirmar e Continuar" onPress={handleConfirm} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: spacing.large },
  title: { ...typography.title, textAlign: 'center', marginBottom: spacing.small },
  subtitle: { ...typography.body, textAlign: 'center', color: colors.welcomeText, marginBottom: spacing.xlarge },
  detailsContainer: { backgroundColor: colors.white, borderRadius: 8, paddingHorizontal: spacing.medium, marginBottom: spacing.xlarge },
  // CORREÇÃO: Estilo ajustado para parecer menos com um campo de input
  detailRow: { 
    marginVertical: spacing.small, 
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  detailLabel: { fontSize: 14, color: colors.welcomeText },
  detailValue: { fontSize: 18, color: colors.text, fontWeight: '500', marginTop: 4 },
  challengeContainer: { marginBottom: spacing.xlarge, alignItems: 'center' },
  challengeLabel: { ...typography.body, textAlign: 'center', color: colors.text, marginBottom: spacing.medium },
  input: {
    height: 50,
    width: 225, // Aumentado para 5 dígitos
    borderColor: 'rgba(204,204,204,0.5)', // cinza meio transparente
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: colors.white,
    letterSpacing: 3, // Espaçamento para melhor visualização
  },
});

export default ConfirmDataScreen;