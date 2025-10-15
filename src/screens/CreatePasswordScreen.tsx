// src/screens/CreatePasswordScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import CustomButton from '../components/CustomButton';
import AppLogo from '../components/AppLogo';
import { colors, spacing, typography } from '../theme/theme';
import { registerUserWithIF, verifyIfRequestForRegistration } from '../services/authService';
import { save } from '../services/secureStorage';

type CreatePasswordScreenRouteProp = RouteProp<RootStackParamList, 'CreatePassword'>;
type CreatePasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePassword'>;
interface Props { route: CreatePasswordScreenRouteProp; navigation: CreatePasswordScreenNavigationProp; }

const CreatePasswordScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userData } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    // Validações de senha
    if (!password || !confirmPassword || password !== confirmPassword || password.length < 6) {
      Alert.alert("Senha Inválida", "Verifique se as senhas são iguais e têm no mínimo 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      // ETAPA 1: Simula o registro na IF
      const registration = await registerUserWithIF(userData, password);
      if (!registration.success) throw new Error("Não foi possível processar seu cadastro com a instituição.");

      // ETAPA 2: Chama o backend para obter o hashAA da IF
      const { hashAA_If } = await verifyIfRequestForRegistration(userData.cpf, userData.dateOfBirth);
      console.log("hashAA_If recebido:", hashAA_If);
      if (!hashAA_If) throw new Error("Não foi possível obter o identificador da instituição.");

      // ETAPA 3: Salva o hashAA_If para ser usado no primeiro login
      await save('pendingFirstLoginAuth', hashAA_If);
      console.log('hashAA_If salvo com sucesso para o primeiro login:', hashAA_If);

      // ETAPA 4: Mostra mensagem de sucesso e redireciona para o Login
      Alert.alert(
        "Conta Criada com Sucesso!",
        "Sua conta foi preparada. Agora, por favor, faça o login para finalizar a configuração.",
        [{ text: "Ir para o Login", onPress: () => navigation.navigate('Login') }]
      );

    } catch (error: any) {
      Alert.alert("Erro no Cadastro", error.message || "Ocorreu um problema ao finalizar seu cadastro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AppLogo />
        <Text style={styles.title}>Crie sua Senha de Acesso</Text>
        <Text style={styles.subtitle}>
          Esta senha será usada para acessar sua conta com segurança.
        </Text>
        <TextInput style={styles.input} placeholder="Digite sua senha" secureTextEntry value={password} onChangeText={setPassword}/>
        <TextInput style={styles.input} placeholder="Confirme sua senha" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword}/>
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <CustomButton title="Finalizar Cadastro" onPress={handleCreateAccount} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.large, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.title, textAlign: 'center', marginTop: spacing.large, marginBottom: spacing.small },
  subtitle: { ...typography.body, textAlign: 'center', color: colors.welcomeText, marginBottom: spacing.xlarge },
  input: { width: '100%', height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, backgroundColor: colors.white, marginBottom: spacing.medium },
  buttonContainer: { width: '100%', marginTop: spacing.large },
});

export default CreatePasswordScreen;