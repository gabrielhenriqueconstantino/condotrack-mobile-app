// components/LoadingScreen.tsx
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Animated, 
  StyleSheet, 
  Dimensions,
  Easing 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export type LoadingScreenProps = {
  onLoadingComplete: () => void;
};

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      })
    ]).start();

    // Animação de rotação do logo
    Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear
      })
    ).start();

    // Animação da barra de progresso
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic)
    }).start();

    // Timer para completar o loading
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#283593', '#303f9f']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Partículas de fundo */}
      <View style={styles.particles}>
        {[...Array(8)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.6]
                })
              }
            ]}
          />
        ))}
      </View>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Logo animada */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [{ rotate: rotateInterpolate }]
            }
          ]}
        >
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.logoCircle}
          >
            <Ionicons name="scan" size={40} color="white" />
          </LinearGradient>
        </Animated.View>

        <Text style={styles.title}>ScanExpress</Text>
        <Text style={styles.subtitle}>Sistema de Gestão de Encomendas</Text>

        {/* Barra de progresso */}
        <View style={styles.progressContainer}>
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

        <Text style={styles.loadingText}>Carregando sistema...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A90E2',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  progressContainer: {
    width: width * 0.6,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});

export default LoadingScreen;