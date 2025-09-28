// App.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Sidebar from './components/Sidebar/Sidebar';
import Cadastro from './components/Cadastro/Cadastro';
import Dashboard from './components/Dashboard/Dashboard';

export type AppScreen = 'dashboard' | 'cadastro' | 'retirada' | 'relatorios' | 'configuracoes';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('dashboard');
  const [showOcr, setShowOcr] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

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

  if (showOcr) {
    return <Cadastro onClose={handleCloseOcr} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Sidebar
        visible={sidebarVisible}
        currentScreen={currentScreen}
        onNavigate={handleNavigation}
        onClose={() => setSidebarVisible(false)}
      />
      
      <Dashboard
        onMenuPress={() => setSidebarVisible(true)}
        currentScreen={currentScreen}
        onCadastroPress={handleCadastroPress}
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
