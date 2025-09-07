// phases/2_PhaseSuccess.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Vibration, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

export type PhaseSuccessProps = {
  barcodeResult: string;
  onTimeout: () => void;
  onClose: () => void;
};

const PhaseSuccess = ({ barcodeResult, onTimeout, onClose }: PhaseSuccessProps) => {
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [scaleAnim] = React.useState(new Animated.Value(0.5));

  useEffect(() => {
    // Forçar modo retrato
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    
    // Vibração leve
    Vibration.vibrate(100);
    
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

    // Timer para próxima fase
    const timer = setTimeout(() => {
      onTimeout();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.successOverlay}>
      <Animated.View style={[
        styles.successContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
        </View>
        <Text style={styles.successTitle}>Tudo certo!</Text>
        <Text style={styles.successSubtitle}>Código de barras identificado com sucesso</Text>
      </Animated.View>
      
      <View style={styles.barcodeResultContainer}>
        <Text style={styles.barcodeLabel}>CÓDIGO IDENTIFICADO:</Text>
        <Text style={styles.barcodeResult}>{barcodeResult}</Text>
      </View>
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={30} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successContainer: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 24,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
    marginBottom: 120,
    width: '90%',
    maxWidth: 400,
  },
  successIconContainer: {
    marginBottom: 25
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  barcodeResultContainer: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
  },
  barcodeLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  barcodeResult: {
    fontSize: 20,
    color: '#4A90E2',
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
});

export default PhaseSuccess;