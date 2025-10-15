
// src/services/rpc.ts

import axios from 'axios';
import api from './api';
import { AuthorizationRequest } from '../contexts/UserContext';


export const getMyAccount = async (hashIf: string): Promise<{ network_name: string; hashAA: string }> => {
  try {
    const response = await api.post('/client/get-my-account', { "hashIf": hashIf });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Não foi possível buscar a sua conta.");
    }
    throw new Error("Erro de comunicação ao buscar a sua conta.");
  }
};

export const authorizeIF = async (hashAA_If: string, readAuthorized: number[], issueAuthorized: number[], createVCAuthorized: number[]): Promise<{ authorizationUrl: string }> => {
    try {
        const response = await api.post('/client/authorize-if', {
                "hashAA_If": hashAA_If,
                "autorizados": readAuthorized,
                "autorizadosEmissao": issueAuthorized,
                "autorizadoCriacaoVc": createVCAuthorized
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Não foi possível autorizar a instituição.");
        }
        throw new Error("Erro de comunicação ao iniciar a autorização com a instituição.");
    }
};

export const verifyAuthorizationRequest = async (): Promise<{ success: AuthorizationRequest }> => {
    try {
        const response = await api.get('/client/verify-if-request');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Não foi possível verificar a solicitação de autorização.");
        }
        throw new Error("Erro de comunicação ao verificar a solicitação de autorização.");
    }
}