// App.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Sidebar from './components/Sidebar/Sidebar';
import Cadastro from './components/Cadastro/Cadastro';
import Dashboard from './components/Dashboard/Dashboard';
import LoadingScreen from './components/Loading/LoadingScreen'
import LoginScreen from './components/Login/LoginScreen';

export type AppScreen = 'dashboard' | 'cadastro' | 'retirada' | 'relatorios' | 'configuracoes';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ nome: string; condominio: string } | null>(null); // 👈 novo estado
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('dashboard');
  const [showOcr, setShowOcr] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleLoadingComplete = () => setIsLoading(false);

  // Funções para o fluxo de loading e login

  const handleLoginSuccess = (userData: { nome: string; condominio: string }) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);          // Limpa usuário
    setCurrentScreen('dashboard');
    setShowOcr(false);
    setSidebarVisible(false);
  };


  // Funções existentes do app
  const handleCadastroPress = () => {
    setShowOcr(true);
  };

  const handleCloseOcr = () => {
    setShowOcr(false);
  };

  const handleNavigation = (screen: AppScreen) => {
    setCurrentScreen(screen);
    setSidebarVisible(false);
    
    if (screen === 'cadastro') {
      setShowOcr(true);
    }
  };

  // Tela de Loading
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  // Tela de Login
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Fluxo do OCR (Cadastro) - Mantém a mesma lógica
  if (showOcr) {
    return <Cadastro onClose={handleCloseOcr} />;
  }

  // App Principal (após login)
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Sidebar
        visible={sidebarVisible}
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onClose={() => setSidebarVisible(false)}
        user={user} // 👈 Passa o usuário para o Sidebar
        onLogout={handleLogout}
      />
      
      <Dashboard
        onMenuPress={() => setSidebarVisible(true)}
        currentScreen={currentScreen}
        onCadastroPress={handleCadastroPress}
       // onLogout={handleLogout} // Adicione esta prop ao Dashboard se necessário
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});