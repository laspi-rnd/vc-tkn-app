// src/services/authService.ts

import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import { User } from '../contexts/UserContext';
import api from './api';

// --- Variáveis de Autenticação ---
const KEYCLOAK_BASE_URL = 'http://192.168.1.16:8080/realms/oauth2-demo/protocol/openid-connect';
export const KEYCLOAK_CLIENT_ID = 'oauth2-demo-client';
WebBrowser.maybeCompleteAuthSession();
export const discovery = { authorizationEndpoint: `${KEYCLOAK_BASE_URL}/auth`, tokenEndpoint: `${KEYCLOAK_BASE_URL}/token` };
export const redirectUri = makeRedirectUri({ scheme: 'vctkapp' });

console.log('>>>>>> URI DE REDIRECIONAMENTO SENDO USADA:', redirectUri);

// Hook de autenticação do Keycloak (sem alterações)
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
 * Simula o envio dos dados do novo usuário para a IF, que seria responsável por criar o usuário no Keycloak.
 */
export const registerUserWithIF = async (userData: Omit<User, 'hashAA'>, password: string): Promise<{ success: boolean }> => {
  console.log(`Simulando envio de dados de registro para a IF...`);
  const payload = {
    cpf: userData.cpf,
    name: userData.name,
    email: userData.email,
    dateOfBirth: userData.dateOfBirth,
    password,
  };
  console.log("Payload enviado para a IF (simulado):", payload);
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("IF confirmou o recebimento dos dados de registro (simulado).");
  return { success: true };
};

/**
 * Busca o hashAA da IF no nosso backend.
 * @param cpf O CPF do usuário.
 * @param dateOfBirth A data de nascimento do usuário.
 */
export const verifyIfRequest = async (cpf: string, dateOfBirth: string): Promise<{ hashAA_If: string }> => {
  try {
    console.log("Enviando requisição para /client/verify-if-request...");
    const response = await api.post('/client/verify-if-request', {
      cpfCnpjDoc: cpf.replace(/\D/g, ''), // Envia o CPF sem formatação
      dataNascimentoFundacao: dateOfBirth,
    });
    console.log("Resposta de verify-if-request:", response.data);
    return response.data[0];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Não foi possível verificar a solicitação da IF.");
    }
    throw new Error("Erro de comunicação ao verificar a solicitação da IF.");
  }
};

/**
 * Autoriza a criação da VC para a IF no nosso backend.
 * @param hashAA_If O hash da IF que será autorizado.
 */
export const authorizeIf = async (hashAA_If: string): Promise<{ success: boolean }> => {
  try {
    console.log("Enviando requisição para /client/authorize-if...");
    const payload = {
      hashAA_If: hashAA_If,
      autorizados: [],
      autorizadosEmissao: [],
	    autorizadoCriacaoVc: true
    };
    const response = await api.post('/client/authorize-if', payload);
    console.log("Resposta de authorize-if:", response.data);
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Não foi possível autorizar a IF.");
    }
    throw new Error("Erro de comunicação ao autorizar a IF.");
  }
};

// Função para obter a conta do usuário (sem alterações)
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