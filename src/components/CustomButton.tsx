// src/components/CustomButton.tsx

import React from 'react';
// 1. Adicionados: StyleProp e ViewStyle para uma tipagem mais robusta de estilos
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

// 2. Adicionada a prop 'style' à nossa interface de propriedades
interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  style?: StyleProp<ViewStyle>; // A prop de estilo agora é aceita e é opcional
}

// 3. O componente agora recebe 'style' como uma de suas props
const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style, ...props }) => {
  return (
    // 4. A mágica acontece aqui: aplicamos o estilo externo (style) junto com o estilo base (styles.buttonContainer).
    // O estilo externo tem prioridade e pode sobrescrever propriedades como 'width'.
    <TouchableOpacity style={[styles.buttonContainer, style]} onPress={onPress} {...props}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: spacing.large,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Este é o estilo padrão, que será sobrescrito pelo flex: 2 quando necessário
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});

export default CustomButton;