// src/contexts/UserContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Token = { 
  id: string; 
  name: string; 
  description: string; 
  isRequired?: boolean;
};

export type AuthorizationRequest = { 
  id: string; 
  title: string; 
  institutionName: string; 
  institutionHash: string; 
  requestedTokens: Token[]; 
  requestType: 'query' | 'issuance';
  description: string;
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
  setInitialNotifications: (notifications: AuthorizationRequest[]) => void;
  removeNotification: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<AuthorizationRequest[]>([]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setNotifications([]);
  };

  const setInitialNotifications = (initialNotifications: AuthorizationRequest[]) => {
    setNotifications(initialNotifications);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <UserContext.Provider value={{ user, notifications, login, logout, setInitialNotifications, removeNotification }}>
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