// src/screens/HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../theme/theme';
import { useUser, AuthorizationRequest } from '../contexts/UserContext';
import { mockNotifications } from '../data/mockData';
import UserDetailsModal from '../components/UserDetailsModal';
import { HomeStackParamList } from '../../App';
import AppIcon from '../components/AppIcon';
import NotificationIcon from '../components/NotificationIcon';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;
interface Props { navigation: HomeScreenNavigationProp; }

const EyeIcon = () => <AppIcon name="eye" color={colors.primary} size={24} />;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, notifications, setInitialNotifications, logout } = useUser();
  const rootNavigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    if (notifications.length === 0) {
      setInitialNotifications(mockNotifications);
    }
  }, []);

  const handleLogout = () => {
    Alert.alert("Sair da Conta", "Você tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => {
          logout();
          rootNavigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'ScenarioPicker' }] }));
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
            <View style={styles.avatarIcon}>
              <Ionicons name="person" size={32} color={colors.white} />
            </View>
            <View>
              <Text style={styles.greetingText}>Olá,</Text>
              <Text style={styles.greetingName}>{user.name}!</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <AppIcon name="log-out" color={colors.welcomeText} size={28} />
          </TouchableOpacity>
        </View>
        <View style={styles.accountCard}><View><Text style={styles.cardTitle}>Sua Conta</Text><Text style={styles.cardHash}>{`${user.hashAA.substring(0, 6)}...${user.hashAA.substring(user.hashAA.length - 4)}`}</Text></View><TouchableOpacity style={styles.eyeIconContainer} onPress={() => setModalVisible(true)}><EyeIcon /></TouchableOpacity></View>
        <View style={styles.inboxSection}><Text style={styles.inboxTitle}>Caixa de Entrada</Text>{notifications.length > 0 ? ( <FlatList data={notifications} renderItem={NotificationItem} keyExtractor={item => item.id} scrollEnabled={false} /> ) : ( <Text style={styles.emptyInboxText}>Nenhuma solicitação pendente.</Text> )}</View>
      </ScrollView>
      <UserDetailsModal visible={isModalVisible} onClose={() => setModalVisible(false)} user={user} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: spacing.large },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.large },
  profileTouchable: { flexDirection: 'row', alignItems: 'center' },
  avatarIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.medium,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  greetingText: { fontSize: 18, color: colors.welcomeText },
  greetingName: { ...typography.title, fontSize: 24, color: colors.text },
  logoutButton: { padding: spacing.small },
  accountCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, padding: spacing.medium, marginBottom: spacing.xlarge, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.welcomeText },
  cardHash: { fontSize: 20, color: colors.primary, fontWeight: 'bold', marginTop: spacing.small },
  eyeIconContainer: { padding: spacing.small },
  inboxSection: { width: '100%' },
  inboxTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: spacing.medium },
  emptyInboxText: { color: colors.welcomeText, textAlign: 'center', marginTop: spacing.large, fontSize: 16 },
  notificationItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, padding: spacing.medium, marginBottom: spacing.medium, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  notificationTextContainer: { flex: 1, marginRight: spacing.small },
  notificationTitle: { fontSize: 17, fontWeight: 'bold', color: colors.text },
  notificationDescInstitution: { fontSize: 14, color: colors.primary, fontWeight: '500', marginTop: 4 },
  notificationDesc: { fontSize: 14, color: colors.welcomeText, marginTop: 4, fontStyle: 'italic' },
});

export default HomeScreen;