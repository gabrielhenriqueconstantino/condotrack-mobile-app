// phases/4_PhaseRecipientOcr.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { RecipientData } from '../OcrCadastro';

export type PhaseRecipientOcrProps = {
  onOcrComplete: (data: RecipientData) => void;
  onClose: () => void;
};

const PhaseRecipientOcr = ({ onOcrComplete, onClose }: PhaseRecipientOcrProps) => {
  useEffect(() => {
    // Simular processamento OCR
    const timer = setTimeout(() => {
      onOcrComplete({ 
        nome: 'João da Silva', 
        endereco: 'Rua Exemplo, 123 - Centro - São Paulo/SP' 
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.title}>Processando OCR...</Text>
        <Text style={styles.subtitle}>
          Estamos extraindo os dados do documento capturado
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default PhaseRecipientOcr;