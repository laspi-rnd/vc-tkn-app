// src/screens/WalletScreen.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useUser, UserToken } from '../contexts/UserContext';
import { colors, spacing, typography } from '../theme/theme';
import { WalletStackParamList } from '../../App';
import { getValueFor, save } from '../services/secureStorage';
import { getUserTokens } from '../services/authService';

type WalletScreenNavigationProp = NativeStackNavigationProp<WalletStackParamList, 'Wallet'>;
interface Props { navigation: WalletScreenNavigationProp; }

type FilterStatus = 'Total' | 'Válidos' | 'Expirados';

const WalletScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useUser();
  const [tokens, setTokens] = useState<UserToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('Total');

  const fetchTokens = async () => {
    setIsLoading(true);
    try {
      const fetchedTokens = await getUserTokens();

      setTokens(fetchedTokens);
    } catch (error) {
      console.error("Erro ao carregar tokens da carteira:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTokens();
    }, [])
  );

  const filteredTokens = useMemo(() => {
    if (activeFilter === 'Válidos') {
      return tokens.filter(token => {
        const today = new Date();
        const expirationDate = new Date(token.vencimento);
        return expirationDate >= today;
      });
    }
    if (activeFilter === 'Expirados') {
      return tokens.filter(token => {
        const today = new Date();
        const expirationDate = new Date(token.vencimento);
        return expirationDate < today;
      });
    }
    return tokens;
  }, [tokens, activeFilter]);

  const getStatusStyle = (vencimento : UserToken['vencimento']) => {
    if (new Date(vencimento) >= new Date()) return styles.statusValid;
    if (new Date(vencimento) < new Date()) return styles.statusExpired;
    return {};
  };

  const renderTokenItem = ({ item }: { item: UserToken }) => (
    <TouchableOpacity style={styles.tokenCard} onPress={() => navigation.navigate('TokenDetail', { token: item })}>
      <View style={styles.cardHeader}>
        <Text style={styles.tokenType}>{item.nome}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.vencimento)]}>
          <Text style={styles.statusText}>{new Date(item.vencimento) >= new Date() ? "Válido" : "Expirado"}</Text>
        </View>
      </View>
      <Text style={styles.tokenInfo}>Emissora: {item.emissor}</Text>
      <Text style={styles.tokenInfo}>Data de Emissão: {item.emissao}</Text>
    </TouchableOpacity>
  );

  if (isLoading && tokens.length === 0) {
    return <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" /></SafeAreaView>;
  }

  const validTokens = tokens.filter(t => new Date(t.vencimento) >= new Date()).length;
  const expiredOrRevokedTokens = tokens.length - validTokens;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Carteira</Text>
      </View>
      
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

        <TouchableOpacity onPress={() => setActiveFilter('Expirados')}>
          <View style={[styles.summaryBox, activeFilter === 'Expirados' && styles.activeSummaryBox]}>
            <Text style={[styles.summaryValue, activeFilter === 'Expirados' && styles.activeSummaryText]}>{expiredOrRevokedTokens}</Text>
            <Text style={[styles.summaryLabel, activeFilter === 'Expirados' && styles.activeSummaryText]}>Expirados</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTokens}
        renderItem={renderTokenItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchTokens} colors={[colors.primary]} />}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>
              {activeFilter === 'Total' ? 'Você ainda não possui tokens na sua carteira.' : 'Nenhum token encontrado para este filtro.'}
            </Text>
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
  summaryBox: { alignItems: 'center', minWidth: 80, paddingVertical: spacing.small, paddingHorizontal: spacing.medium, borderRadius: 8, borderWidth: 1, borderColor: 'transparent' },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
  summaryLabel: { fontSize: 14, color: colors.welcomeText, marginTop: 4 },
  activeSummaryBox: { backgroundColor: colors.primary, borderColor: colors.primary },
  activeSummaryText: { color: colors.white },
  listContainer: { padding: spacing.medium, flexGrow: 1 },
  tokenCard: { backgroundColor: colors.white, borderRadius: 8, padding: spacing.medium, marginBottom: spacing.medium, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.small },
  tokenType: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
  statusText: { color: colors.white, fontWeight: 'bold', fontSize: 12 },
  statusValid: { backgroundColor: '#4CAF50' },
  statusExpired: { backgroundColor: '#FFC107' },
  statusRevoked: { backgroundColor: '#F44336' },
  tokenInfo: { fontSize: 14, color: colors.welcomeText, marginTop: 2 },
  emptyListContainer: { marginTop: spacing.xlarge, alignItems: 'center', flex: 1, justifyContent: 'center' },
  emptyListText: { fontSize: 16, color: colors.welcomeText, textAlign: 'center' },
});

export default WalletScreen;