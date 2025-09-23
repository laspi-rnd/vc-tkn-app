// src/data/mockData.ts

import { AuthorizationRequest } from '../contexts/UserContext';

export interface UserToken {
  id: string;
  type: 'KYC' | 'PEP' | 'Score de Crédito';
  status: 'Válido' | 'Expirado' | 'Revogado';
  issuer: string;
  issueDate: string;
  expiryDate: string;
  complianceResult?: 'Aprovado' | 'Reprovado';
  notes?: string;
  technicalDetails: {
    tokenId: string;
    hash: string;
  };
}

export const mockUserTokens: UserToken[] = [
  {
    id: 'token_101',
    type: 'KYC',
    status: 'Válido',
    issuer: 'Banco Digital XYZ',
    issueDate: '2023-08-15',
    expiryDate: '2025-08-15',
    complianceResult: 'Aprovado',
    technicalDetails: { tokenId: '101', hash: '0xabc...def' }
  },
  {
    id: 'token_102',
    type: 'PEP',
    status: 'Válido',
    issuer: 'Investimentos Seguros S.A.',
    issueDate: '2023-05-20',
    expiryDate: '2024-05-20',
    complianceResult: 'Aprovado',
    notes: 'Verificação manual realizada pela equipe de compliance.',
    technicalDetails: { tokenId: '102', hash: '0x123...456' }
  },
  {
    id: 'token_103',
    type: 'Score de Crédito',
    status: 'Expirado',
    issuer: 'Financeira Confiança',
    issueDate: '2022-09-01',
    expiryDate: '2023-09-01',
    technicalDetails: { tokenId: '103', hash: '0x789...abc' }
  },
];

// --- MOCKS DA CAIXA DE ENTRADA ATUALIZADOS ---
export const mockNotifications: AuthorizationRequest[] = [
  // --- Solicitações de CONSULTA de Tokens ---
  {
    id: 'notif_consulta_101',
    title: 'Confirmação de Identidade',
    institutionName: 'Nexa Bank',
    institutionHash: '0xIF_NEXA',
    requestType: 'query',
    description: 'Para confirmar seus dados na abertura de conta.',
    requestedTokens: [
      { id: 't_consulta_kyc', name: 'Consulta de Identidade (KYC)', description: 'Confirma seu nome e CPF.', isRequired: true },
    ],
  },
  {
    id: 'notif_consulta_102',
    title: 'Análise de Crédito Pessoal',
    institutionName: 'CredFácil Soluções',
    institutionHash: '0xIF_CREDFACIL',
    requestType: 'query',
    description: 'Para avaliar sua solicitação de empréstimo pessoal.',
    requestedTokens: [
      { id: 't_consulta_score', name: 'Consulta de Score de Crédito', description: 'Valida sua pontuação de crédito.', isRequired: true },
      { id: 't_consulta_pep_2', name: 'Consulta de Perfil (PEP)', description: 'Verifica seu perfil de risco.', isRequired: false },
    ],
  },
  {
    id: 'notif_consulta_103',
    title: 'Verificação para E-commerce',
    institutionName: 'Compra Segura Ltda.',
    institutionHash: '0xIF_ECOMMERCE',
    requestType: 'query',
    description: 'Para validar seus dados na finalização da compra.',
    requestedTokens: [
      { id: 't_consulta_kyc_3', name: 'Consulta de Identidade Verificada (KYC)', description: 'Para validar seus dados na finalização da compra.', isRequired: true },
    ],
  },

  // --- Solicitações de EMISSÃO de novos Tokens ---
  {
    id: 'notif_emissao_201',
    title: 'Solicitação de Emissão de Tokens',
    institutionName: 'Banco Ágil S.A.',
    institutionHash: '0xIF_AGIL',
    requestType: 'issuance',
    description: 'Crie suas credenciais digitais para usar em outros serviços.',
    requestedTokens: [
      { id: 't_emissao_kyc', name: 'Identidade Verificada', description: 'Cria um token reutilizável com seu nome e CPF.', isRequired: true },
      { id: 't_emissao_endereco', name: 'Comprovante de Endereço', description: 'Cria um token com seu endereço validado.', isRequired: false },
    ],
  },
  {
    id: 'notif_emissao_202',
    title: 'Finalização de Cadastro',
    institutionName: 'Fintech Futura',
    institutionHash: '0xIF_FUTURA',
    requestType: 'issuance',
    description: 'Emita seu token de comprovação de idade.',
    requestedTokens: [
      { id: 't_emissao_idade', name: 'Prova de Idade (+18)', description: 'Confirma que você é maior de idade.', isRequired: true },
    ],
  },
  {
    id: 'notif_emissao_203',
    title: 'Solicitação de Credenciais',
    institutionName: 'Banco Ágil S.A.',
    institutionHash: '0xIF_AGIL', // Mesmo banco, outra solicitação
    requestType: 'issuance',
    description: 'Atesta sua faixa de renda mensal para futuras análises.',
    requestedTokens: [
        { id: 't_emissao_renda', name: 'Comprovante de Renda', description: 'Cria um token que atesta sua faixa de renda mensal.', isRequired: true },
    ],
  },
];