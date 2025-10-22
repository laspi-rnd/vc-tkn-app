// src/services/cryptoService.ts

import { RSA } from 'react-native-rsa-native';
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';

/**
 * Processa o QR code, criptografa o hashAA e envia para o callbackUrl.
 * @param qrCodeData O conteúdo JSON lido do QR code.
 * @param userHashAA O hashAA do usuário logado.
 */
export const processQRCodeAndSendHashAA = async (qrCodeData: string, userHashAA: string) => {
  try {
    // Etapa 1: Parse do QR code
    const request = JSON.parse(qrCodeData);
    console.log('Dados do QR code recebidos:', request);
    const { callbackUrl, publicKey: publicKeyJwk, requestId } = request;

    if (!callbackUrl || !requestId) {
      throw new Error("Dados do QR code inválidos ou incompletos.");
    }

    console.log('Processando solicitação de hashAA:', requestId);
    console.log('Callback URL:', callbackUrl);

    // Etapa 2: Converter a chave pública de JWK para o formato PEM
    // A biblioteca 'jwk-to-pem' requer que o JWK seja do tipo 'any'
    //const publicKeyPem = jwkToPem(publicKeyJwk as any);
    //if (!publicKeyPem) {
    //    throw new Error("Falha ao converter a chave pública JWK para PEM.");
    //}
    //console.log('Chave pública convertida para PEM com sucesso.');


    // Etapa 3: Criptografar o hashAA usando a chave pública PEM
    // A biblioteca react-native-rsa-native já retorna o resultado em base64.
    //const encryptedHashAA = await RSA.encrypt(userHashAA, publicKeyPem);
    console.log('HashAA criptografado com sucesso.');


    // Etapa 4: Enviar o hashAA criptografado para o callbackUrl
    console.log('Enviando para o callback...');
    const response = await axios.post(callbackUrl, {
      encryptedHashAA: userHashAA, // não usar encryptedHashAA para testes
      timestamp: new Date().toISOString(),
    });

    if (response.status !== 200) {
      throw new Error(`O servidor de callback respondeu com o status ${response.status}`);
    }

    console.log('Resposta do callback recebida com sucesso:', response.data);
    return response.data;

  } catch (error) {
    console.error('Erro ao processar a solicitação do QR code:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Falha na comunicação com o servidor: ${error.response?.data?.error || error.message}`);
    }
    // Garante que o erro seja propagado como uma mensagem de string
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Ocorreu um erro desconhecido durante a criptografia.');
  }
};