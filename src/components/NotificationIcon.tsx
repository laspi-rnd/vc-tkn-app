// src/components/NotificationIcon.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/theme';

interface Props {
  type: 'query' | 'issuance';
}

const NotificationIcon: React.FC<Props> = ({ type }) => {
  const iconName = type === 'query' ? 'search' : 'plus-circle';
  const backgroundColor = type === 'query' ? '#E3F2FD' : '#E8F5E9'; // Tons pastéis de azul e verde
  const iconColor = type === 'query' ? '#1E88E5' : '#43A047'; // Cores mais fortes

  return (
    <View style={[styles.iconContainer, { backgroundColor }]}>
      <Feather name={iconName} size={24} color={iconColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
});

export default NotificationIcon;