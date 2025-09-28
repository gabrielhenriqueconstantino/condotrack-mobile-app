// phases/1_PhaseBarcode.tsx
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, PanResponder, StyleSheet, Dimensions } from 'react-native';
import { CameraView, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width, height } = Dimensions.get('window');

export type PhaseBarcodeProps = {
  onBarcodeScanned: (data: string) => void;
  onClose: () => void;
};

const PhaseBarcode = ({ onBarcodeScanned, onClose }: PhaseBarcodeProps) => {
  const [scanLinePos] = useState(new Animated.Value(0));
  const [scanAreaSize, setScanAreaSize] = useState({ width: 250, height: 200 });
  const [isLandscape, setIsLandscape] = useState(false);
  
  // Alteração 1: Substitui 'flashMode' por 'isTorchOn'
  const [isTorchOn, setIsTorchOn] = useState(false);
  
  const [scanned, setScanned] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const scaleFactor = 2;
        const newWidth = Math.max(150, Math.min(350, scanAreaSize.width + gestureState.dx * scaleFactor));
        const newHeight = Math.max(120, Math.min(280, scanAreaSize.height + gestureState.dy * scaleFactor));
        setScanAreaSize({ width: newWidth, height: newHeight });
      },
    })
  ).current;

  // Animação da linha de scanner
  React.useEffect(() => {
    const animateScanLine = () => {
      scanLinePos.setValue(0);
      Animated.timing(scanLinePos, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        if (!scanned) animateScanLine();
      });
    };
    
    if (!scanned) {
      animateScanLine();
    }
    
    return () => {
      scanLinePos.stopAnimation();
    };
  }, [scanned, scanLinePos]);

  const toggleOrientation = async () => {
    if (isLandscape) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      setIsLandscape(false);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setIsLandscape(true);
    }
  };

  // Alteração 2: A função agora alterna o estado booleano
  const toggleTorch = () => {
    setIsTorchOn(prev => !prev);
  };

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    
    setScanned(true);
    onBarcodeScanned(data);
  };

  return (
    <CameraView
      style={StyleSheet.absoluteFill}
      onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      // Alteração 3: Use a propriedade 'enableTorch' com o estado booleano
      enableTorch={isTorchOn}
    >
      <View style={styles.overlay}>
        {/* Indicador de fase */}
        <View style={styles.phaseIndicator}>
          <View style={[styles.phaseDot, styles.phaseDotActive]}>
            <Text style={styles.phaseText}>1</Text>
          </View>
          <View style={styles.phaseLine} />
          <View style={styles.phaseDot}>
            <Text style={styles.phaseText}>2</Text>
          </View>
          <View style={styles.phaseLine} />
          <View style={styles.phaseDot}>
            <Text style={styles.phaseText}>3</Text>
          </View>
        </View>
        
        {/* Controles de câmera */}
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.cameraControlButton} onPress={toggleOrientation}>
            <Ionicons name={isLandscape ? "phone-portrait" : "phone-landscape"} size={24} color="white" />
            <Text style={styles.cameraControlText}>
              {isLandscape ? "Retrato" : "Paisagem"}
            </Text>
          </TouchableOpacity>
          
          {/* Alteração 4: Chamar a nova função toggleTorch e ajustar o ícone */}
          <TouchableOpacity style={styles.cameraControlButton} onPress={toggleTorch}>
            <Ionicons name={isTorchOn ? "flash" : "flash-off"} size={24} color="white" />
            <Text style={styles.cameraControlText}>
              {isTorchOn ? "Desligar" : "Ligar"}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.top} />
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
            
            {/* Indicadores de redimensionamento */}
            <View style={styles.resizeHandleTop} />
            <View style={styles.resizeHandleBottom} />
            <View style={styles.resizeHandleLeft} />
            <View style={styles.resizeHandleRight} />
          </View>
          <View style={styles.side} />
        </View>
        <View style={styles.bottom}>
          <Text style={styles.scanInstruction}>Posicione o código de barras dentro do quadro</Text>
          <Text style={styles.resizeInstruction}>Toque e arraste para ajustar o tamanho da área</Text>
          
          <TouchableOpacity style={styles.closeButtonOverlay} onPress={onClose}>
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </CameraView>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex: 1 
  },
  phaseIndicator: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  phaseDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  phaseDotActive: {
    backgroundColor: '#4A90E2'
  },
  phaseText: {
    color: 'white',
    fontWeight: 'bold'
  },
  phaseLine: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 5
  },
  cameraControls: {
    position: 'absolute',
    top: 110,
    left: 20,
    zIndex: 10,
    flexDirection: 'row',
    gap: 15
  },
  cameraControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20
  },
  cameraControlText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 12
  },
  top: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },
  middle: { 
    flexDirection: 'row',
    height: 220
  },
  side: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },
  focusedContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scanLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#4A90E2',
    position: 'absolute'
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4A90E2'
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4A90E2'
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4A90E2'
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4A90E2'
  },
  resizeHandleTop: {
    position: 'absolute',
    top: -10,
    left: '50%',
    width: 40,
    height: 6,
    backgroundColor: '#4A90E2',
    borderRadius: 3,
    marginLeft: -20
  },
  resizeHandleBottom: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    width: 40,
    height: 6,
    backgroundColor: '#4A90E2',
    borderRadius: 3,
    marginLeft: -20
  },
  resizeHandleLeft: {
    position: 'absolute',
    left: -10,
    top: '50%',
    width: 6,
    height: 40,
    backgroundColor: '#4A90E2',
    borderRadius: 3,
    marginTop: -20
  },
  resizeHandleRight: {
    position: 'absolute',
    right: -10,
    top: '50%',
    width: 6,
    height: 40,
    backgroundColor: '#4A90E2',
    borderRadius: 3,
    marginTop: -20
  },
  bottom: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  scanInstruction: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10
  },
  resizeInstruction: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20
  },
  closeButtonOverlay: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 5
  },
});

export default PhaseBarcode;
