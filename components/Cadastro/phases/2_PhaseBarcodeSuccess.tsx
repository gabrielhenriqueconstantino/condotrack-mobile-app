// phases/2_PhaseSuccess.tsx
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  StyleSheet, 
  Vibration, 
  Platform,
  Easing,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { LinearGradient } from 'expo-linear-gradient';

export type PhaseSuccessProps = {
  barcodeResult: string;
  onTimeout: () => void;
  onClose: () => void;
};

const { width, height } = Dimensions.get('window');

const PhaseBarcodeSuccess = ({ barcodeResult, onTimeout, onClose }: PhaseSuccessProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Forçar modo retrato
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    
    // Vibração de confirmação
    Vibration.vibrate([0, 100, 50, 100]);
    
    // Sequência de animações
    Animated.sequence([
      // Animação de entrada do container principal
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        })
      ]),
      // Animação do checkmark
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

    // Animação da barra de progresso
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
      easing: Easing.linear
    }).start();

    // Timer para próxima fase
    const timer = setTimeout(() => {
      onTimeout();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.successOverlay}>
      <LinearGradient
        colors={['#f5f9ff', '#e6f0ff']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Partículas de fundo animadas */}
      <View style={styles.particlesContainer}>
        {[...Array(15)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.4]
                })
              }
            ]}
          />
        ))}
      </View>
      
      <Animated.View style={[
        styles.successContainer,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideUpAnim }
          ]
        }
      ]}>
        <View style={styles.circleBackground}>
          <LinearGradient
            colors={['#21D272', '#20C769']}
            style={styles.gradientCircle}
          >
            <Animated.View style={{ transform: [{ scale: checkScale }] }}>
              <Ionicons name="checkmark" size={60} color="white" />
            </Animated.View>
          </LinearGradient>
        </View>
        
        <Text style={styles.successTitle}>Sucesso!</Text>
        <Text style={styles.successSubtitle}>Código de barras identificado</Text>
        
        {/* Barra de progresso */}
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]} 
          />
        </View>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.barcodeResultContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        <Text style={styles.barcodeLabel}>CÓDIGO IDENTIFICADO:</Text>
        <Text style={styles.barcodeResult}>{barcodeResult}</Text>
      </Animated.View>
      
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={onClose}
        activeOpacity={0.7}
      >
        <Ionicons name="close-circle" size={32} color="#888" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    opacity: 0.4,
  },
  successContainer: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 24,
    backgroundColor: 'white',
    shadowColor: '#21D272',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
    marginBottom: 30,
    width: '90%',
    maxWidth: 400,
  },
  circleBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#21D272',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  progressBarContainer: {
    height: 5,
    width: '100%',
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#21D272',
    borderRadius: 3,
  },
  barcodeResultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    marginTop: 20,
  },
  barcodeLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  barcodeResult: {
    fontSize: 18,
    color: '#1A1A1A',
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
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default PhaseBarcodeSuccess;