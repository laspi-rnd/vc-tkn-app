// src/screens/HomeScreen.tsx

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { CommonActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../theme/theme';
import { useUser, AuthorizationRequest, TokenType } from '../contexts/UserContext';
import UserDetailsModal from '../components/UserDetailsModal';
import ScannerModal from '../components/ScannerModal';
import { HomeStackParamList } from '../../App';
import AppIcon from '../components/AppIcon';
import NotificationIcon from '../components/NotificationIcon';
import { getTokenTypes, getVerificationRequests } from '../services/authService';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;
interface Props { navigation: HomeScreenNavigationProp; }

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, notifications, setNotifications, logout } = useUser();
  const rootNavigation = useNavigation();
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  // useFocusEffect é um hook que roda toda vez que a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        if (!user) return; // Só busca se o utilizador estiver logado
        
        setIsLoadingNotifications(true);
        try {
          // Busca os tipos de token e as solicitações em paralelo
          const [tokenTypes, requests] = await Promise.all([
            getTokenTypes(),
            getVerificationRequests()
          ]);
          
          const tokenTypesMap = new Map<number, TokenType>();
          tokenTypes.forEach(type => tokenTypesMap.set(type.id, type));

          // Enriquece cada solicitação com os detalhes dos tokens
          const enrichedRequests = requests.map(req => {
            const tokenDetails = req.solicitados.map(tokenId => tokenTypesMap.get(tokenId)).filter(Boolean) as TokenType[];
            
            // Lógica para inferir o tipo de requisição (pode precisar de ajuste)
            // Exemplo: se algum token tiver 'Consulta' no nome, é 'query'
            const isQuery = tokenDetails.some(td => td.tipo.toLowerCase().includes('consulta'));

            return {
              ...req,
              tokenDetails,
              requestType: isQuery ? 'query' : 'issuance',
            } as AuthorizationRequest;
          });

          setNotifications(enrichedRequests);
        } catch (error: any) {
          Alert.alert("Erro", error.message || "Não foi possível carregar a sua caixa de entrada.");
        } finally {
          setIsLoadingNotifications(false);
        }
      };

      fetchNotifications();
    }, [user]) // Roda novamente se o objeto 'user' mudar
  );

  const handleLogout = () => {
    Alert.alert("Sair da Conta", "Tem a certeza de que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => {
          logout();
          rootNavigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            })
          );
        }, style: 'destructive' }
    ]);
  };

  if (!user) { 
    return ( 
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}><ActivityIndicator size="large" /></View>
      </SafeAreaView> 
    ); 
  }
  
  const NotificationItem = ({ item }: { item: AuthorizationRequest }) => ( 
    <TouchableOpacity style={styles.notificationItem} onPress={() => navigation.navigate('TokenSelection', { request: item })}>
      <NotificationIcon type={item.requestType || 'query'} /> 
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationTitle}>{item.mensagem}</Text>
        <Text style={styles.notificationDesc}>{item.tokenDetails?.length || 0} token(s) solicitado(s)</Text>
      </View>
      <AppIcon name="chevron-right" size={24} color={colors.welcomeText} />
    </TouchableOpacity> 
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.profileTouchable} onPress={() => navigation.navigate('Profile')}>
            <Image source={{ uri: `https://i.pravatar.cc/150?u=${user.hashAA}` }} style={styles.avatar} />
            <View>
              <Text style={styles.greetingText}>Olá,</Text>
              <Text style={styles.greetingName}>{user.name}!</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <AppIcon name="log-out" color={colors.welcomeText} size={28} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.accountCard} onPress={() => setDetailsModalVisible(true)}>
          <View>
            <Text style={styles.cardTitle}>A sua Conta</Text>
            <Text style={styles.cardHash}>{`${user.hashAA.substring(0, 6)}...${user.hashAA.substring(user.hashAA.length - 4)}`}</Text>
          </View>
          <AppIcon name="eye" color={colors.primary} size={24} />
        </TouchableOpacity>
        
        <View style={styles.inboxSection}>
          <Text style={styles.inboxTitle}>Caixa de Entrada</Text>
          {isLoadingNotifications ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.large }}/>
          ) : notifications.length > 0 ? ( 
            <FlatList data={notifications} renderItem={NotificationItem} keyExtractor={item => item.solicitacao_id.toString()} scrollEnabled={false} /> 
          ) : ( 
            <Text style={styles.emptyInboxText}>Nenhuma solicitação pendente.</Text> 
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setScannerVisible(true)}>
        <AppIcon name="camera" size={28} color={colors.white} />
      </TouchableOpacity>
      <UserDetailsModal visible={isDetailsModalVisible} onClose={() => setDetailsModalVisible(false)} user={user} />
      <ScannerModal visible={isScannerVisible} onClose={() => setScannerVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: spacing.large, paddingBottom: 100 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.large },
  profileTouchable: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: spacing.medium, borderWidth: 2, borderColor: colors.primary },
  greetingText: { fontSize: 18, color: colors.welcomeText },
  greetingName: { ...typography.title, fontSize: 24, color: colors.text },
  logoutButton: { padding: spacing.small },
  accountCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, padding: spacing.medium, marginBottom: spacing.xlarge, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.welcomeText },
  cardHash: { fontSize: 20, color: colors.primary, fontWeight: 'bold', marginTop: spacing.small },
  inboxSection: { width: '100%' },
  inboxTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: spacing.medium },
  emptyInboxText: { color: colors.welcomeText, textAlign: 'center', marginTop: spacing.large, fontSize: 16 },
  notificationItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, padding: spacing.medium, marginBottom: spacing.medium, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  notificationTextContainer: { flex: 1, marginRight: spacing.small },
  notificationTitle: { fontSize: 17, fontWeight: 'bold', color: colors.text },
  notificationDesc: { fontSize: 14, color: colors.welcomeText, marginTop: 4 },
  fab: { position: 'absolute', bottom: spacing.large, right: spacing.large, width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
});

export default HomeScreen;