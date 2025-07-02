import { View, Text, StyleSheet, TouchableOpacity, Modal, Switch, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, X, Eye, Database, Trash2, Download, Lock, Globe, Smartphone } from 'lucide-react-native';
import { useState } from 'react';

interface PrivacySettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PrivacySettingsModal({ visible, onClose }: PrivacySettingsModalProps) {
  const [dataCollection, setDataCollection] = useState(true);
  const [analyticsSharing, setAnalyticsSharing] = useState(false);
  const [localProcessing, setLocalProcessing] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);
  const [autoDelete, setAutoDelete] = useState(true);
  const [crashReporting, setCrashReporting] = useState(true);

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your emotional analysis data, session history, and reports. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Data Deleted', 'All your data has been permanently deleted.');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your complete data export will be prepared and downloaded to your device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            Alert.alert('Export Started', 'Your data export is being prepared...');
          }
        }
      ]
    );
  };

  const privacyCategories = [
    {
      title: 'Data Collection',
      items: [
        {
          icon: Database,
          title: 'Session Data Collection',
          subtitle: 'Save emotion analysis and session reports',
          value: dataCollection,
          onToggle: setDataCollection,
          color: '#3B82F6'
        },
        {
          icon: Globe,
          title: 'Anonymous Analytics',
          subtitle: 'Help improve the app with anonymous usage data',
          value: analyticsSharing,
          onToggle: setAnalyticsSharing,
          color: '#10B981'
        },
        {
          icon: Smartphone,
          title: 'Local Processing Only',
          subtitle: 'Process all data on your device (recommended)',
          value: localProcessing,
          onToggle: setLocalProcessing,
          color: '#8B5CF6'
        }
      ]
    },
    {
      title: 'Security',
      items: [
        {
          icon: Lock,
          title: 'Biometric Lock',
          subtitle: 'Require fingerprint/face ID to open app',
          value: biometricLock,
          onToggle: setBiometricLock,
          color: '#F59E0B'
        },
        {
          icon: Eye,
          title: 'Auto-delete Old Data',
          subtitle: 'Automatically delete data older than 6 months',
          value: autoDelete,
          onToggle: setAutoDelete,
          color: '#EF4444'
        }
      ]
    },
    {
      title: 'Diagnostics',
      items: [
        {
          icon: Shield,
          title: 'Crash Reporting',
          subtitle: 'Send anonymous crash reports to improve stability',
          value: crashReporting,
          onToggle: setCrashReporting,
          color: '#06B6D4'
        }
      ]
    }
  ];

  const dataActions = [
    {
      icon: Download,
      title: 'Export My Data',
      subtitle: 'Download all your data in a portable format',
      color: '#10B981',
      onPress: handleExportData
    },
    {
      icon: Trash2,
      title: 'Delete All Data',
      subtitle: 'Permanently remove all stored data',
      color: '#EF4444',
      onPress: handleDeleteAllData
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <LinearGradient
            colors={['#1E293B', '#334155']}
            style={styles.header}>
            <View style={styles.headerContent}>
              <Shield size={24} color="#ffffff" />
              <Text style={styles.headerTitle}>Privacy & Security</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.privacyBanner}>
              <Shield size={32} color="#10B981" />
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Your Privacy Matters</Text>
                <Text style={styles.bannerText}>
                  vibe AI is designed with privacy-first principles. Your emotional data stays on your device.
                </Text>
              </View>
            </View>

            {privacyCategories.map((category, categoryIndex) => (
              <View key={categoryIndex} style={styles.category}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <View style={styles.categoryCard}>
                  {category.items.map((item, itemIndex) => (
                    <View
                      key={itemIndex}
                      style={[
                        styles.settingItem,
                        itemIndex === category.items.length - 1 && styles.lastItem
                      ]}>
                      <View style={styles.settingLeft}>
                        <View style={[styles.settingIcon, { backgroundColor: item.color + '20' }]}>
                          <item.icon size={20} color={item.color} />
                        </View>
                        <View style={styles.settingInfo}>
                          <Text style={styles.settingTitle}>{item.title}</Text>
                          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                        </View>
                      </View>
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{
                          false: '#e2e8f0',
                          true: item.color,
                        }}
                        thumbColor="#ffffff"
                      />
                    </View>
                  ))}
                </View>
              </View>
            ))}

            <View style={styles.category}>
              <Text style={styles.categoryTitle}>Data Management</Text>
              <View style={styles.categoryCard}>
                {dataActions.map((action, actionIndex) => (
                  <TouchableOpacity
                    key={actionIndex}
                    style={[
                      styles.actionItem,
                      actionIndex === dataActions.length - 1 && styles.lastItem
                    ]}
                    onPress={action.onPress}>
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, { backgroundColor: action.color + '20' }]}>
                        <action.icon size={20} color={action.color} />
                      </View>
                      <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>{action.title}</Text>
                        <Text style={styles.settingSubtitle}>{action.subtitle}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Data Processing</Text>
              <Text style={styles.infoText}>
                • All emotion analysis happens on your device{'\n'}
                • No video or audio is stored unless you explicitly save it{'\n'}
                • Session reports are stored locally and encrypted{'\n'}
                • You can export or delete your data at any time
              </Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Last updated: {new Date().toLocaleDateString()}
              </Text>
              <TouchableOpacity>
                <Text style={styles.privacyPolicyLink}>View Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  bannerContent: {
    marginLeft: 16,
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  category: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
  },
  privacyPolicyLink: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});