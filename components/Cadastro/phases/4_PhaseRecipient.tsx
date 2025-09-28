// phases/4_PhaseRecipientOcr.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Animated,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RecipientData } from '../Cadastro';

export type PhaseRecipientOcrProps = {
  onOcrComplete: (data: RecipientData) => void;
  onClose: () => void;
};

const { width } = Dimensions.get('window');

const PhaseRecipientOcr = ({ onOcrComplete, onClose }: PhaseRecipientOcrProps) => {
  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;
  
  const unidades = [
    { id: '1', label: 'Bloco A - Administrativo' },
    { id: '2', label: 'Bloco B - Produção' },
    { id: '3', label: 'Bloco C - Almoxarifado' },
    { id: '4', label: 'Bloco D - Expedição' },
    { id: '5', label: 'Bloco E - Laboratório' },
  ];

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Platform.OS === 'ios' ? Easing.out(Easing.exp) : Easing.out(Easing.cubic)
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Platform.OS === 'ios' ? Easing.out(Easing.exp) : Easing.out(Easing.cubic)
      })
    ]).start();
  }, []);

  const handleConfirm = () => {
    if (!nome || !unidade) return;
    
    onOcrComplete({ 
      nome, 
      endereco: 'Av. Fernando Stecca, 3516 - Iporanga, Sorocaba - SP, 18087-149',
      unidade
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectUnidade = (item: string) => {
    setUnidade(item);
    setIsDropdownOpen(false);
  };

  const isFormValid = nome.trim().length > 0 && unidade.length > 0;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#f8fbff', '#f0f7ff']}
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
        <TouchableOpacity 
          onPress={onClose} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#2D2D2D" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Dados do Destinatário</Text>
          <Text style={styles.headerSubtitle}>Etapa 2 de 3</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            
            {/* Input Nome */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome Completo</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome completo"
                  placeholderTextColor="#9CA3AF"
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Input Endereço (bloqueado) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Endereço</Text>
              <View style={[styles.inputWrapper, styles.disabledInput]}>
                <Ionicons name="location-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.disabledText]}
                  value="Av. Fernando Stecca, 3516 - Iporanga, Sorocaba - SP, 18087-149"
                  editable={false}
                  multiline
                />
                <Ionicons name="lock-closed" size={16} color="#9CA3AF" style={styles.lockIcon} />
              </View>
              <Text style={styles.helperText}>Endereço padrão da empresa</Text>
            </View>

            {/* Dropdown Unidade/Bloco */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Unidade/Bloco</Text>
              <TouchableOpacity 
                style={[styles.inputWrapper, styles.dropdownTrigger]}
                onPress={toggleDropdown}
                activeOpacity={0.8}
              >
                <Ionicons name="business-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <Text style={[styles.input, !unidade && styles.placeholderText]}>
                  {unidade || 'Selecione a unidade/bloco'}
                </Text>
                <Ionicons 
                  name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#6B7280" 
                />
              </TouchableOpacity>

              {isDropdownOpen && (
                <View style={styles.dropdown}>
                  {unidades.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.dropdownItem}
                      onPress={() => selectUnidade(item.label)}
                    >
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                      {unidade === item.label && (
                        <Ionicons name="checkmark" size={18} color="#4F46E5" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Botão de Confirmação */}
      <Animated.View 
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={[styles.confirmButton, !isFormValid && styles.confirmButtonDisabled]} 
          onPress={handleConfirm}
          disabled={!isFormValid}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={isFormValid ? ['#6B46E5', '#8B66EA'] : ['#E5E7EB', '#D1D5DB']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.confirmButtonText, !isFormValid && styles.confirmButtonTextDisabled]}>
              Confirmar Dados
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={isFormValid ? "white" : "#9CA3AF"} 
            />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2D2D',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
  },
  headerPlaceholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  },
  inputContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
    paddingVertical: 0,
  },
  inputIcon: {
    marginRight: 12,
  },
  lockIcon: {
    marginLeft: 8,
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
  },
  disabledText: {
    color: '#6B7280',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
  },
  dropdownTrigger: {
    justifyContent: 'space-between',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#374151',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  confirmButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  confirmButtonDisabled: {
    shadowColor: '#9CA3AF',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  },
  confirmButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default PhaseRecipientOcr;