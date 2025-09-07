// phases/5_PhaseRecipientSuccess.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecipientData } from '../OcrCadastro';

export type PhaseRecipientSuccessProps = {
  recipientData: RecipientData;
  onConfirm: () => void;
  onClose: () => void;
};

const PhaseRecipientSuccess = ({ recipientData, onConfirm, onClose }: PhaseRecipientSuccessProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dados Extraídos</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>
        
        <Text style={styles.title}>Dados extraídos com sucesso!</Text>
        
        <View style={styles.dataContainer}>
          <View style={styles.dataRow}>
            <Ionicons name="person" size={20} color="#4A90E2" />
            <View style={styles.dataContent}>
              <Text style={styles.dataLabel}>Nome</Text>
              <Text style={styles.dataValue}>{recipientData.nome}</Text>
            </View>
          </View>
          
          <View style={styles.dataRow}>
            <Ionicons name="location" size={20} color="#4A90E2" />
            <View style={styles.dataContent}>
              <Text style={styles.dataLabel}>Endereço</Text>
              <Text style={styles.dataValue}>{recipientData.endereco}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>Confirmar Dados</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerPlaceholder: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  successIcon: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  dataContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dataContent: {
    marginLeft: 15,
    flex: 1,
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dataValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PhaseRecipientSuccess;