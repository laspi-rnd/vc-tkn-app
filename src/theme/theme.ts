// src/theme/theme.ts
// Este arquivo centraliza todas as nossas constantes de design.

export const colors = {
  primary: '#007AFF',      // Cor principal para elementos interativos
  background: '#F2F2F7',  // Fundo padrão do app
  white: '#FFFFFF',
  text: '#1C1C1E',         // Cor padrão para textos
  welcomeText: '#6C6C70',  // Tom mais suave para a mensagem de boas-vindas
};

export const spacing = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

// Adicionamos a tipagem explícita para propriedades como fontWeight e textAlign
// para ajudar o TypeScript a validar nossos estilos.
export const typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold' as 'bold',
  },
  body: {
    fontSize: 17,
  },
  welcome: {
    fontSize: 18,
    textAlign: 'center' as 'center',
    lineHeight: 25,
  },
  button: {
    fontSize: 18,
    fontWeight: 'bold' as 'bold',
  }
};
