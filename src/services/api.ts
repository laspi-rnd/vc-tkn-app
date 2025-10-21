// src/services/api.ts

import axios from 'axios';
import { getValueFor, save } from './secureStorage';

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
  
    let accessToken = await getValueFor('OAuthJWT').then(data => data ? JSON.parse(data).accessToken : null);
    let refreshToken = await getValueFor('OAuthJWT').then(data => data ? JSON.parse(data).refreshToken : null);
    let expiresIn = await getValueFor('OAuthJWT').then(data => data ? JSON.parse(data).expiresIn : null);

    // Se o token existir, o adiciona ao cabeçalho de autorização.
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log("Configuração da requisição:", config);

    return config;
  },
  (error) => {
    // Em caso de erro na configuração da requisição, rejeita a promise.
    return Promise.reject(error);
  }
);

export default api;

