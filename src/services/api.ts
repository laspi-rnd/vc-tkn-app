// src/services/api.ts

import axios from 'axios';
import { getValueFor, save } from './secureStorage';
import { TokenResponse, TokenResponseConfig, RefreshTokenRequestConfig } from 'expo-auth-session';
import { KEYCLOAK_CLIENT_ID, discovery } from './authService';
import { jwtDecode } from 'jwt-decode';

// A URL do seu backend principal (não o Keycloak)
const API_URL = process.env.API_URL || 'http://20.186.62.145:3333';
const KEYCLOAK_ISSUER = process.env.KEYCLOAK_ISSUER || 'http://20.186.62.145:8080/realms/oauth2-demo/';

const api = axios.create({
  baseURL: API_URL,
});

// Este "interceptor" é uma função que roda ANTES de cada requisição ser enviada.
api.interceptors.request.use(
  async (config) => {
    // Busca o token de acesso salvo no armazenamento seguro.

    const tokenData = await getValueFor('OAuthJWT').then(data => data ? JSON.parse(data) : null);
    console.log("Token recuperado do armazenamento seguro:", tokenData);
    const tokenConfig : TokenResponseConfig = tokenData;

    if (tokenConfig) {
      // instantiate a new token response object which will allow us to refresh
      let tokenResponse = new TokenResponse(tokenConfig);
      
      // shouldRefresh checks the expiration and makes sure there is a refresh token
      if (tokenResponse.shouldRefresh()) {
        console.log("O token expirou ou está prestes a expirar. Atualizando o token...");
        const refreshConfig: RefreshTokenRequestConfig = { 
          clientId: KEYCLOAK_CLIENT_ID,
          refreshToken: tokenConfig.refreshToken
        }
        
        // pass our refresh token and get a new access token and new refresh token
        tokenResponse = await tokenResponse.refreshAsync(refreshConfig, discovery);
        console.log("Token atualizado:", tokenResponse);
        // cache the token for next time
        await save('OAuthJWT', JSON.stringify(tokenResponse.getRequestConfig()));
      }
      
      // Se o token existir, o adiciona ao cabeçalho de autorização.
      if (tokenResponse.accessToken) {
        config.headers.Authorization = `Bearer ${tokenResponse.accessToken}`;
      }

      console.log("Configuração da requisição:", config);

      return config;
    }
    else{
      console.log("Nenhum token encontrado no armazenamento seguro.");
      throw new Error("Nenhum token encontrado.");
    }
  },
  (error) => {
    // Em caso de erro na configuração da requisição, rejeita a promise.
    return Promise.reject(error);
  }
);

export default api;

