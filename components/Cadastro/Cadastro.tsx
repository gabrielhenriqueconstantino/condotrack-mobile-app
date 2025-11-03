// OcrCadastro.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PhaseBarcode from './phases/1_PhaseBarcode';
import PhaseBarcodeSuccess from './phases/2_PhaseBarcodeSuccess';
import PhaseFormLoading from './phases/3_PhaseFormLoading';
import PhaseRecipientOcr from './phases/4_PhaseRecipient'
import PhaseRecipientSuccess from './phases/5_PhaseRecipientSuccess';
import PhaseFinal from './phases/6_PhaseFinal';

export type OcrCadastroPhase = 
  | 'barcode' 
  | 'success' 
  | 'recipient' 
  | 'recipientOcr' 
  | 'recipientSuccess'  
  | 'final';

export type RecipientData = {
  nome: string;
  endereco: string;
  unidade: string;
  observacoes: string;
};

export type OcrCadastroProps = {
  onClose: () => void;
};

const Cadastro = ({ onClose }: OcrCadastroProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<OcrCadastroPhase>('barcode');
  const [barcodeResult, setBarcodeResult] = useState('');
  const [recipientData, setRecipientData] = useState<RecipientData>({ 
    nome: '', 
    endereco: '',
    unidade: '',
    observacoes: '',
  });
  const [loading, setLoading] = useState(false);

  // Animação para a tela de permissão
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    if (!permission?.granted) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        })
      ]).start();
    }
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#f8fbff', '#e8f4ff']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Verificando permissões...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <LinearGradient
          colors={['#f8fbff', '#e8f4ff']}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Permissão Necessária</Text>
        </View>

        <Animated.View 
          style={[
            styles.permissionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Ícone ilustrativo */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              style={styles.iconCircle}
            >
              <Ionicons name="camera" size={40} color="white" />
            </LinearGradient>
          </View>

          <Text style={styles.permissionTitle}>
            Acesso à Câmera
          </Text>
          
          <Text style={styles.permissionSubtitle}>
            Para uma experiência completa de digitalização
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="scan-outline" size={20} color="#4A90E2" />
              <Text style={styles.featureText}>Escaneamento de códigos de barras</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="document-text-outline" size={20} color="#4A90E2" />
              <Text style={styles.featureText}>Reconhecimento de etiquetas</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="flashlight-outline" size={20} color="#4A90E2" />
              <Text style={styles.featureText}>Captura em diferentes condições de luz</Text>
            </View>
          </View>

          <Text style={styles.securityText}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#21D272" />
            {' '}Sua privacidade é importante. A câmera só é usada para digitalização e nenhuma imagem é armazenada.
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={requestPermission}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4A90E2', '#357ABD']}
                style={styles.primaryButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="camera" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Permitir Acesso à Câmera</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Agora Não</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }

  // Renderizar a fase atual
  const renderPhase = () => {
    switch (phase) {
      case 'barcode':
        return (
          <PhaseBarcode
            onBarcodeScanned={(data) => {
              setBarcodeResult(data);
              setPhase('success');
            }}
            onClose={onClose}
          />
        );
      
      case 'success':
        return (
          <PhaseBarcodeSuccess
            barcodeResult={barcodeResult}
            onTimeout={() => setPhase('recipient')}
            onClose={onClose}
          />
        );
      
      case 'recipient':
        return (
          <PhaseFormLoading
            onProcessOcr={() => setPhase('recipientOcr')}
            onClose={onClose}
          />
        );
      
      case 'recipientOcr':
        return (
          <PhaseRecipientOcr
            onOcrComplete={(data) => {
              setRecipientData(data);
              setPhase('recipientSuccess');
            }}
            onClose={onClose}
          />
        );
      
      case 'recipientSuccess':
        return (
          <PhaseRecipientSuccess
            recipientData={recipientData}
            onConfirm={() => setPhase('final')}
            onClose={onClose}
          />
        );
      
      case 'final':
        return (
          <PhaseFinal
            barcodeResult={barcodeResult}
            recipientData={recipientData}
            onClose={onClose}
          />
        );
      
      default:
        return <PhaseBarcode onBarcodeScanned={() => {}} onClose={onClose} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderPhase()}
    </View>
  );
};

// Adicione o TouchableOpacity se ainda não estiver importado
import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  permissionScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D2D',
  },
  permissionContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 25,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 8,
  },
  permissionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  featuresList: {
    width: '100%',
    marginBottom: 25,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    borderRadius: 10,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  securityText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 30,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(33, 210, 114, 0.05)',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#21D272',
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: 'white',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Cadastro;