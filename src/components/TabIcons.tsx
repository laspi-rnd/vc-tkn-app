// src/components/TabIcons.tsx

import React from 'react';
import { Svg, Path } from 'react-native-svg';
// CORREÇÃO: O único import relativo que ele precisa é para o nosso tema de cores.
import { colors } from '../theme/theme';

// O tipo 'profile' foi removido
interface IconProps {
  name: 'inbox' | 'wallet';
  color?: string;
  size?: number;
}

export const TabIcon: React.FC<IconProps> = ({ name, color = colors.text, size = 26 }) => {
  if (name === 'inbox') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path 
          d="M22 12h-6l-2 3h-4l-2-3H2" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <Path 
          d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </Svg>
    );
  }

  if (name === 'wallet') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path 
          d="M20 12V8a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-2" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <Path 
          d="M18 12a2 2 0 002 2h2V8a2 2 0 00-2-2h-2a2 2 0 00-2 2v4z" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </Svg>
    );
  }
  return null;
};