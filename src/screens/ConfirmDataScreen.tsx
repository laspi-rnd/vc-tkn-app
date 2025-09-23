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
    const firstFiveDigits = mockInvitedUserData.cpf.replace(/\D/g, '').slice(0, 5);
    if (cpfConfirmation === firstFiveDigits) {
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
          <DetailRow label="Data de Nascimento" value={mockInvitedUserData.dateOfBirth} />
        </View>

        <View style={styles.challengeContainer}>
          {/* CORREÇÃO: Desafio alterado para os 5 primeiros dígitos */}
          <Text style={styles.challengeLabel}>Para sua segurança, digite os 5 primeiros dígitos do seu CPF:</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={5}
            value={cpfConfirmation}
            onChangeText={setCpfConfirmation}
            placeholder="12345"
          />
        </View>

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
    width: 120, // Aumentado para 5 dígitos
    borderColor: '#ccc',
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