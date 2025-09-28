// phases/7_PhaseFinal.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecipientData } from '../Cadastro';

export type PhaseFinalProps = {
  barcodeResult: string;
  recipientData: RecipientData;
  onClose: () => void;
};

const PhaseFinal = ({ barcodeResult, recipientData, onClose }: PhaseFinalProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-done-circle" size={80} color="#4CAF50" />
        </View>
        
        <Text style={styles.title}>Encomenda cadastrada com sucesso!</Text>
        
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Código:</Text>
            <Text style={styles.summaryValue}>{barcodeResult}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Destinatário:</Text>
            <Text style={styles.summaryValue}>{recipientData.nome}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Endereço:</Text>
            <Text style={styles.summaryValue}>{recipientData.endereco}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.finishButton} onPress={onClose}>
          <Text style={styles.finishButtonText}>Voltar ao Início</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  successIcon: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 32,
  },
  summary: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  finishButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PhaseFinal;