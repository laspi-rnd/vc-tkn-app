// src/screens/HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../theme/theme';
import { useUser, AuthorizationRequest } from '../contexts/UserContext';
import { mockNotifications } from '../data/mockData';
import UserDetailsModal from '../components/UserDetailsModal';
import ScannerModal from '../components/ScannerModal';
import { HomeStackParamList } from '../../App';
import AppIcon from '../components/AppIcon';
import NotificationIcon from '../components/NotificationIcon';

import { save, getValueFor } from '../services/secureStorage';
import { getMyAccount, authorizeIF, verifyAuthorizationRequest } from '../services/rpc';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;
interface Props { navigation: HomeScreenNavigationProp; }

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, notifications, setInitialNotifications, logout } = useUser();
  const rootNavigation = useNavigation(); // Hook para acessar a navegação raiz
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);
  const [isScannerVisible, setScannerVisible] = useState(false);
  
  useEffect(async () => {
    const checkFirstLogin = async () => {
      const hashAA_If = await getValueFor('hashAAIF');
      if (hashAA_If) {
        // Se existir, significa que é o primeiro login após a criação da conta
        // então submete a autorização para a IF
        const result = await authorizeIF(hashAA_If);
        if (result.success) {
          Alert.alert("Conta Ativada", "Sua conta foi ativada com sucesso!");
        } else {
          Alert.alert("Erro", "Houve um problema ao ativar sua conta. Tente novamente mais tarde.");
        }
        // Remove o hashAA_If após a verificação para não repetir esse processo
         await save('hashAAIF', '');
      }
    };

    checkFirstLogin();

      setInitialNotifications(await verifyAuthorizationRequest());
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Você tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          onPress: () => {
            logout();
            // Reseta toda a pilha de navegação para a tela de Onboarding
            rootNavigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Onboarding' }],
              })
            );
          }, 
          style: 'destructive' 
        }
      ]
    );
  };

  if (!user) { 
    return ( 
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView> 
    ); 
  }
  
  const NotificationItem = ({ item }: { item: AuthorizationRequest }) => ( 
    <TouchableOpacity style={styles.notificationItem} onPress={() => navigation.navigate('TokenSelection', { request: item })}>
      <NotificationIcon type={item.requestType} />
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescInstitution}>De: {item.institutionName}</Text>
        <Text style={styles.notificationDesc}>{item.description}</Text>
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
            <Text style={styles.cardTitle}>Sua Conta</Text>
            <Text style={styles.cardHash}>{`${user.hashAA.substring(0, 6)}...${user.hashAA.substring(user.hashAA.length - 4)}`}</Text>
          </View>
          <AppIcon name="eye" color={colors.primary} size={24} />
        </TouchableOpacity>
        
        <View style={styles.inboxSection}>
          <Text style={styles.inboxTitle}>Caixa de Entrada</Text>
          {notifications.length > 0 ? ( 
            <FlatList data={notifications} renderItem={NotificationItem} keyExtractor={item => item.id} scrollEnabled={false} /> 
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
  notificationDescInstitution: { fontSize: 14, color: colors.primary, fontWeight: '500', marginTop: 4 },
  notificationDesc: { fontSize: 14, color: colors.welcomeText, marginTop: 4, fontStyle: 'italic' },
  fab: { position: 'absolute', bottom: spacing.large, right: spacing.large, width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
});

export default HomeScreen;