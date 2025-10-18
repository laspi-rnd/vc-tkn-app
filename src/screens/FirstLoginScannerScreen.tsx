// src/screens/FirstLoginScannerScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BarcodeScanningResult } from 'expo-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme/theme';
import { useUser } from '../contexts/UserContext';
import { getMyAccount } from '../services/authService';
import { save, deleteValueFor } from '../services/secureStorage';
import { RootStackParamList } from '../../App';

type ScannerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FirstLoginScanner'>;
interface Props { navigation: ScannerScreenNavigationProp; }

const FirstLoginScannerScreen: React.FC<Props> = ({ navigation }) => {
  const { user, login } = useUser();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = async (scanningResult: BarcodeScanningResult) => {
    if (scanned || isProcessing) return;
    
    setScanned(true);
    setIsProcessing(true);

    try {
      const qrData = JSON.parse(scanningResult.data);
      if (!qrData.hashIf) {
        throw new Error("O QR code escaneado não contém um 'hashIf' válido.");
      }

      console.log("QR code com hashIf escaneado. Buscando conta " + qrData.hashIf);
      const accountData = await getMyAccount(qrData.hashIf);
      console.log("Conta obtida do backend:", accountData);

      // Salva o hashAA no armazenamento seguro para uso futuro
      if (!accountData.hashAA) {
        throw new Error("O QR Code obtido não contém um 'hashAA' válido.");
      }
      await save('hashAA', accountData.hashAA);
      await save('firstLoginCompleted', 'true');
      await deleteValueFor('pendingFirstLoginAuth');
      
      // Atualiza o objeto do usuário no contexto com o hashAA final
      // Usamos os dados do usuário que já estão no contexto (vindos do token)
      if (user) {
        const finalUserData = { ...user, hashAA: accountData.hashAA };
        login(finalUserData);
      }
      
      Alert.alert("Sucesso!", "Sua carteira foi vinculada com sucesso.", [
        { text: "Acessar o App", onPress: () => {
            navigation.dispatch(CommonActions.reset({
              index: 0,
              routes: [{ name: 'App' }],
            }));
        }}
      ]);

    } catch (error: any) {
      Alert.alert(
        "Erro ao Vincular Carteira", 
        error.message || "Ocorreu um erro desconhecido.", 
        [{ text: "Escanear Novamente", onPress: () => setScanned(false) }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!permission) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Precisamos da sua permissão para usar a câmera.</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        {isProcessing ? (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.processingText}>Vinculando sua carteira...</Text>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.headerText}>Ativar Carteira</Text>
            </View>
            <View style={styles.viewfinder} />
            <Text style={styles.scanText}>Escaneie o QR code final fornecido pela instituição para ativar sua conta.</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  header: { position: 'absolute', top: 80, paddingHorizontal: spacing.large },
  headerText: { color: colors.white, ...typography.title, textAlign: 'center' },
  viewfinder: { width: 280, height: 280, borderColor: colors.white, borderWidth: 2, borderRadius: 16 },
  scanText: { marginTop: spacing.large, color: colors.white, fontSize: 18, fontWeight: 'bold', textAlign: 'center', paddingHorizontal: spacing.large },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.large, backgroundColor: colors.background },
  permissionText: { fontSize: 18, textAlign: 'center', marginBottom: spacing.large },
  processingOverlay: { justifyContent: 'center', alignItems: 'center' },
  processingText: { marginTop: spacing.medium, color: colors.white, fontSize: 18, fontWeight: 'bold' },
});

export default FirstLoginScannerScreen;