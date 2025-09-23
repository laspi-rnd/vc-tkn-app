// src/components/AppLogo.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/theme';

const AppLogo: React.FC = () => {
  return (
    // Um container para dar o fundo circular ao ícone
    <View style={styles.logoContainer}>
      <Feather name="shield" size={60} color={colors.white} />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60, // Metade da largura/altura para um círculo perfeito
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra para dar profundidade
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default AppLogo;