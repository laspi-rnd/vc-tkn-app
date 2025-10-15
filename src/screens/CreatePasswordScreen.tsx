// src/screens/CreatePasswordScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import CustomButton from '../components/CustomButton';
import AppLogo from '../components/AppLogo';
import { colors, spacing, typography } from '../theme/theme';
import { registerUserWithIF } from '../services/authService';
import { save } from '../services/secureStorage';

type CreatePasswordScreenRouteProp = RouteProp<RootStackParamList, 'CreatePassword'>;
type CreatePasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePassword'>;
interface Props { route: CreatePasswordScreenRouteProp; navigation: CreatePasswordScreenNavigationProp; }

const CreatePasswordScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userData, callbackUrl } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    // Validações de senha
    if (!password || !confirmPassword) {
      Alert.alert("Campos Vazios", "Por favor, preencha ambos os campos de senha.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Senhas Diferentes", "As senhas digitadas não conferem.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Senha Curta", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      // ETAPA 1: Simula o envio dos dados do novo usuário para a IF (que criará a conta no Keycloak).
      const registration = await registerUserWithIF(userData, password, callbackUrl);
      
      if (registration.success) {
        // ETAPA 2: Mostra mensagem de sucesso e redireciona para a tela de Login.

        await save('hashAAIF', registration.hashAA_If || '');

        Alert.alert(
          "Conta Criada com Sucesso!",
          "Sua conta foi criada. Agora, por favor, faça o login para acessar o aplicativo.",
          [
            { 
              text: "Ir para o Login", 
              // Navega para a tela de Login e limpa a pilha de cadastro para que o usuário não possa "voltar".
              onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              }) 
            }
          ]
        );
      } else {
        throw new Error("Não foi possível processar seu cadastro com a instituição.");
      }
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
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirme sua senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
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
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: colors.white,
    marginBottom: spacing.medium,
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.large,
  },
});

export default CreatePasswordScreen;
