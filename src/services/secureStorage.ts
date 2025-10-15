// src/services/secureStorage.ts

import * as SecureStore from 'expo-secure-store';

/**
 * Salva um valor de forma segura no dispositivo.
 * @param key A chave para o valor.
 * @param value O valor a ser salvo.
 */
export async function save(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Erro ao salvar no SecureStore (key: ${key}):`, error);
    throw new Error('Não foi possível salvar os dados de forma segura.');
  }
}

/**
 * Obtém um valor salvo de forma segura no dispositivo.
 * @param key A chave do valor a ser obtido.
 * @returns O valor salvo ou null se não for encontrado.
 */
export async function getValueFor(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Erro ao obter valor do SecureStore (key: ${key}):`, error);
    throw new Error('Não foi possível obter os dados de forma segura.');
  }
}

/**
 * Deleta um valor salvo de forma segura no dispositivo.
 * @param key A chave do valor a ser deletado.
 */
export async function deleteValueFor(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Erro ao deletar do SecureStore (key: ${key}):`, error);
    throw new Error('Não foi possível remover os dados de forma segura.');
  }
}
