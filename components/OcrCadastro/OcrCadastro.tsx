// OcrCadastro.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import PhaseBarcode from '../OcrCadastro/phases/1_PhaseBarcode';
import PhaseSuccess from '../OcrCadastro/phases/2_PhaseSuccess';
import PhaseRecipient from '../OcrCadastro/phases/3_PhaseRecipient';
import PhaseRecipientOcr from '../OcrCadastro/phases/4_PhaseRecipientOcr';
import PhaseRecipientSuccess from '../OcrCadastro/phases/5_PhaseRecipientSuccess';
import PhaseConfirm from '../OcrCadastro/phases/6_PhaseConfirm';
import PhaseFinal from '../OcrCadastro/phases/7_PhaseFinal';

export type OcrCadastroPhase = 
  | 'barcode' 
  | 'success' 
  | 'recipient' 
  | 'recipientOcr' 
  | 'recipientSuccess' 
  | 'confirm' 
  | 'final';

export type RecipientData = {
  nome: string;
  endereco: string;
};

export type OcrCadastroProps = {
  onClose: () => void;
};

const OcrCadastro = ({ onClose }: OcrCadastroProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<OcrCadastroPhase>('barcode');
  const [barcodeResult, setBarcodeResult] = useState('');
  const [recipientData, setRecipientData] = useState<RecipientData>({ 
    nome: '', 
    endereco: '' 
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
          <PhaseSuccess
            barcodeResult={barcodeResult}
            onTimeout={() => setPhase('recipient')}
            onClose={onClose}
          />
        );
      
      case 'recipient':
        return (
          <PhaseRecipient
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
            onConfirm={() => setPhase('confirm')}
            onClose={onClose}
          />
        );
      
      case 'confirm':
        return (
          <PhaseConfirm
            barcodeResult={barcodeResult}
            recipientData={recipientData}
            onDataChange={setRecipientData}
            onRegister={() => setPhase('final')}
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

export default OcrCadastro;