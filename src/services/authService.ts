// src/services/authService.ts

import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import { User } from '../contexts/UserContext';
import api from './api';

// --- Variáveis de Autenticação Hardcoded ---
const KEYCLOAK_BASE_URL = 'http://192.168.1.16:8080/realms/oauth2-demo/protocol/openid-connect';
export const KEYCLOAK_CLIENT_ID = 'oauth2-demo-client';
// A constante KEYCLOAK_CLIENT_SECRET foi removida.

WebBrowser.maybeCompleteAuthSession();

export const discovery = {
  authorizationEndpoint: `${KEYCLOAK_BASE_URL}/auth`,
  tokenEndpoint: `${KEYCLOAK_BASE_URL}/token`,
};

export const redirectUri = makeRedirectUri({
  scheme: 'vctkapp',
});

console.log('>>>>>> URI DE REDIRECIONAMENTO SENDO USADA:', redirectUri);

export function useKeycloakAuth() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: KEYCLOAK_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      usePKCE: true,
    },
    discovery
  );

  return { request, response, promptAsync };
}

// --- Funções de API e Mocks ---

export const registerUserWithIF = async (userData: Omit<User, 'hashAA'>, password: string): Promise<{ success: boolean }> => {
  console.log(`Simulando envio de dados de registo para a IF...`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("IF confirmou o recebimento dos dados de registo (simulado).");
  return { success: true };
};

export const getMyAccount = async (hashIf: string): Promise<{ network_name: string; hashAA: string }> => {
  try {
    const response = await api.post('/client/get-my-account', { hashIf });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Não foi possível buscar a sua conta.");
    }
    throw new Error("Erro de comunicação ao buscar a sua conta.");
  }
};

export const fetchUserDataFromIF = async (callbackUrl: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      name: "Joaquim Ferreira",
      email: "joaquim.ferreira@email.com",
      dateOfBirth: "15/08/1990",
    };
};

export const validateHashWithIF = async (callbackUrl: string, hash: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true };
};