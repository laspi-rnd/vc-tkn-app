// src/screens/ConfirmDataScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import CustomButton from '../components/CustomButton';
import { colors, spacing, typography } from '../theme/theme';

type ConfirmDataScreenRouteProp = RouteProp<RootStackParamList, 'ConfirmData'>;
type ConfirmDataScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConfirmData'>;
interface Props { route: ConfirmDataScreenRouteProp; navigation: ConfirmDataScreenNavigationProp; }

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const ConfirmDataScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userData } = route.params;
  const [cpfInput, setCpfInput] = useState('');

  const handleCpfChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 3) formatted = cleaned.slice(0, 3) + '.' + cleaned.slice(3);
    if (cleaned.length > 6) formatted = formatted.slice(0, 7) + '.' + formatted.slice(7);
    if (cleaned.length > 9) formatted = formatted.slice(0, 11) + '-' + formatted.slice(11);
    setCpfInput(formatted.slice(0, 14));
  };

  const handleConfirm = () => {
    // Compara o CPF digitado com o CPF vindo do deep link (sem formatação)
    if (cpfInput.replace(/\D/g, '') !== userData.cpf) {
      Alert.alert("CPF Inválido", "O CPF digitado não confere com o do seu convite.");
      return;
    }

    // Se a validação for bem-sucedida, navega para a criação de senha,
    // passando todos os dados do usuário, agora com o CPF formatado.
    navigation.navigate('CreatePassword', {
      // Adiciona um email mockado, já que ele não vem no link
      userData: { ...userData, cpf: cpfInput, email: 'mock@email.com' } 
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Confirme seus Dados</Text>
        <Text style={styles.subtitle}>
          Os dados abaixo foram extraídos do seu convite. Por favor, confirme-os e insira seu CPF.
        </Text>
        <View style={styles.detailsContainer}>
          <DetailRow label="Nome Completo" value={userData.name} />
          <DetailRow label="Data de Nascimento (yyyy-mm-dd)" value={userData.dateOfBirth} />
        </View>
        <View style={styles.challengeContainer}>
          <Text style={styles.challengeLabel}>Para validar sua identidade, insira seu CPF:</Text>
          <TextInput style={styles.input} onChangeText={handleCpfChange} value={cpfInput} placeholder="000.000.000-00" keyboardType="number-pad" maxLength={14} />
        </View>
        <CustomButton title="Confirmar e Continuar" onPress={handleConfirm} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: spacing.large, justifyContent: 'center' },
  title: { ...typography.title, textAlign: 'center', marginBottom: spacing.small },
  subtitle: { ...typography.body, textAlign: 'center', color: colors.welcomeText, marginBottom: spacing.xlarge },
  detailsContainer: { backgroundColor: colors.white, borderRadius: 8, paddingHorizontal: spacing.medium, marginBottom: spacing.xlarge },
  detailRow: { paddingVertical: spacing.medium, borderBottomWidth: 1, borderBottomColor: colors.background },
  detailLabel: { fontSize: 14, color: colors.welcomeText },
  detailValue: { fontSize: 18, color: colors.text, fontWeight: '500', marginTop: 4 },
  challengeContainer: { width: '100%', marginBottom: spacing.xlarge, alignItems: 'center' },
  challengeLabel: { ...typography.body, textAlign: 'center', color: colors.text, marginBottom: spacing.medium },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: colors.white,
  },
});

export default ConfirmDataScreen;