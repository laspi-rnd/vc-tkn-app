// src/screens/TokenDetailScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserToken } from '../contexts/UserContext';
import { colors, spacing, typography } from '../theme/theme';

type RootStackParamList = {
  TokenDetail: { token: UserToken };
};

type TokenDetailScreenRouteProp = RouteProp<RootStackParamList, 'TokenDetail'>;
type TokenDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TokenDetail'>;

interface Props {
  route: TokenDetailScreenRouteProp;
  navigation: TokenDetailScreenNavigationProp;
}

const TokenDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { token } = route.params;

  const DetailRow = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;
    return (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"< Voltar à Carteira"}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{token.nome}</Text>
        <View style={styles.card}>
          <DetailRow label="Status" value={new Date(token.vencimento) >= new Date() ? "Válido" : "Expirado"} />
          <DetailRow label="Validade" value={token.vencimento} />
          <DetailRow label="IF Emissora" value={token.emissor} />
          <DetailRow label="Data de Emissão" value={token.emissao} />
          <DetailRow label="Resultado da Compliance" value={token.result ? "Aprovado" : "Reprovado"} />
        </View>
        <Text style={styles.sectionTitle}>Informações Técnicas</Text>
        <View style={styles.card}>
          <DetailRow label="ID do Token" value={token.id} />
          <DetailRow label="Anotações" value={token.detalhes} />
          <DetailRow label="Comentários Adicionais" value={token.comentarios} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.medium, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  backButton: { color: colors.primary, fontSize: 16, fontWeight: 'bold' },
  container: { padding: spacing.medium },
  title: { ...typography.title, color: colors.text, marginBottom: spacing.medium },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginTop: spacing.large, marginBottom: spacing.small },
  card: { backgroundColor: colors.white, borderRadius: 8, padding: spacing.medium, elevation: 1 },
  detailRow: { marginVertical: spacing.small, borderBottomWidth: 1, borderBottomColor: colors.background, paddingBottom: spacing.small },
  detailLabel: { fontSize: 14, color: colors.welcomeText, marginBottom: 4 },
  detailValue: { fontSize: 16, color: colors.text, fontWeight: '500' },
});

export default TokenDetailScreen;