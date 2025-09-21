// phases/4_PhaseRecipientOcr.tsx
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, PanResponder, StyleSheet, Dimensions, Vibration, ActivityIndicator, Alert } from 'react-native';
import { CameraView, type CameraCapturedPicture } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { RecipientData } from '../OcrCadastro';

const { width, height } = Dimensions.get('window');
const CAPTURE_AREA_WIDTH = 300;
const CAPTURE_AREA_HEIGHT = 200;

export type PhaseRecipientOcrProps = {
  onOcrComplete: (data: RecipientData) => void;
  onClose: () => void;
};

// Simulador de OCR para desenvolvimento (substituir por Tesseract/ML Kit em produção)
const simulateAdvancedOCR = (): RecipientData => {
  const samples = [
    {
      nome: "JOÃO CARLOS SILVA",
      endereco: "RUA DAS FLORES, 123 - APTO 101 - CENTRO - SÃO PAULO/SP"
    },
    {
      nome: "MARIA SANTOS OLIVEIRA",
      endereco: "AVENIDA BRASIL, 456 - BLOCO B - COPACABANA - RIO DE JANEIRO/RJ"
    },
    {
      nome: "PEDRO ALMEIDA COSTA",
      endereco: "TRAVESSA DA PAZ, 789 - JARDIM AMÉRICA - BELO HORIZONTE/MG"
    },
    {
      nome: "ANA CAROLINA PEREIRA",
      endereco: "ALAMEDA SANTOS, 1001 - CONJUNTO 205 - PARAÍSO - SÃO PAULO/SP"
    },
    {
      nome: "CARLOS EDUARDO LIMA",
      endereco: "RUA PRINCIPAL, 55 - VILA NOVA - PORTO ALEGRE/RS"
    }
  ];
  
  return samples[Math.floor(Math.random() * samples.length)];
};

// Algoritmo avançado para análise de texto de etiquetas
const analyzePackageLabel = (text: string): RecipientData => {
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 2 && !line.match(/^\d+$/) && !line.match(/^[A-Z]{2}$/));
  
  console.log('Texto analisado:', lines);
  
  let nome: string = '';
  let endereco: string = '';
  let nomeCandidates: string[] = [];
  let addressCandidates: string[] = [];


  // Padrões comuns em etiquetas de encomenda
  const namePatterns = [
    /^[A-ZÀ-Ú\s]{5,}$/,
    /^(SR|SRA|SRTA|DR|DRA)\.?\s+[A-ZÀ-Ú\s]{3,}$/i,
    /^[A-Z][a-zà-ú]+\s+[A-Z][a-zà-ú]+(\s+[A-Z][a-zà-ú]+)*$/
  ];

  const addressPatterns = [
    /(RUA|AVENIDA|AV|ALAMEDA|AL|TRAVESSA|TV|RODOVIA|ROD|ESTRADA|EST)\.?\s+[A-ZÀ-Ú\s]+,?\s*\d+/i,
    /^\d+\s*[-–]?\s*[A-ZÀ-Ú\s]+/,
    /(APTO|APARTAMENTO|BLOCO|BL|CASA|LOTE|CONJUNTO|CJ|SALA|ANDAR)\.?\s*[A-Z0-9]+/i,
    /(CENTRO|VILA|JARDIM|PARQUE|DISTRITO|BAIRRO|ZONA)\s+[A-ZÀ-Ú]+/i,
    /[A-Z]{2}\s*\/\s*[A-Z]{2}/,
    /CEP\s*:?\s*\d{5}-?\d{3}/
  ];

  // Classificar linhas
  lines.forEach(line => {
    // Verificar se é nome
    const isName = namePatterns.some(pattern => pattern.test(line)) || 
                  (line.split(' ').length >= 2 && line.split(' ').length <= 4);
    
    // Verificar se é endereço
    const isAddress = addressPatterns.some(pattern => pattern.test(line)) ||
                     line.includes(',') ||
                     line.match(/\d+/) ||
                     line.length > 30;

    if (isName && !isAddress) {
      nomeCandidates.push(line);
    } else if (isAddress) {
      addressCandidates.push(line);
    }
  });

  // Processar nome
  if (nomeCandidates.length > 0) {
    nome = nomeCandidates[0]
      .replace(/^(SR|SRA|SRTA|DR|DRA)\.?\s+/i, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Processar endereço
  if (addressCandidates.length > 0) {
    endereco = addressCandidates
      .join(', ')
      .replace(/\s+/g, ' ')
      .replace(/,\s*,/g, ',')
      .replace(/\bCEP[:]?\s*\d{5}-?\d{3}\b/i, '')
      .replace(/\s*-\s*\w{2}$/, '')
      .trim();
  }

  // Fallback inteligente
  if (!nome && lines.length > 0) {
    // Primeira linha provavelmente é o nome
    nome = lines[0].trim();
  }

  if (!endereco && lines.length > 1) {
    // Restante é provavelmente endereço
    endereco = lines.slice(1).join(', ').trim();
  }

  console.log('Dados extraídos:', { nome, endereco });
  
  return { nome: nome || 'Nome não identificado', endereco: endereco || 'Endereço não identificado' };
};

const PhaseRecipientOcr = ({ onOcrComplete, onClose }: PhaseRecipientOcrProps) => {
  const [scanLinePos] = useState(new Animated.Value(0));
  const [scanAreaSize, setScanAreaSize] = useState({ width: CAPTURE_AREA_WIDTH, height: CAPTURE_AREA_HEIGHT });
  const [isLandscape, setIsLandscape] = useState(false);
  
  // Alteração 1: Substituição de flashMode por isTorchOn
  const [isTorchOn, setIsTorchOn] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('Posicionando a etiqueta...');
  const cameraRef = useRef<CameraView>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const dx = Math.abs(gestureState.dx);
        const dy = Math.abs(gestureState.dy);
        return dx > 2 || dy > 2;
      },
      onPanResponderMove: (evt, gestureState) => {
        const scaleFactor = 2;
        const newWidth = Math.max(200, Math.min(400, scanAreaSize.width + gestureState.dx * scaleFactor));
        const newHeight = Math.max(150, Math.min(300, scanAreaSize.height + gestureState.dy * scaleFactor));
        setScanAreaSize({ width: newWidth, height: newHeight });
      },
    })
  ).current;

  // Animação da linha de scanner
  useEffect(() => {
    const animateScanLine = () => {
      scanLinePos.setValue(0);
      Animated.timing(scanLinePos, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        if (!isProcessing) animateScanLine();
      });
    };
    
    if (!isProcessing) {
      animateScanLine();
    }
    
    return () => {
      scanLinePos.stopAnimation();
    };
  }, [isProcessing, scanLinePos]);

  const toggleOrientation = async () => {
    if (isLandscape) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      setIsLandscape(false);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setIsLandscape(true);
    }
  };

  // Alteração 2: A nova função para alternar a tocha
  const toggleTorch = () => {
    setIsTorchOn(prev => !prev);
  };

  const captureLabel = async () => {
    if (!cameraRef.current || isProcessing) return;
    
    setIsProcessing(true);
    setOcrStatus('Capturando imagem...');
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: true,
        skipProcessing: true,
        exif: false
      });

      setOcrStatus('Processando imagem...');

      const cropRegion = {
        originX: (width - scanAreaSize.width) / 2,
        originY: (height - scanAreaSize.height) / 2 - 100,
        width: scanAreaSize.width,
        height: scanAreaSize.height
      };

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          { crop: cropRegion },
          { rotate: 0 },
          { flip: ImageManipulator.FlipType.Vertical },
        ],
        { 
          compress: 0.8, 
          format: ImageManipulator.SaveFormat.JPEG, 
          base64: true 
        }
      );

      setOcrStatus('Analisando texto...');

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const ocrResult = simulateAdvancedOCR();
      
      const extractedData = analyzePackageLabel(
        `${ocrResult.nome}\n${ocrResult.endereco}\n${Math.random().toString(36).substring(7)}`
      );

      setOcrStatus('Dados extraídos!');

      Vibration.vibrate(100);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onOcrComplete(extractedData);
      
    } catch (error) {
      console.error('Erro no processamento da etiqueta:', error);
      setOcrStatus('Erro ao processar');
      
      Alert.alert(
        'Erro',
        'Não foi possível processar a etiqueta. Verifique a iluminação e tente novamente.',
        [{ text: 'OK', onPress: () => setIsProcessing(false) }]
      );
    }
  };

  const handleManualEntry = () => {
    Alert.alert(
      'Entrada Manual',
      'Deseja inserir os dados manualmente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Inserir Manualmente', 
          onPress: () => onOcrComplete({ nome: '', endereco: '' })
        }
      ]
    );
  };

  return (
    <CameraView
      ref={cameraRef}
      style={StyleSheet.absoluteFill}
      // Alteração 3: Use 'enableTorch' com o estado booleano
      enableTorch={isTorchOn}
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Leitura da Etiqueta</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Instruções */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Posicione a etiqueta da encomenda dentro do quadro
          </Text>
          <Text style={styles.statusText}>{ocrStatus}</Text>
        </View>

        {/* Área de captura */}
        <View style={styles.middle}>
          <View style={styles.side} />
          <View 
            style={[styles.focusedContainer, { width: scanAreaSize.width, height: scanAreaSize.height }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <Animated.View 
              style={[
                styles.scanLine,
                {
                  transform: [{
                    translateY: scanLinePos.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, scanAreaSize.height]
                    })
                  }]
                }
              ]} 
            />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
            
            <View style={styles.resizeHandleTop} />
            <View style={styles.resizeHandleBottom} />
            <View style={styles.resizeHandleLeft} />
            <View style={styles.resizeHandleRight} />
          </View>
          <View style={styles.side} />
        </View>

        {/* Controles */}
        <View style={styles.bottomControls}>
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleOrientation}>
              <Ionicons name={isLandscape ? "phone-portrait" : "phone-landscape"} size={24} color="white" />
            </TouchableOpacity>
            
            {/* Alteração 4: Chamar a nova função toggleTorch e ajustar o ícone */}
            <TouchableOpacity style={styles.controlButton} onPress={toggleTorch}>
              <Ionicons name={isTorchOn ? "flash" : "flash-off"} size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.mainControls}>
            <TouchableOpacity 
              style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]} 
              onPress={captureLabel}
              disabled={isProcessing}
            >
              <Ionicons name="camera" size={32} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.manualButton} onPress={handleManualEntry}>
              <Text style={styles.manualButtonText}>Inserir Manualmente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Overlay de processamento */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.processingText}>{ocrStatus}</Text>
          </View>
        </View>
      )}
    </CameraView>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  instructionContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  statusText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
  },
  middle: { 
    flexDirection: 'row',
    height: height * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  side: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)' 
  },
  focusedContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.8)',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  scanLine: {
    height: 3,
    width: '100%',
    backgroundColor: '#4A90E2',
    position: 'absolute',
    opacity: 0.8,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 25,
    height: 25,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4A90E2',
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 25,
    height: 25,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4A90E2',
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 25,
    height: 25,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4A90E2',
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 25,
    height: 25,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4A90E2',
    borderBottomRightRadius: 8,
  },
  resizeHandleTop: {
    position: 'absolute',
    top: -12,
    left: '50%',
    width: 40,
    height: 6,
    backgroundColor: '#4A90E2',
    borderRadius: 3,
    marginLeft: -20,
  },
  resizeHandleBottom: {
    position: 'absolute',
    bottom: -12,
    left: '50%',
    width: 40,
    height: 6,
    backgroundColor: '#4A90E2',
    borderRadius: 3,
    marginLeft: -20,
  },
  resizeHandleLeft: {
    position: 'absolute',
    left: -12,
    top: '50%',
    width: 6,
    height: 40,
    backgroundColor: '#4A90E2',
    borderRadius: 3,
    marginTop: -20,
  },
  resizeHandleRight: {
    position: 'absolute',
    right: -12,
    top: '50%',
    width: 6,
    height: 40,
    backgroundColor: '#4A90E2',
    borderRadius: 3,
    marginTop: -20,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainControls: {
    alignItems: 'center',
    gap: 15,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  captureButtonDisabled: {
    backgroundColor: '#999',
  },
  manualButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  manualButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  processingContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    minWidth: 200,
  },
  processingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default PhaseRecipientOcr;