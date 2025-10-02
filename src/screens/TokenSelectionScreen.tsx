// src/screens/TokenSelectionScreen.tsx

import React, { useState } from 'react';
// 1. IMPORTADO: Alert para a caixa de diálogo de confirmação
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import { colors, spacing, typography } from '../theme/theme';
import { Svg, Path } from 'react-native-svg';
import { useUser, AuthorizationRequest } from '../contexts/UserContext';
import { HomeStackParamList } from '../../App';
import AppIcon from '../components/AppIcon'; // Usaremos para o ícone da lixeira

type Token = AuthorizationRequest['requestedTokens'][0];

type TokenSelectionScreenRouteProp = RouteProp<HomeStackParamList, 'TokenSelection'>;
type TokenSelectionScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'TokenSelection'>;

interface Props {
  route: TokenSelectionScreenRouteProp;
  navigation: TokenSelectionScreenNavigationProp;
}

const mockAuthorizeIf = async (ifHash: string, authorizedTokens: string[]): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const shouldSucceed = Math.random() > 0.1;
  return { success: shouldSucceed };
};

const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <View style={[styles.checkboxBase, checked && styles.checkboxChecked]}>
    {checked && <Svg width="14" height="14" viewBox="0 0 24 24" fill="none"><Path d="M20 6L9 17L4 12" stroke={colors.white} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></Svg>}
  </View>
);

const TokenSelectionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { request } = route.params;
  const { removeNotification } = useUser();
  
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>(() => 
    request.requestedTokens.filter(t => t.isRequired).map(t => t.id)
  );
  const [isLoading, setIsLoading] = useState(false);

  const toggleTokenSelection = (tokenId: string) => {
    setSelectedTokenIds(prev =>
      prev.includes(tokenId)
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    );
  };

  const handleAuthorize = async () => {
    setIsLoading(true);
    const selectedTokens = request.requestedTokens.filter(token => selectedTokenIds.includes(token.id));
    const selectedTokenNames = selectedTokens.map(token => token.name);
    
    const result = await mockAuthorizeIf(request.institutionHash, selectedTokenNames);
    setIsLoading(false);

    if (result.success) {
      removeNotification(request.id);
      navigation.replace('AuthorizationConfirmed', { authorizedTokens: selectedTokenNames });
    } else {
      navigation.navigate('AuthorizationError');
    }
  };

  // 2. ADICIONADO: Função para lidar com a exclusão da solicitação
  const handleDeleteRequest = () => {
    Alert.alert(
      "Excluir Solicitação",
      `Você tem certeza que deseja excluir esta solicitação de "${request.institutionName}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => {
            removeNotification(request.id);
            navigation.goBack();
          } 
        }
      ]
    );
  };

  const renderTokenItem = ({ item }: { item: Token }) => {
    const isSelected = selectedTokenIds.includes(item.id);
    return (
      <TouchableOpacity 
        style={styles.tokenItem} 
        onPress={() => !item.isRequired && toggleTokenSelection(item.id)}
        activeOpacity={item.isRequired ? 1 : 0.7}
      >
        <CheckboxIcon checked={isSelected} />
        <View style={styles.tokenTextContainer}>
          <View style={styles.tokenNameContainer}>
            <Text style={styles.tokenName}>{item.name}</Text>
            {item.isRequired ? (
              <View style={styles.requiredBadge}>
                <Text style={styles.badgeText}>Obrigatório</Text>
              </View>
            ) : (
              <View style={[styles.requiredBadge, styles.optionalBadge]}>
                <Text style={styles.badgeText}>Opcional</Text>
              </View>
            )}
          </View>
          <Text style={styles.tokenDescription}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const title = request.requestType === 'query' ? 'Autorizar Consulta' : 'Autorizar Criação';
  const subtitle = request.requestType === 'query'
    ? `A "${request.institutionName}" solicitou a consulta dos seguintes tokens. Selecione quais você deseja autorizar.`
    : `A "${request.institutionName}" solicitou a criação dos seguintes tokens. Selecione quais você deseja emitir.`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {/* 3. ADICIONADO: Ícone de lixeira clicável */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteRequest}>
          <AppIcon name="trash-2" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={request.requestedTokens}
        renderItem={renderTokenItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <CustomButton
              title="Autorizar Selecionados"
              onPress={handleAuthorize}
              disabled={selectedTokenIds.length === 0}
              style={[styles.authorizeButton, selectedTokenIds.length === 0 && styles.disabledButton]}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  // 4. ATUALIZADO: Header agora usa flexbox para alinhar o título e o botão
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.large, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.background 
  },
  deleteButton: {
    marginLeft: spacing.medium,
    padding: spacing.small,
  },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.welcomeText, marginTop: spacing.small },
  listContainer: { padding: spacing.large },
  tokenItem: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.medium, backgroundColor: colors.background, padding: spacing.medium, borderRadius: 8 },
  checkboxBase: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.primary, borderRadius: 4, marginRight: spacing.medium },
  checkboxChecked: { backgroundColor: colors.primary },
  tokenTextContainer: { flex: 1 },
  tokenNameContainer: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  tokenName: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginRight: spacing.small },
  requiredBadge: { 
    backgroundColor: colors.primary, 
    borderRadius: 4, 
    paddingHorizontal: 6, 
    paddingVertical: 2 
  },
  optionalBadge: {
    backgroundColor: colors.welcomeText,
  },
  badgeText: { 
    color: colors.white, 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  tokenDescription: { fontSize: 14, color: colors.welcomeText, marginTop: 4 },
  footer: { padding: spacing.large, borderTopWidth: 1, borderTopColor: colors.background },
  buttonRow: { flexDirection: 'row', alignItems: 'center' },
  cancelButton: { flex: 1, alignItems: 'center' },
  cancelButtonText: { color: colors.primary, fontWeight: 'bold', fontSize: 16 },
  authorizeButton: { flex: 2, marginLeft: spacing.medium },
  disabledButton: { backgroundColor: colors.welcomeText }
});

export default TokenSelectionScreen;