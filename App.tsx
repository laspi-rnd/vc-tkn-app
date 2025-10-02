// App.tsx

import 'react-native-gesture-handler';
import React from 'react';
// 1. IMPORTADO: O provedor que garante que a área segura seja calculada corretamente.
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { User, UserProvider } from './src/contexts/UserContext';
import { UserToken, AuthorizationRequest } from './src/data/mockData';

// Componentes e Telas
import { TabIcon } from './src/components/TabIcons';
import { colors } from './src/theme/theme';
import ScenarioPickerScreen from './src/screens/ScenarioPickerScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingErrorScreen from './src/screens/OnboardingErrorScreen';
import TokenSelectionScreen from './src/screens/TokenSelectionScreen';
import AuthorizationConfirmedScreen from './src/screens/AuthorizationConfirmedScreen';
import AuthorizationErrorScreen from './src/screens/AuthorizationErrorScreen';
import WalletScreen from './src/screens/WalletScreen';
import TokenDetailScreen from './src/screens/TokenDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ConfirmDataScreen from './src/screens/ConfirmDataScreen';
import CreatePasswordScreen from './src/screens/CreatePasswordScreen';

// --- NAVEGADORES ANINHADOS (sem alterações) ---
export type HomeStackParamList = { Home: undefined; Profile: undefined; TokenSelection: { request: AuthorizationRequest; }; AuthorizationConfirmed: { authorizedTokens: string[]; }; AuthorizationError: undefined; };
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="Profile" component={ProfileScreen} />
    <HomeStack.Screen name="TokenSelection" component={TokenSelectionScreen} />
    <HomeStack.Screen name="AuthorizationConfirmed" component={AuthorizationConfirmedScreen} />
    <HomeStack.Screen name="AuthorizationError" component={AuthorizationErrorScreen} />
  </HomeStack.Navigator>
);

export type WalletStackParamList = { Wallet: undefined; TokenDetail: { token: UserToken; }; };
const WalletStack = createNativeStackNavigator<WalletStackParamList>();
const WalletStackNavigator = () => (
  <WalletStack.Navigator screenOptions={{ headerShown: false }}>
    <WalletStack.Screen name="Wallet" component={WalletScreen} />
    <WalletStack.Screen name="TokenDetail" component={TokenDetailScreen} />
  </WalletStack.Navigator>
);

// --- MENU DE ABAS (sem alterações) ---
export type AppTabParamList = { 'Caixa de Entrada': undefined; 'Minha Carteira': undefined; };
const Tab = createBottomTabNavigator<AppTabParamList>();
const AppTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.welcomeText,
      tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
      tabBarStyle: { paddingTop: 8, paddingBottom: 8, height: 65 },
      tabBarIcon: ({ color }) => {
        const iconName = route.name === 'Caixa de Entrada' ? 'inbox' : 'wallet';
        return <TabIcon name={iconName} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Caixa de Entrada" component={HomeStackNavigator} />
    <Tab.Screen name="Minha Carteira" component={WalletStackNavigator} />
  </Tab.Navigator>
);

// --- NAVEGADOR RAIZ ---
export type RootStackParamList = { ScenarioPicker: undefined; Onboarding: undefined; Login: undefined; OnboardingError: undefined; ConfirmData: undefined; CreatePassword: { userData: User; }; App: undefined; };
const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // 2. ADICIONADO: O SafeAreaProvider envolve todo o aplicativo.
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ScenarioPicker">
            <RootStack.Screen name="ScenarioPicker" component={ScenarioPickerScreen} />
            <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="OnboardingError" component={OnboardingErrorScreen} />
            <RootStack.Screen name="ConfirmData" component={ConfirmDataScreen} />
            <RootStack.Screen name="CreatePassword" component={CreatePasswordScreen} />
            <RootStack.Screen name="App" component={AppTabNavigator} />
          </RootStack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}