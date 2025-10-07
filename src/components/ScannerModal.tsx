// src/components/ScannerModal.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, Button } from 'react-native';
// CORREÇÃO: As importações corretas, sem '/next'
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BarcodeScanningResult } from 'expo-camera';
import { colors, spacing } from '../theme/theme';
import AppIcon from './AppIcon';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ScannerModal: React.FC<Props> = ({ visible, onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
    if (visible) {
      setScanned(false);
    }
  }, [visible, permission]);

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (scanned) return;
    
    setScanned(true);
    const { data } = scanningResult;

    console.log(`QR Code escaneado com sucesso! Payload: ${data}`);

    Alert.alert(
      "QR Code Lido!",
      `Dados: ${data}`,
      [{ text: "OK", onPress: onClose }]
    );
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} onRequestClose={onClose}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Precisamos da sua permissão para usar a câmera.</Text>
          <Button onPress={requestPermission} title="Conceder Permissão" />
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
            <Text style={styles.permissionButton}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <AppIcon name="x" size={32} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.viewfinder} />
          <Text style={styles.scanText}>Aponte a câmera para o QR Code</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  closeButton: { position: 'absolute', top: spacing.xlarge + 10, left: spacing.large, zIndex: 1 },
  viewfinder: { width: 250, height: 250, borderColor: colors.white, borderWidth: 2, borderRadius: 16, opacity: 0.8 },
  scanText: { marginTop: spacing.large, color: colors.white, fontSize: 18, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 8 },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.large, backgroundColor: colors.background },
  permissionText: { fontSize: 18, textAlign: 'center', marginBottom: spacing.large },
  permissionButton: { color: colors.primary, fontSize: 16 },
});

export default ScannerModal;