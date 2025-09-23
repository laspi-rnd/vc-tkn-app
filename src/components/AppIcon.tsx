// src/components/AppIcon.tsx

import React from 'react';
// Importamos o pacote de ícones. Feather é uma excelente escolha de estilo.
import { Feather } from '@expo/vector-icons'; 

// Este tipo especial pega todos os nomes de ícones disponíveis no Feather
// para nos dar autocomplete e segurança de tipos!
type IconName = React.ComponentProps<typeof Feather>['name'];

interface Props {
  name: IconName;
  size?: number;
  color?: string;
}

const AppIcon: React.FC<Props> = ({ name, size = 24, color = 'black' }) => {
  // Simplesmente renderizamos o componente de ícone com as propriedades recebidas
  return <Feather name={name} size={size} color={color} />;
};

export default AppIcon;