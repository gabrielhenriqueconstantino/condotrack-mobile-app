// Buttons.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

type ButtonsProps = {
  onCadastroPress?: () => void;
  onRetiradaPress?: () => void;
};

export default function Buttons({ onCadastroPress, onRetiradaPress }: ButtonsProps) {
  return (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity style={styles.button} onPress={onCadastroPress}>
        <View style={[styles.circle, styles.plusCircle]}>
          <Text style={styles.plusText}>+</Text>
        </View>
        <Text style={styles.buttonLabel}>Cadastro de Encomendas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onRetiradaPress}>
        <View style={styles.circle}>
          <FontAwesome5 name="box" size={24} color="#fff" />
        </View>
        <Text style={styles.buttonLabel}>Retirada de Encomendas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
  },
  button: {
    alignItems: 'center',
    width: 140,
    height: 140,
    backgroundColor: '#00d1b2', // verde-ciano
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#00bfa5',
    justifyContent: 'center',
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  plusCircle: {
    // adicional, se quiser diferenciar o círculo do +
  },
  plusText: {
    fontSize: 40,
    color: '#fff',
    lineHeight: 40,
    textAlign: 'center',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
});
