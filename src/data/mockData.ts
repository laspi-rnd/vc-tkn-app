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

// const getRequiredTokensByOperation = (operationType: string): TokenType[] => {
//     switch (operationType) {
//       case 'avaliacao_credito':
//         // Baseado em compliance_regras.md - Avaliação de Crédito (tokens 1-6)
//         return [
//           { id: 'identificacao_documentacao', name: 'Identificação e Documentação Pessoal', description: 'Documentação válida e verificada', required: true },
//           { id: 'profissao', name: 'Token de Profissão', description: 'Confirmação da atuação no mercado', required: true },
//           { id: 'comprovante_residencia', name: 'Comprovante de Residência', description: 'Endereço válido e verificável', required: true },
//           { id: 'comprovacao_renda', name: 'Comprovação de Renda', description: 'Renda declarada com validação online', required: true },
//           { id: 'negativado_dividas', name: 'Negativado em Dívidas Anteriores', description: 'Status de crédito sem restrição relevante', required: true },
//           { id: 'reputacao_credito', name: 'Reputação de Crédito (Registrato)', description: 'Score/registro consolidado de crédito aceitável', required: true },
//         ];
      
//       case 'cambio_turismo':
//         // Baseado em compliance_regras.md - Câmbio (tokens a-m)
//         return [
//           // Tokens críticos (a-j)
//           { id: 'identificacao_documentacao', name: 'Identificação e Documentação Pessoal', description: 'Documentação válida e verificada', required: true },
//           { id: 'profissao', name: 'Token de Profissão', description: 'Atuação no mercado', required: true },
//           { id: 'comprovante_residencia', name: 'Comprovante de Residência', description: 'Endereço válido e verificável', required: true },
//           { id: 'comprovacao_renda_ppe', name: 'Comprovação de Renda / PPE', description: 'Pessoa física empregada / prova de renda', required: true },
//           { id: 'ppe_internacional', name: 'PPE Internacional', description: 'Pessoa Politicamente Exposta Internacional', required: true },
//           { id: 'ppe_relacionado', name: 'PPE Relacionado', description: 'Pessoa Politicamente Exposta Relacionada', required: true },
//           { id: 'listas_restritivas', name: 'Situação em Listas Restritivas', description: 'Listas de controle/embargos', required: true },
//           { id: 'programas_sociais', name: 'Situação em Programas Sociais', description: 'Verificação de programas sociais', required: true },
//           { id: 'beneficios_federais', name: 'Situação em Benefícios Federais', description: 'Verificação de benefícios federais', required: true },
//           { id: 'sancoes_federais', name: 'Situação em Sanções Federais', description: 'Verificação de sanções federais', required: true },
//           // Tokens adicionais (k-m)
//           { id: 'validacao_renda_online', name: 'Validação Online de Renda', description: 'Validação online de renda', required: false },
//           { id: 'risco_geografico', name: 'Risco Geográfico', description: 'Classificação do local do cliente', required: false },
//           { id: 'risco_atividade', name: 'Risco de Atividade', description: 'Atividade econômica do cliente', required: false },
//         ];
      
//       default:
//         // Fallback para operações não reconhecidas
//         return [
//           { id: 'identificacao_documentacao', name: 'Identificação e Documentação Pessoal', description: 'Documentação válida e verificada', required: true },
//         ];
//     }
//   };

interface TokenType {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
}

const splitTokensRandomly = (
  tokens: TokenType[]
): { tokens_emitted: TokenType[]; tokens_available: TokenType[] } => {
  const tokens_emitted: TokenType[] = [];
  const tokens_available: TokenType[] = [];

  tokens.forEach((token) => {
    if (Math.random() > 0.5) {
      tokens_emitted.push(token);
    } else {
      tokens_available.push(token);
    }
  });

  return { tokens_emitted, tokens_available };
};

const cambioTokenTypes = [
  { id: 'identificacao_documentacao', name: 'Identificação e Documentação Pessoal', description: 'Documentação válida e verificada', isRequired: true },
  { id: 'profissao', name: 'Token de Profissão', description: 'Atuação no mercado', isRequired: true },
  { id: 'comprovante_residencia', name: 'Comprovante de Residência', description: 'Endereço válido e verificável', isRequired: true },
  { id: 'comprovacao_renda_ppe', name: 'Comprovação de Renda / PPE', description: 'Pessoa física empregada / prova de renda', isRequired: true },
  { id: 'ppe_internacional', name: 'PPE Internacional', description: 'Pessoa Politicamente Exposta Internacional', isRequired: true },
  { id: 'ppe_relacionado', name: 'PPE Relacionado', description: 'Pessoa Politicamente Exposta Relacionada', isRequired: true },
  { id: 'listas_restritivas', name: 'Situação em Listas Restritivas', description: 'Listas de controle/embargos', isRequired: true },
  { id: 'programas_sociais', name: 'Situação em Programas Sociais', description: 'Verificação de programas sociais', isRequired: true },
  { id: 'beneficios_federais', name: 'Situação em Benefícios Federais', description: 'Verificação de benefícios federais', isRequired: true },
  { id: 'sancoes_federais', name: 'Situação em Sanções Federais', description: 'Verificação de sanções federais', isRequired: true },
  // Tokens adicionais (k-m)
  { id: 'validacao_renda_online', name: 'Validação Online de Renda', description: 'Validação online de renda', isRequired: false },
  { id: 'risco_geografico', name: 'Risco Geográfico', description: 'Classificação do local do cliente', isRequired: false },
  { id: 'risco_atividade', name: 'Risco de Atividade', description: 'Atividade econômica do cliente', isRequired: false },
]

const avaliacaoCreditoTokenTypes = [
  { id: 'identificacao_documentacao', name: 'Identificação e Documentação Pessoal', description: 'Documentação válida e verificada', isRequired: true },
  { id: 'profissao', name: 'Token de Profissão', description: 'Confirmação da atuação no mercado', isRequired: true },
  { id: 'comprovante_residencia', name: 'Comprovante de Residência', description: 'Endereço válido e verificável', isRequired: true },
  { id: 'comprovacao_renda', name: 'Comprovação de Renda', description: 'Renda declarada com validação online', isRequired: true },
  { id: 'negativado_dividas', name: 'Negativado em Dívidas Anteriores', description: 'Status de crédito sem restrição relevante', isRequired: true },
  { id: 'reputacao_credito', name: 'Reputação de Crédito (Registrato)', description: 'Score/registro consolidado de crédito aceitável', isRequired: true }
]

const { tokens_emitted: tokensCambioJaFeitos, tokens_available: tokensCambioDisponiveis } = splitTokensRandomly(cambioTokenTypes);
const { tokens_emitted: tokensAvaliacaoJaFeitos, tokens_available: tokensAvaliacaoDisponiveis } = splitTokensRandomly(avaliacaoCreditoTokenTypes);

// --- MOCKS DA CAIXA DE ENTRADA ATUALIZADOS ---
export const mockNotifications: AuthorizationRequest[] = [
  // --- Solicitações de CONSULTA de Tokens ---
  {
    id: 'notif_consulta_101',
    title: 'Tokens KYC',
    institutionName: 'Banco XYZ',
    institutionHash: '0xIF_XYZ',
    requestType: 'query',
    description: 'Para confirmar seus dados na abertura de conta (KYC).',
    requestedTokens: [
      { id: 't_consulta_kyc', name: 'Identidade', description: 'Confirma seu nome e CPF.', isRequired: true },
      { id: 't_consulta_profissao', name: 'Profissão', description: 'Informa sua profissão.', isRequired: true },
      { id: 't_consulta_residencia', name: 'Residência', description: 'Informa seu endereço.', isRequired: true },
      { id: 't_consulta_renda', name: 'Comprovante de Renda', description: 'Informa sua renda.', isRequired: true },
      { id: 't_consulta_pep', name: 'Pessoa Publicamente Exposta (PPE)', description: 'Informa se você é uma pessoa publicamente exposta.', isRequired: true },
      { id: 't_consulta_listas', name: 'Listas Restritivas', description: 'Verifica se você está em alguma lista restritiva.', isRequired: true },
    ],
  },
  {
    id: 'notif_consulta_102',
    title: 'Análise de Crédito Pessoal',
    institutionName: 'Banco XYZ',
    institutionHash: '0xIF_XYZ',
    requestType: 'query',
    description: 'Para avaliar sua solicitação de crédito, conceda acesso aos seguintes tokens.',
    requestedTokens: tokensAvaliacaoJaFeitos,
  },
  {
    id: 'notif_consulta_103',
    title: 'Operação de Câmbio',
    institutionName: 'Banco XYZ',
    institutionHash: '0xIF_XYZ',
    requestType: 'query',
    description: 'Para validar sua troca de moeda, conceda acesso aos seguintes tokens.',
    requestedTokens: tokensCambioJaFeitos,
  },

  // --- Solicitações de EMISSÃO de novos Tokens ---
  {
    id: 'notif_emissao_201',
    title: 'Análise de Crédito Pessoal',
    institutionName: 'Banco XYZ',
    institutionHash: '0xIF_XYZ',
    requestType: 'issuance',
    description: 'Emita seus tokens para avaliação de crédito.',
    requestedTokens: tokensAvaliacaoDisponiveis,
  },
  {
    id: 'notif_emissao_202',
    title: 'Operação de Câmbio',
    institutionName: 'Banco XYZ',
    institutionHash: '0xIF_XYZ',
    requestType: 'issuance',
    description: 'Emita seus tokens para realizar a operação de câmbio.',
    requestedTokens: tokensCambioDisponiveis,
  },
];