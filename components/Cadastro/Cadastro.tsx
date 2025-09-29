// OcrCadastro.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
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
    unidade: '', // <- adiciona aqui
    observacoes: '',
  });
  const [loading, setLoading] = useState(false);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Carregando permissões...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.center, { backgroundColor: '#fff', padding: 20 }]}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Permissão da Câmera</Text>
          <Text style={styles.permissionText}>
            Precisamos da sua permissão para acessar a câmera e escanear códigos de barras.
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Conceder Permissão" onPress={requestPermission} />
            <Button title="Fechar" onPress={onClose} color="#666" />
          </View>
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  permissionContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    maxWidth: 350,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
    lineHeight: 22
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
});

export default Cadastro;