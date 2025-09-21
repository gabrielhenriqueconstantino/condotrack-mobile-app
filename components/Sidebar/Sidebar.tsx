// components/Sidebar/Sidebar.tsx
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppScreen } from '../../App';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.8;

export type SidebarProps = {
  visible: boolean;
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onClose: () => void;
};

// ✅ Tipagem dos nomes de ícones válidos
type IoniconName = keyof typeof Ionicons.glyphMap;

type MenuItem = {
  id: AppScreen;
  icon: IoniconName;
  label: string;
  color: string;
};

const Sidebar = ({ visible, currentScreen, onNavigate, onClose }: SidebarProps) => {
  const translateX = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      icon: 'home' as const,
      label: 'Dashboard',
      color: '#4A90E2',
    },
    {
      id: 'cadastro',
      icon: 'document-text' as const,
      label: 'Cadastro',
      color: '#4CAF50',
    },
    {
      id: 'retirada',
      icon: 'exit' as const,
      label: 'Retirada',
      color: '#FF9500',
    },
    {
      id: 'relatorios',
      icon: 'stats-chart' as const,
      label: 'Relatórios',
      color: '#9C27B0',
    },
    {
      id: 'configuracoes',
      icon: 'settings' as const,
      label: 'Configurações',
      color: '#607D8B',
    },
  ];

  if (!visible) return null;

  return (
    <>
      <Animated.View 
        style={[
          styles.sidebar,
          { transform: [{ translateX }] }
        ]}
      >
        <View style={styles.sidebarHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
            <View>
              <Text style={styles.userName}>Administrador</Text>
              <Text style={styles.userRole}>Condomínio Sol Nascente</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                currentScreen === item.id && styles.menuItemActive
              ]}
              onPress={() => onNavigate(item.id)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={22} color="#fff" />
              </View>
              <Text style={[
                styles.menuLabel,
                currentScreen === item.id && styles.menuLabelActive
              ]}>
                {item.label}
              </Text>
              {currentScreen === item.id && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="help-circle" size={22} color="#666" />
            <Text style={styles.footerText}>Ajuda & Suporte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="log-out" size={22} color="#FF3B30" />
            <Text style={[styles.footerText, { color: '#FF3B30' }]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {visible && (
        <TouchableOpacity 
          style={styles.overlay} 
          onPress={onClose}
          activeOpacity={1}
        />
      )}
    </>
  );
};

// ... estilos mantidos como estavam
const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#ffffff',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#666',
  },
  closeButton: {
    padding: 5,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 12,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: '#f8f9fa',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  menuLabelActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  activeIndicator: {
    width: 4,
    height: 40,
    backgroundColor: '#4A90E2',
    borderRadius: 2,
    position: 'absolute',
    right: 10,
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default Sidebar;
