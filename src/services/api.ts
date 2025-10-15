// src/services/api.ts

import axios from 'axios';
import { getValueFor } from './secureStorage';

// A URL do seu backend principal (não o Keycloak)
const API_URL = 'http://192.168.1.16:3333';

const api = axios.create({
  baseURL: API_URL,
});

// Este "interceptor" é uma função que roda ANTES de cada requisição ser enviada.
api.interceptors.request.use(
  async (config) => {
    // Busca o token de acesso salvo no armazenamento seguro.
    const token = await getValueFor('accessToken');

    // Se o token existir, o adiciona ao cabeçalho de autorização.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

