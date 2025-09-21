// components/Buttons/Buttons.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ButtonsProps = {
  onCadastroPress: () => void;
  onRetiradaPress: () => void;
};

const Buttons = ({ onCadastroPress, onRetiradaPress }: ButtonsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onCadastroPress}>
        <View style={[styles.buttonIcon, { backgroundColor: '#4CAF50' }]}>
          <Ionicons name="add-circle" size={24} color="#fff" />
        </View>
        <Text style={styles.buttonText}>Cadastro de Encomendas</Text>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onRetiradaPress}>
        <View style={[styles.buttonIcon, { backgroundColor: '#FF9500' }]}>
          <Ionicons name="exit" size={24} color="#fff" />
        </View>
        <Text style={styles.buttonText}>Retirada de Encomendas</Text>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default Buttons;