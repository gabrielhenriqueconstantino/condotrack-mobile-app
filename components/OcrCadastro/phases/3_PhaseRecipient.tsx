// phases/3_PhaseRecipient.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type PhaseRecipientProps = {
  onProcessOcr: () => void;
  onClose: () => void;
};

const PhaseRecipient = ({ onProcessOcr, onClose }: PhaseRecipientProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Destinatário</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.phaseIndicator}>
          <View style={[styles.phaseDot, styles.phaseDotCompleted]}>
            <Ionicons name="checkmark" size={20} color="white" />
          </View>
          <View style={styles.phaseLineCompleted} />
          <View style={[styles.phaseDot, styles.phaseDotActive]}>
            <Text style={styles.phaseText}>2</Text>
          </View>
          <View style={styles.phaseLine} />
          <View style={styles.phaseDot}>
            <Text style={styles.phaseText}>3</Text>
          </View>
        </View>

        <View style={styles.instructionContainer}>
          <Ionicons name="document-text" size={60} color="#4A90E2" style={styles.icon} />
          <Text style={styles.title}>Capture os dados do destinatário</Text>
          <Text style={styles.subtitle}>
            Posicione o documento dentro do quadro da câmera para capturar automaticamente os dados
          </Text>
        </View>

        <TouchableOpacity style={styles.processButton} onPress={onProcessOcr}>
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.processButtonText}>Capturar Documento</Text>
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
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  phaseDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseDotCompleted: {
    backgroundColor: '#4CAF50',
  },
  phaseDotActive: {
    backgroundColor: '#4A90E2',
  },
  phaseText: {
    color: 'white',
    fontWeight: 'bold',
  },
  phaseLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  phaseLineCompleted: {
    width: 40,
    height: 2,
    backgroundColor: '#4CAF50',
    marginHorizontal: 5,
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  processButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    gap: 10,
  },
  processButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PhaseRecipient;