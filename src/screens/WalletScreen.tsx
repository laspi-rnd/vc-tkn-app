// src/screens/WalletScreen.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUser } from '../contexts/UserContext';
import { mockUserTokens, UserToken } from '../data/mockData';
import { colors, spacing, typography } from '../theme/theme';
import { WalletStackParamList } from '../../App';

type WalletScreenNavigationProp = NativeStackNavigationProp<WalletStackParamList, 'Wallet'>;
interface Props { navigation: WalletScreenNavigationProp; }

// NOVO: Definimos os tipos de filtro possíveis
type FilterStatus = 'Total' | 'Válidos' | 'Expirados/Revogados';

// Mock da chamada RPC (sem alteração)
const mockGetUserTokens = async (hashAA: string): Promise<UserToken[]> => {
  console.log('Buscando tokens para o usuário:', hashAA);
  await new Promise(resolve => setTimeout(resolve, 1500));
  return mockUserTokens;
};

const WalletScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useUser();
  const [tokens, setTokens] = useState<UserToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // NOVO: Estado para controlar qual filtro está ativo. Começa com 'Total'.
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('Total');

  const fetchTokens = async () => {
    if (user?.hashAA) {
      const userTokens = await mockGetUserTokens(user.hashAA);
      setTokens(userTokens);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTokens();
  }, [user]);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTokens();
    setRefreshing(false);
  }, [user]);

  // NOVO: Lógica para filtrar os tokens com base no estado 'activeFilter'.
  // useMemo garante que o filtro só seja re-executado quando necessário.
  const filteredTokens = useMemo(() => {
    if (activeFilter === 'Válidos') {
      return tokens.filter(token => token.status === 'Válido');
    }
    if (activeFilter === 'Expirados/Revogados') {
      return tokens.filter(token => token.status === 'Expirado' || token.status === 'Revogado');
    }
    // Para 'Total', retorna todos os tokens.
    return tokens;
  }, [tokens, activeFilter]);

  const getStatusStyle = (status: UserToken['status']) => {
    if (status === 'Válido') return styles.statusValid;
    if (status === 'Expirado') return styles.statusExpired;
    if (status === 'Revogado') return styles.statusRevoked;
    return {};
  };

  const renderTokenItem = ({ item }: { item: UserToken }) => (
    <TouchableOpacity style={styles.tokenCard} onPress={() => navigation.navigate('TokenDetail', { token: item })}>
      <View style={styles.cardHeader}>
        <Text style={styles.tokenType}>{item.type}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.tokenInfo}>Emissora: {item.issuer}</Text>
      <Text style={styles.tokenInfo}>Data de Emissão: {item.issueDate}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" /></SafeAreaView>;
  }

  const validTokens = tokens.filter(t => t.status === 'Válido').length;
  const expiredOrRevokedTokens = tokens.length - validTokens;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Carteira</Text>
      </View>
      
      {/* ATUALIZADO: Os cards de resumo agora são botões que mudam o filtro */}
      <View style={styles.summaryContainer}>
        <TouchableOpacity onPress={() => setActiveFilter('Total')}>
          <View style={[styles.summaryBox, activeFilter === 'Total' && styles.activeSummaryBox]}>
            <Text style={[styles.summaryValue, activeFilter === 'Total' && styles.activeSummaryText]}>{tokens.length}</Text>
            <Text style={[styles.summaryLabel, activeFilter === 'Total' && styles.activeSummaryText]}>Total</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setActiveFilter('Válidos')}>
          <View style={[styles.summaryBox, activeFilter === 'Válidos' && styles.activeSummaryBox]}>
            <Text style={[styles.summaryValue, activeFilter === 'Válidos' && styles.activeSummaryText]}>{validTokens}</Text>
            <Text style={[styles.summaryLabel, activeFilter === 'Válidos' && styles.activeSummaryText]}>Válidos</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveFilter('Expirados/Revogados')}>
          <View style={[styles.summaryBox, activeFilter === 'Expirados/Revogados' && styles.activeSummaryBox]}>
            <Text style={[styles.summaryValue, activeFilter === 'Expirados/Revogados' && styles.activeSummaryText]}>{expiredOrRevokedTokens}</Text>
            <Text style={[styles.summaryLabel, activeFilter === 'Expirados/Revogados' && styles.activeSummaryText]}>Expirados</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ATUALIZADO: O FlatList agora usa a lista de tokens filtrada */}
      <FlatList
        data={filteredTokens}
        renderItem={renderTokenItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>Nenhum token encontrado para este filtro.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { padding: spacing.medium, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center', backgroundColor: colors.white },
  headerTitle: { ...typography.title, fontSize: 22, color: colors.text },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: spacing.medium, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: '#eee' },
  summaryBox: { alignItems: 'center', paddingVertical: spacing.small, paddingHorizontal: spacing.medium, borderRadius: 8, borderWidth: 1, borderColor: 'transparent' },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
  summaryLabel: { fontSize: 14, color: colors.welcomeText, marginTop: 4 },
  // NOVO: Estilos para destacar o filtro ativo
  activeSummaryBox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeSummaryText: {
    color: colors.white,
  },
  listContainer: { padding: spacing.medium },
  tokenCard: { backgroundColor: colors.white, borderRadius: 8, padding: spacing.medium, marginBottom: spacing.medium, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.small },
  tokenType: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
  statusText: { color: colors.white, fontWeight: 'bold', fontSize: 12 },
  statusValid: { backgroundColor: '#4CAF50' },
  statusExpired: { backgroundColor: '#FFC107' },
  statusRevoked: { backgroundColor: '#F44336' },
  tokenInfo: { fontSize: 14, color: colors.welcomeText, marginTop: 2 },
  // NOVO: Estilos para quando a lista filtrada estiver vazia
  emptyListContainer: {
    marginTop: spacing.xlarge,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: colors.welcomeText,
  },
});

export default WalletScreen;