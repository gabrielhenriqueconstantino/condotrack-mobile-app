// phases/3_PhaseRecipient.tsx
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing,
  Platform,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export type PhaseRecipientProps = {
  onProcessOcr: () => void;
  onClose: () => void;
};

const { width, height } = Dimensions.get('window');

const PhaseRecipient = ({ onProcessOcr, onClose }: PhaseRecipientProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5))
      })
    ]).start();

    // Animação da barra de progresso
    Animated.timing(progressWidth, {
      toValue: width * 0.7,
      duration: 3500,
      useNativeDriver: false,
      easing: Easing.linear
    }).start();

    // Temporizador para avançar automaticamente após 3.5 segundos
    const timer = setTimeout(() => {
      // Animação de confirmação antes de avançar
      Animated.sequence([
        Animated.timing(checkmarkOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.delay(500)
      ]).start(() => {
        onProcessOcr();
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f5f9ff', '#e6f0ff']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Destinatário</Text>
          <Text style={styles.headerSubtitle}>Etapa 2 de 3</Text>
        </View>
      </Animated.View>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        {/* Indicador de progresso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: progressWidth }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>Preparando formulário...</Text>
        </View>

        {/* Conteúdo principal */}
        <View style={styles.messageContainer}>
          <Animated.View 
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: iconScale }]
              }
            ]}
          >
            <LinearGradient
              colors={['#6B46E5', '#8B66EA']}
              style={styles.iconCircle}
            >
              <Ionicons name="person" size={36} color="white" />
              <Animated.View 
                style={[
                  styles.checkmarkContainer,
                  { opacity: checkmarkOpacity }
                ]}
              >
                <Ionicons name="checkmark-circle" size={24} color="#21D272" style={styles.checkmark} />
              </Animated.View>
            </LinearGradient>
          </Animated.View>
          
          <Text style={styles.title}>Dados do Destinatário</Text>
          <Text style={styles.subtitle}>
            Em instantes, você será direcionado para preencher as informações do destinatário
          </Text>
        </View>

        {/* Loading animation */}
        <View style={styles.loadingDots}>
          <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View 
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        <Text style={styles.footerText}>
          Sistema de coleta de dados automatizado
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D2D2D',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 60,
  },
  progressBackground: {
    width: width * 0.7,
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6B46E5',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    width: '100%',
  },
  iconContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6B46E5',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  checkmark: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6B46E5',
    marginHorizontal: 6,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
  },
});

export default PhaseRecipient;