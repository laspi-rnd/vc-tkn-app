// src/services/authService.ts

import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import { User, AuthorizationRequest, TokenType } from '../contexts/UserContext';
import api from './api';

// --- Variáveis de Autenticação ---
const KEYCLOAK_BASE_URL = 'http://192.168.1.16:8080/realms/oauth2-demo/protocol/openid-connect';
export const KEYCLOAK_CLIENT_ID = 'oauth2-demo-client';
WebBrowser.maybeCompleteAuthSession();
export const discovery = { authorizationEndpoint: `${KEYCLOAK_BASE_URL}/auth`, tokenEndpoint: `${KEYCLOAK_BASE_URL}/token` };
export const redirectUri = makeRedirectUri({ scheme: 'vctkapp' });

console.log('>>>>>> URI DE REDIRECIONAMENTO SENDO USADA:', redirectUri);

// Hook de autenticação do Keycloak
export function useKeycloakAuth() {
  const [request, response, promptAsync] = useAuthRequest({
    clientId: KEYCLOAK_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
    redirectUri,
    usePKCE: true,
  }, discovery);
  return { request, response, promptAsync };
}

// --- Funções de API ---

/**
 * Busca as solicitações de verificação pendentes para um utilizador autenticado.
 * Esta chamada é autenticada com o token do Keycloak.
 */
export const getVerificationRequests = async (): Promise<AuthorizationRequest[]> => {
  try {
    console.log("Buscando solicitações de verificação...");
    const response = await api.post('/client/verify-if-request', {}); // Alterado para POST sem body
    return response.data || [];
  } catch (error) {
    console.error("Erro ao buscar solicitações:", error);
    throw new Error("Não foi possível carregar as solicitações.");
  }
};

/**
 * Busca todos os tipos de token disponíveis.
 */
export const getTokenTypes = async (): Promise<TokenType[]> => {
  try {
    console.log("Buscando tipos de token...");
    const response = await api.get('/common/get-token-types');
    return response.data || [];
  } catch (error) {
    console.error("Erro ao buscar tipos de token:", error);
    throw new Error("Não foi possível carregar os tipos de token.");
  }
};

/**
 * Submete a autorização para uma solicitação específica.
 */
export const submitAuthorization = async (payload: any): Promise<{ success: boolean }> => {
    console.log("Enviando autorização para o backend:", payload);
    // Em um app real, esta seria a chamada para a API
    // await api.post('/clients/authorize-request', payload);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true };
};

// --- Funções Mantidas (fluxo de cadastro e login) ---

export const registerUserWithIF = async (userData: Omit<User, 'hashAA'>, password: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { success: true };
};

/**
 * Esta função agora serve apenas para o fluxo de cadastro, sem token.
 * Busca o hashAA da IF que quer criar a VC.
 */
export const verifyIfRequestForRegistration = async (cpf: string, dateOfBirth: string): Promise<{ hashAA_If: string }> => {
  try {
    const response = await axios.post('http://192.168.1.16:3333/client/verify-if-request', {
      cpfCnpjDoc: cpf.replace(/\D/g, ''),
      dataNascimentoFundacao: dateOfBirth,
    });
    return response.data[0];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) throw new Error(error.response.data.error);
    throw new Error("Erro de comunicação ao verificar a solicitação da IF.");
  }
};

export const getMyAccount = async (hashIf: string): Promise<{ network_name: string; hashAA: string }> => {
  try {
    const response = await api.post('/client/get-my-account', { hashIf });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) throw new Error(error.response.data.error);
    throw new Error("Erro de comunicação ao buscar a sua conta.");
  }
};