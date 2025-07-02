import { View, Text, StyleSheet, TouchableOpacity, Modal, Switch, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, X, Smartphone, Volume2, Clock, Users, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';

interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function NotificationSettingsModal({ visible, onClose }: NotificationSettingsModalProps) {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emotionAlerts, setEmotionAlerts] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [quietHours, setQuietHours] = useState(true);
  const [groupAnalysis, setGroupAnalysis] = useState(false);

  const notificationCategories = [
    {
      title: 'Core Notifications',
      items: [
        {
          icon: Bell,
          title: 'Push Notifications',
          subtitle: 'Enable all app notifications',
          value: pushNotifications,
          onToggle: setPushNotifications,
          color: '#3B82F6'
        },
        {
          icon: TrendingUp,
          title: 'Emotion Alerts',
          subtitle: 'Get notified of significant mood changes',
          value: emotionAlerts,
          onToggle: setEmotionAlerts,
          color: '#10B981'
        },
        {
          icon: Clock,
          title: 'Session Reminders',
          subtitle: 'Remind me to practice emotional awareness',
          value: sessionReminders,
          onToggle: setSessionReminders,
          color: '#F59E0B'
        }
      ]
    },
    {
      title: 'Reports & Analytics',
      items: [
        {
          icon: TrendingUp,
          title: 'Weekly Reports',
          subtitle: 'Receive weekly progress summaries',
          value: weeklyReports,
          onToggle: setWeeklyReports,
          color: '#8B5CF6'
        },
        {
          icon: Users,
          title: 'Group Analysis Updates',
          subtitle: 'Notifications for group session insights',
          value: groupAnalysis,
          onToggle: setGroupAnalysis,
          color: '#06B6D4'
        }
      ]
    },
    {
      title: 'Notification Style',
      items: [
        {
          icon: Volume2,
          title: 'Sound',
          subtitle: 'Play notification sounds',
          value: soundEnabled,
          onToggle: setSoundEnabled,
          color: '#EF4444'
        },
        {
          icon: Smartphone,
          title: 'Vibration',
          subtitle: 'Vibrate for notifications',
          value: vibrationEnabled,
          onToggle: setVibrationEnabled,
          color: '#84CC16'
        },
        {
          icon: Clock,
          title: 'Quiet Hours (10 PM - 8 AM)',
          subtitle: 'Silence notifications during sleep hours',
          value: quietHours,
          onToggle: setQuietHours,
          color: '#6366F1'
        }
      ]
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
            colors={['#3B82F6', '#8B5CF6']}
            style={styles.header}>
            <View style={styles.headerContent}>
              <Bell size={24} color="#ffffff" />
              <Text style={styles.headerTitle}>Notification Settings</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {notificationCategories.map((category, categoryIndex) => (
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

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Smart Notifications</Text>
              <Text style={styles.infoText}>
                vibe AI uses intelligent timing to send notifications when they're most helpful. 
                Emotion alerts are only sent during active conversations to avoid disruption.
              </Text>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={onClose}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.saveButtonGradient}>
                <Text style={styles.saveButtonText}>Save Settings</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});