// App.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import Buttons from './components/Buttons/Buttons';
import OcrCadastro from './components/OcrCadastro/OcrCadastro'; // futuramente você vai criar este componente

export default function App() {
  const [showOcr, setShowOcr] = useState(false);

  // Função disparada ao clicar no botão "Cadastro de encomendas"
  const handleCadastroPress = () => {
    setShowOcr(true);
  };

  // Função para fechar o OCR
  const handleCloseOcr = () => {
    setShowOcr(false);
  };

  if (showOcr) {
    return <OcrCadastro onClose={handleCloseOcr} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao CondoTrack Mobile</Text>
      <Buttons 
        onCadastroPress={handleCadastroPress} 
        onRetiradaPress={() => alert('Funcionalidade de retirada ainda não implementada')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
  },
});
