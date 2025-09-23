// src/components/UserDetailsModal.tsx

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { User } from '../contexts/UserContext';
import { colors, spacing, typography } from '../theme/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  user: User;
}

const UserDetailsModal: React.FC<Props> = ({ visible, onClose, user }) => {
  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Sua Identidade Digital</Text>
          
          <View style={styles.qrContainer}>
            <QRCode
              value={user.hashAA}
              size={180}
              backgroundColor={colors.white}
              color={colors.text}
            />
          </View>
          
          <DetailRow label="Hash da Conta" value={user.hashAA} />
          <DetailRow label="Nome Completo" value={user.name} />
          <DetailRow label="CPF" value={user.cpf} />
          <DetailRow label="E-mail" value={user.email} />
          <DetailRow label="Data de Nascimento" value={user.dateOfBirth} />

        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.large,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.medium,
    right: spacing.medium,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.welcomeText,
  },
  modalTitle: {
    ...typography.title,
    fontSize: 22,
    marginBottom: spacing.large,
    color: colors.text
  },
  qrContainer: {
    marginBottom: spacing.large,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  detailRow: {
    width: '100%',
    paddingVertical: spacing.medium,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.welcomeText,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
});

export default UserDetailsModal;