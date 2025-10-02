// src/screens/ProfileScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { colors, spacing, typography } from '../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

// Tipagem para a navegação
type ProfileScreenNavigationProp = NativeStackNavigationProp<any>;
interface Props { navigation: ProfileScreenNavigationProp; }

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useUser();

  const handlePhotoChange = () => {
    Alert.alert("Trocar Foto", "Esta funcionalidade será implementada em breve!");
  };

  if (!user) {
    return <SafeAreaView style={styles.safeArea} />;
  }
  
  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"< Início"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarIcon}>
          <Ionicons name="person" size={80} color={colors.white} />
        </View>
        
        <View style={styles.detailsContainer}>
          <DetailRow label="Nome Completo" value={user.name} />
          <DetailRow label="CPF" value={user.cpf} />
          <DetailRow label="E-mail" value={user.email} />
          <DetailRow label="Data de Nascimento" value={user.dateOfBirth} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.medium, paddingVertical: spacing.small, borderBottomWidth: 1, borderBottomColor: '#ddd', flexDirection: 'row', alignItems: 'center' },
  backButton: { color: colors.primary, fontSize: 16, fontWeight: 'bold' },
  headerTitle: { ...typography.title, fontSize: 20, color: colors.text, textAlign: 'center', flex: 1 },
  container: { alignItems: 'center', padding: spacing.large },
  avatarIcon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    marginBottom: spacing.xlarge,
    justifyContent: 'center',
    alignItems: 'center'
  },
  detailsContainer: { width: '100%', backgroundColor: colors.white, borderRadius: 8, padding: spacing.medium },
  detailRow: { paddingVertical: spacing.medium, borderBottomWidth: 1, borderBottomColor: colors.background },
  detailLabel: { fontSize: 14, color: colors.welcomeText, marginBottom: 4 },
  detailValue: { fontSize: 16, color: colors.text, fontWeight: '500' },
});

export default ProfileScreen;