// phases/5_PhaseRecipientSuccess.tsx
import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Easing,
  Platform,
  Dimensions,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RecipientData } from '../Cadastro';

export type PhaseRecipientSuccessProps = {
  recipientData: RecipientData;
  onConfirm: () => void;
  onClose: () => void;
  onEdit: () => void;
};

const { width } = Dimensions.get('window');

const PhaseRecipientSuccess = ({ recipientData, onConfirm, onClose, onEdit }: PhaseRecipientSuccessProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [isEditing, setIsEditing] = useState(false);
  const [editedObservacoes, setEditedObservacoes] = useState(recipientData.observacoes || '');

  useEffect(() => {
    // Animação de entrada em sequência
    Animated.sequence([
      // Animação principal
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.2))
        })
      ]),
      // Animação do checkmark
      Animated.timing(checkmarkScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      // Animação da barra de progresso
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      })
    ]).start();
  }, []);

  const pulseOpacity = progressAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3]
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // Atualiza os dados com as observações editadas
    recipientData.observacoes = editedObservacoes;
    setIsEditing(false);
    
    // Mostra feedback visual
    Alert.alert('Sucesso', 'Observações atualizadas com sucesso!');
  };

  const handleCancelEdit = () => {
    setEditedObservacoes(recipientData.observacoes || '');
    setIsEditing(false);
  };

  const handleBackToEdit = () => {
    Alert.alert(
      'Editar Dados',
      'Deseja voltar para editar todos os dados?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Editar',
          onPress: onEdit
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Confirmação</Text>
          <Text style={styles.headerSubtitle}>Etapa 3 de 3</Text>
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
          {/* Ícone de sucesso com animação */}
          <Animated.View 
            style={[
              styles.successIconContainer,
              {
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['#21D272', '#10B981']}
              style={styles.iconCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View 
                style={{
                  transform: [{ scale: checkmarkScale }]
                }}
              >
                <Ionicons name="checkmark" size={42} color="white" />
              </Animated.View>
            </LinearGradient>
            
            {/* Efeito de pulso ao redor do ícone */}
            <Animated.View 
              style={[
                styles.pulseEffect,
                {
                  opacity: pulseOpacity,
                  transform: [{ scale: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2]
                  }) }]
                }
              ]} 
            />
          </Animated.View>
          
          <Text style={styles.title}>Dados confirmados com sucesso!</Text>
          <Text style={styles.subtitle}>
            Verifique os dados abaixo antes de finalizar o cadastro
          </Text>
          
          {/* Cartão de dados */}
          <View style={styles.dataCard}>
            <LinearGradient
              colors={['#6B46E5', '#8B66EA']}
              style={styles.cardHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="document-text" size={20} color="white" />
              <Text style={styles.cardHeaderText}>Dados do Destinatário</Text>
              
              {/* Botão de editar no header */}
              <TouchableOpacity 
                style={styles.editButton}
                onPress={handleBackToEdit}
              >
                <Ionicons name="create-outline" size={16} color="white" />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            </LinearGradient>
            
            <View style={styles.cardContent}>
              {/* Campo Nome */}
              <View style={styles.dataField}>
                <View style={styles.fieldHeader}>
                  <Ionicons name="person-outline" size={16} color="#6B7280" />
                  <Text style={styles.fieldLabel}>Nome Completo</Text>
                </View>
                <Text style={styles.fieldValue}>{recipientData.nome}</Text>
                <View style={styles.fieldDivider} />
              </View>
              
              {/* Campo Endereço */}
              <View style={styles.dataField}>
                <View style={styles.fieldHeader}>
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text style={styles.fieldLabel}>Endereço</Text>
                </View>
                <Text style={styles.fieldValue}>{recipientData.endereco}</Text>
                <View style={styles.fieldDivider} />
              </View>
              
              {/* Campo Unidade/Bloco */}
              {recipientData.unidade && (
                <View style={styles.dataField}>
                  <View style={styles.fieldHeader}>
                    <Ionicons name="business-outline" size={16} color="#6B7280" />
                    <Text style={styles.fieldLabel}>Unidade/Bloco</Text>
                  </View>
                  <Text style={styles.fieldValue}>{recipientData.unidade}</Text>
                  <View style={styles.fieldDivider} />
                </View>
              )}
              
              {/* Campo Observações */}
              <View style={styles.dataField}>
                <View style={styles.fieldHeader}>
                  <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                  <Text style={styles.fieldLabel}>
                    Observações {!isEditing && (
                      <Text style={styles.optionalText}>(opcional)</Text>
                    )}
                  </Text>
                  
                  {/* Botão de editar observações */}
                  {!isEditing && (
                    <TouchableOpacity 
                      style={styles.editObservacoesButton}
                      onPress={handleEdit}
                    >
                      <Ionicons name="create-outline" size={14} color="#4F46E5" />
                      <Text style={styles.editObservacoesText}>Editar</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                {isEditing ? (
                  <View style={styles.editContainer}>
                    <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                      <Ionicons name="document-text-outline" size={16} color="#6B7280" style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Digite observações adicionais..."
                        placeholderTextColor="#9CA3AF"
                        value={editedObservacoes}
                        onChangeText={setEditedObservacoes}
                        multiline
                        maxLength={256}
                        textAlignVertical="top"
                        autoFocus
                      />
                    </View>
                    <Text style={styles.helperText}>
                      {editedObservacoes.length}/256 caracteres
                    </Text>
                    
                    {/* Botões de ação para edição */}
                    <View style={styles.editActions}>
                      <TouchableOpacity 
                        style={[styles.editActionButton, styles.cancelButton]}
                        onPress={handleCancelEdit}
                      >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.editActionButton, styles.saveButton]}
                        onPress={handleSaveEdit}
                      >
                        <Text style={styles.saveButtonText}>Salvar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <Text style={[
                    styles.fieldValue, 
                    !recipientData.observacoes && styles.emptyObservacoes
                  ]}>
                    {recipientData.observacoes || 'Nenhuma observação adicionada'}
                  </Text>
                )}
              </View>
            </View>
          </View>
          
          {/* Informações adicionais */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#4F46E5" />
            <Text style={styles.infoText}>
              {isEditing 
                ? 'Edite as observações conforme necessário. As alterações serão salvas imediatamente.'
                : 'Os dados serão registrados em nosso sistema e o destinatário será notificado.'
              }
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer com botão de ação */}
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
          style={styles.confirmButton} 
          onPress={onConfirm}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#6B46E5', '#8B66EA']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.confirmButtonText}>Finalizar Cadastro</Text>
            <Ionicons name="checkmark-done" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  successIconContainer: {
    marginTop: 20,
    marginBottom: 24,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#21D272',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2,
  },
  pulseEffect: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(33, 210, 114, 0.2)',
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
    paddingHorizontal: 20,
  },
  dataCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
  },
  cardHeaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  },
  cardContent: {
    padding: 20,
  },
  dataField: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  optionalText: {
    color: '#9CA3AF',
    fontWeight: 'normal',
    textTransform: 'none',
  },
  fieldValue: {
    fontSize: 16,
    color: '#2D2D2D',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
    lineHeight: 22,
    marginBottom: 12,
  },
  emptyObservacoes: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  fieldDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  editObservacoesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  editObservacoesText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  },
  editContainer: {
    marginTop: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  textAreaWrapper: {
    height: 100,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
    paddingVertical: 0,
  },
  textArea: {
    height: '100%',
    textAlignVertical: 'top',
  },
  inputIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  editActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F5FF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#4F46E5',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
    lineHeight: 18,
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
    shadowColor: '#6B46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
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
});

export default PhaseRecipientSuccess;