// src/screens/ConfirmDataScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import CustomButton from '../components/CustomButton';
import { colors, spacing, typography } from '../theme/theme';
import { fetchUserDataFromIF, validateHashWithIF } from '../services/authService';
import * as Crypto from 'expo-crypto';

type ConfirmDataScreenRouteProp = RouteProp<RootStackParamList, 'ConfirmData'>;
type ConfirmDataScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConfirmData'>;
interface Props { route: ConfirmDataScreenRouteProp; navigation: ConfirmDataScreenNavigationProp; }

// Função para gerar o hash SHA-256 no formato hexadecimal com prefixo '0x'
const generateSHA256 = async (input: string): Promise<string> => {
  const digest = await Crypto.digestStringAsync('SHA-256', input);
  return `0x${digest}`;
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const ConfirmDataScreen: React.FC<Props> = ({ route, navigation }) => {
  const { callbackUrl } = route.params;
  const [userData, setUserData] = useState<{ name: string; email: string; dateOfBirth: string; } | null>(null);
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ETAPA 1: Busca os dados do usuário na IF usando o callbackUrl
        // A IF deve retornar os dados do usuário (nome, email, data de nascimento)
        // Simulamos a chamada com um mock
        const data = await fetchUserDataFromIF(callbackUrl); // root
        setUserData(data);
      } catch (error: any) {
        Alert.alert("Erro", "Não foi possível buscar seus dados na instituição. Tente novamente mais tarde.", [{ text: "OK", onPress: () => navigation.goBack() }]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [callbackUrl]);

  const handleCpfChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 3) formatted = cleaned.slice(0, 3) + '.' + cleaned.slice(3);
    if (cleaned.length > 6) formatted = formatted.slice(0, 7) + '.' + formatted.slice(7);
    if (cleaned.length > 9) formatted = formatted.slice(0, 11) + '-' + formatted.slice(11);
    setCpf(formatted.slice(0, 14));
  };

  const handleConfirm = async () => {
    if (!userData || cpf.replace(/\D/g, '').length !== 11) {
      Alert.alert("CPF Inválido", "Por favor, insira um CPF válido.");
      return;
    }
    setIsVerifying(true);
    try {
      // Geramos o hash a partir do CPF e data de nascimento
      // para validar com a IF
      // O formato do string deve ser "cpf:dateOfBirth"
      // Exemplo: "12345678900:1990-01-01"
      const stringToHash = `${cpf.replace(/\D/g, '')}:${userData.dateOfBirth}`;
      const hash = await generateSHA256(stringToHash);

      // Confirmamos o hash com a IF
      const validation = await validateHashWithIF(callbackUrl, hash); // callbackUrl/validate

      if (validation.success) {
        navigation.navigate('CreatePassword', {
          userData: { callbackUrl }
        });
      } else {
        throw new Error("A validação com a instituição falhou.");
      }
    } catch (error: any) {
      Alert.alert("Erro de Validação", error.message || "Não foi possível validar seus dados.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator style={{ flex: 1 }} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Confirme seus Dados</Text>
        <Text style={styles.subtitle}>
          Os dados abaixo foram fornecidos pela instituição. Por favor, confirme-os e insira seu CPF.
        </Text>
        <View style={styles.detailsContainer}>
          <DetailRow label="Nome Completo" value={userData?.name || ''} />
          <DetailRow label="E-mail" value={userData?.email || ''} />
          <DetailRow label="Data de Nascimento" value={userData?.dateOfBirth || ''} />
        </View>
        <View style={styles.challengeContainer}>
          <Text style={styles.challengeLabel}>Para continuar, por favor, insira seu CPF:</Text>
          <TextInput style={styles.input} onChangeText={handleCpfChange} value={cpf} placeholder="000.000.000-00" keyboardType="number-pad" maxLength={14} />
        </View>
        {isVerifying ? <ActivityIndicator size="large" /> : <CustomButton title="Confirmar e Continuar" onPress={handleConfirm} />}
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
