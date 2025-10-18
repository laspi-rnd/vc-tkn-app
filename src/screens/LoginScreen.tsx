// src/screens/LoginScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import CustomButton from '../components/CustomButton';
import AppLogo from '../components/AppLogo';
import { colors, spacing, typography } from '../theme/theme';
import { useUser } from '../contexts/UserContext';
import { CommonActions } from '@react-navigation/native';
import { useKeycloakAuth, getMyAccount, submitAuthorization, discovery, KEYCLOAK_CLIENT_ID, redirectUri } from '../services/authService';
import { save, getValueFor, deleteValueFor } from '../services/secureStorage';
import { exchangeCodeAsync, AuthSessionResult } from 'expo-auth-session';
import { jwtDecode } from 'jwt-decode';


type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
interface Props { navigation: LoginScreenNavigationProp; }

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('A autenticar...');

  const { request, response, promptAsync } = useKeycloakAuth();

  useEffect(() => {
    const processAuthResponse = async (res: AuthSessionResult) => {
      if (res.type === 'success') {
        const { code } = res.params;
        setIsLoading(true);
        try {
          if (!request?.codeVerifier) throw new Error("Verificador PKCE não encontrado.");
          console.log('redirectUri gerada:', redirectUri);
          
          setLoadingMessage('A verificar sessão...');
          const tokenResult = await exchangeCodeAsync({
            clientId: KEYCLOAK_CLIENT_ID, code, redirectUri,
            extraParams: { code_verifier: request.codeVerifier },
          }, discovery);

          await save('accessToken', tokenResult.accessToken);
          await save('refreshToken', tokenResult.refreshToken);
          const decodedToken: any = jwtDecode(tokenResult.accessToken);

          // Salva os dados parciais do usuário no contexto para a próxima tela
          const partialUserData = {
            name: decodedToken.name || `${decodedToken.given_name || ''} ${decodedToken.family_name || ''}`.trim(),
            email: decodedToken.email || "",
            cpf: decodedToken.documento || "",
            dateOfBirth: decodedToken.dataNascimento || "",
            hashAA: '', // hashAA ainda não é conhecido
          };
          login(partialUserData);

          const pendingAuthHash = await getValueFor('pendingFirstLoginAuth');
          if (pendingAuthHash) {
            setLoadingMessage('A autorizar criação da carteira...');
            await submitAuthorization(pendingAuthHash);
            
            setLoadingMessage('A aguardar criação da carteira...');
            await new Promise(resolve => setTimeout(resolve, 3000)); // Simula 3s para criação da VC
            
            navigation.dispatch(CommonActions.reset({
              index: 0,
              routes: [{ name: 'FirstLoginScanner' }],
            }));
            return;
          }

          setLoadingMessage('A buscar a sua conta...');
          const hashIf = await getValueFor('hashIf');
          if (!hashIf) throw new Error("Identificador da instituição não encontrado. Por favor, complete o cadastro.");
          
          const accountData = await getMyAccount(hashIf);
          
          const finalUserData = { ...partialUserData, hashAA: accountData.hashAA };
          login(finalUserData);
          
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'App' }] }));

        } catch (error: any) {
          console.error("LOG DETALHADO DO ERRO:", error);
          Alert.alert("Erro de Autenticação", error.message || "Não foi possível completar o login.");
          setIsLoading(false);
        }
      } else if (res.type === 'error' || res.type === 'cancel') {
        setIsLoading(false);
        if (res.type === 'error') console.error('Erro de autenticação:', res.error);
      }
    };
    
    if (response) {
      processAuthResponse(response);
    }
  }, [response, request]);

  const handleLogin = async () => {
    setIsLoading(true);
    setLoadingMessage('A redirecionar...');
    await promptAsync();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>{loadingMessage}</Text>
          </View>
        ) : (
          <>
            <AppLogo />
            <Text style={styles.title}>Entre na sua Conta</Text>
            <Text style={styles.subtitle}>
              Será redirecionado para um ambiente seguro para fazer o seu login.
            </Text>
            <View style={styles.buttonContainer}>
              <CustomButton 
                title="Fazer Login com Conta Única" 
                onPress={handleLogin} 
                disabled={!request}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.large, justifyContent: 'center', alignItems: 'center' },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: spacing.medium, fontSize: 16, color: colors.welcomeText, fontWeight: '500' },
  title: { ...typography.title, textAlign: 'center', marginVertical: spacing.large },
  subtitle: { ...typography.body, textAlign: 'center', color: colors.welcomeText, marginBottom: spacing.xlarge, paddingHorizontal: spacing.medium },
  buttonContainer: { width: '100%', marginTop: spacing.medium },
});

export default LoginScreen;