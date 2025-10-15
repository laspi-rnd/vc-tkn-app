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
import { useKeycloakAuth, getMyAccount, discovery, KEYCLOAK_CLIENT_ID, redirectUri } from '../services/authService';
import { save, getValueFor } from '../services/secureStorage';
import { exchangeCodeAsync, AuthSessionResult } from 'expo-auth-session';
import { jwtDecode } from 'jwt-decode';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
interface Props { navigation: LoginScreenNavigationProp; }

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const { request, response, promptAsync } = useKeycloakAuth();
  console.log("Objeto de requisição de autenticação:", request);
  console.log("Resposta de autenticação recebida:", response);

  useEffect(() => {
    const processAuthResponse = async (res: AuthSessionResult) => {
      if (res.type === 'success') {
        const { code } = res.params;
        setIsLoading(true);
        try {
          // A CORREÇÃO CRÍTICA ESTÁ AQUI:
          // O 'codeVerifier' deve ser passado dentro de 'extraParams'
          // com o nome 'code_verifier' (com underscore).
          if (!request?.codeVerifier) {
            throw new Error("O verificador PKCE não foi encontrado na requisição inicial.");
          }

          const tokenResult = await exchangeCodeAsync(
            {
              clientId: KEYCLOAK_CLIENT_ID,
              code,
              redirectUri,
              extraParams: {
                code_verifier: request.codeVerifier,
              },
            },
            discovery
          );

          const { accessToken, refreshToken } = tokenResult;
          await save('accessToken', accessToken);
          await save('refreshToken', refreshToken);

          const decodedToken: any = jwtDecode(accessToken);
          const hashIf = await getValueFor('hashIf');
          if (!hashIf) throw new Error("Identificador da instituição não encontrado.");
          
          const accountData = await getMyAccount(hashIf);

          const finalUserData = {
            name: decodedToken.name || `${decodedToken.given_name || ''} ${decodedToken.family_name || ''}`.trim(),
            email: decodedToken.email || "",
            cpf: decodedToken.preferred_username || "",
            dateOfBirth: "15/08/1990", // Mock
            hashAA: accountData.hashAA,
          };
          
          login(finalUserData);
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'App' }] }));

        } catch (error: any) {
          console.error("LOG DETALHADO DO ERRO:", error);
          Alert.alert("Erro de Autenticação", error.message || "Não foi possível completar o login.");
        } finally {
          setIsLoading(false);
        }
      } else if (res.type === 'error' || res.type === 'cancel') {
        setIsLoading(false);
        if (res.type === 'error') {
          console.error('Erro de autenticação:', res.error);
        }
      }
    };
    
    if (response) {
      processAuthResponse(response);
    }
  }, [response, request]);

  const handleLogin = async () => {
    setIsLoading(true);
    await promptAsync();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AppLogo />
        <Text style={styles.title}>Aceda à sua Conta</Text>
        <Text style={styles.subtitle}>
          Será redirecionado para um ambiente seguro para fazer o seu login.
        </Text>
        
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <CustomButton 
              title="Fazer Login com Conta Única" 
              onPress={handleLogin} 
              disabled={!request}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.large, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.title, textAlign: 'center', marginVertical: spacing.large },
  subtitle: { ...typography.body, textAlign: 'center', color: colors.welcomeText, marginBottom: spacing.xlarge, paddingHorizontal: spacing.medium },
  buttonContainer: { width: '100%', marginTop: spacing.medium },
});

export default LoginScreen;