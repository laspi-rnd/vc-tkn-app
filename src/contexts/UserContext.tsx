// src/contexts/UserContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Tipagem para um único tipo de token vindo da API (/client/get-token-types)
export interface TokenType {
  code: number;
  name : string;
  required?: [string];
  extra?:[string];
}

// Tipagem para os tokens que serão guardados na carteira do utilizador
export interface UserToken {
  id: number; // Corresponde ao id do TokenType
  type: string; // Corresponde ao 'tipo' do TokenType
  status: 'Válido' | 'Expirado' | 'Revogado';
  issuer: string; // A 'mensagem' da solicitação original, que contém o nome da IF
  issueDate: string; // Data em que foi emitido (formato YYYY-MM-DD)
  expiryDate: string; // Data de validade (formato YYYY-MM-DD)
}

// Tipagem para uma solicitação vinda da API (/clients/verify-if-requests)
export type AuthorizationRequest = {
  solicitacao_id: number;
  mensagem: string; // Ex: "Processo 123, Empresa Um"
  data_pedido: string;
  solicitados: number[]; // Lista de IDs de tipos de token
  solicitadosEmissao: number[]; // IDs dos tokens solicitados para emissão
  hashAA_IF: string;
  criacaoVc: boolean;
  
  // Campos que adicionaremos no frontend para facilitar a renderização
  tokenDetails?: TokenType[];
  requestType?: 'query' | 'issuance'; // Vamos inferir este campo
};

export interface User {
  name: string;
  hashAA: string;
  cpf: string;
  email: string;
  dateOfBirth: string;
}

interface UserContextType {
  user: User | null;
  notifications: AuthorizationRequest[];
  login: (userData: User) => void;
  logout: () => void;
  setNotifications: (notifications: AuthorizationRequest[]) => void;
  removeNotification: (id: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<AuthorizationRequest[]>([]);

  const login = (userData: User) => setUser(userData);
  const logout = () => { setUser(null); setNotifications([]); };
  
  // A função setNotifications vinda do useState é passada diretamente no provedor
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.solicitacao_id !== id));
  };

  return (
    <UserContext.Provider value={{ user, notifications, login, logout, setNotifications, removeNotification }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};