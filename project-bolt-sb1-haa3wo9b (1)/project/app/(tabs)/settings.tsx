import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bell, Shield, Zap, Mic, Camera, Vibrate, Eye, Crown, Download, CircleHelp as HelpCircle, Star, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { ExportModal } from '@/components/ExportModal';
import { NotificationSettingsModal } from '@/components/NotificationSettingsModal';
import { PrivacySettingsModal } from '@/components/PrivacySettingsModal';
import { SupportModal } from '@/components/SupportModal';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [voiceAnalysis, setVoiceAnalysis] = useState(true);
  const [stealthMode, setStealthMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleDataExport = () => {
    setShowExportModal(true);
  };

  const handleNotificationSettings = () => {
    setShowNotificationModal(true);
  };

  const handlePrivacySettings = () => {
    setShowPrivacyModal(true);
  };

  const handleSupport = () => {
    setShowSupportModal(true);
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate vibe AI',
      'Thank you for using vibe AI! Your feedback helps us improve the app for everyone.',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Rate 5 Stars ⭐', onPress: () => Alert.alert('Thank You!', 'Redirecting to app store...') }
      ]
    );
  };

  const handleUpgradeToPro = () => {
    Alert.alert(
      'Upgrade to vibe AI Pro',
      'Unlock advanced features:\n\n• Unlimited emotion analysis\n• Advanced voice tone detection\n• Detailed session reports\n• Priority support\n• Export to multiple formats',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Upgrade Now', onPress: () => Alert.alert('Coming Soon!', 'Pro features will be available soon.') }
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Analysis Settings',
      items: [
        {
          icon: Camera,
          title: 'Camera Analysis',
          subtitle: 'Real-time facial emotion detection',
          hasSwitch: true,
          value: true,
          onToggle: () => {},
        },
        {
          icon: Mic,
          title: 'Voice Analysis',
          subtitle: 'Tone and sentiment detection',
          hasSwitch: true,
          value: voiceAnalysis,
          onToggle: setVoiceAnalysis,
        },
        {
          icon: Eye,
          title: 'Stealth Mode',
          subtitle: 'Run analysis silently in background',
          hasSwitch: true,
          value: stealthMode,
          onToggle: setStealthMode,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          title: 'Notification Settings',
          subtitle: 'Manage alerts and notifications',
          hasChevron: true,
          onPress: handleNotificationSettings,
        },
        {
          icon: Vibrate,
          title: 'Haptic Feedback',
          subtitle: 'Vibrate on emotion detection',
          hasSwitch: true,
          value: hapticFeedback,
          onToggle: setHapticFeedback,
        },
      ],
    },
    {
      title: 'Privacy & Data',
      items: [
        {
          icon: Shield,
          title: 'Privacy Settings',
          subtitle: 'Control your data and privacy',
          hasChevron: true,
          onPress: handlePrivacySettings,
        },
        {
          icon: Download,
          title: 'Data Export',
          subtitle: 'Download your analysis history',
          hasChevron: true,
          onPress: handleDataExport,
        },
        {
          icon: Zap,
          title: 'Auto-Save Reports',
          subtitle: 'Automatically save session reports',
          hasSwitch: true,
          value: autoSave,
          onToggle: setAutoSave,
        },
      ],
    },
    {
      title: 'Premium',
      items: [
        {
          icon: Crown,
          title: 'Upgrade to Pro',
          subtitle: 'Unlock advanced features & analytics',
          hasChevron: true,
          isPremium: true,
          onPress: handleUpgradeToPro,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          title: 'Help & Support',
          subtitle: 'Get help using vibe AI',
          hasChevron: true,
          onPress: handleSupport,
        },
        {
          icon: Star,
          title: 'Rate the App',
          subtitle: 'Share your feedback',
          hasChevron: true,
          onPress: handleRateApp,
        },
      ],
    },
  ];

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#3B82F6', '#8B5CF6']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <User size={32} color="#ffffff" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionCard}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.settingItem,
                      itemIndex === section.items.length - 1 && styles.lastItem,
                      item.isPremium && styles.premiumItem,
                    ]}
                    onPress={item.onPress}
                    disabled={!item.onPress && !item.hasSwitch}>
                    <View style={styles.settingLeft}>
                      <View style={[
                        styles.settingIcon,
                        item.isPremium && styles.premiumIcon,
                      ]}>
                        <item.icon 
                          size={20} 
                          color={item.isPremium ? '#F59E0B' : '#64748B'} 
                        />
                      </View>
                      <View style={styles.settingInfo}>
                        <Text style={[
                          styles.settingTitle,
                          item.isPremium && styles.premiumTitle,
                        ]}>
                          {item.title}
                        </Text>
                        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.settingRight}>
                      {item.hasSwitch && (
                        <Switch
                          value={item.value}
                          onValueChange={item.onToggle}
                          trackColor={{
                            false: '#e2e8f0',
                            true: '#3B82F6',
                          }}
                          thumbColor="#ffffff"
                        />
                      )}
                      {item.hasChevron && (
                        <ChevronRight size={20} color="#cbd5e1" />
                      )}
                      {item.isPremium && (
                        <View style={styles.premiumBadge}>
                          <Text style={styles.premiumBadgeText}>PRO</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>vibe AI v1.0.0</Text>
            <Text style={styles.footerSubtext}>
              Made with ❤️ for better human connections
            </Text>
          </View>
        </View>
      </ScrollView>

      <ExportModal 
        visible={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
      
      <NotificationSettingsModal 
        visible={showNotificationModal} 
        onClose={() => setShowNotificationModal(false)} 
      />
      
      <PrivacySettingsModal 
        visible={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
      
      <SupportModal 
        visible={showSupportModal} 
        onClose={() => setShowSupportModal(false)} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editProfileText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  premiumItem: {
    backgroundColor: '#fffbeb',
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
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  premiumIcon: {
    backgroundColor: '#fef3c7',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  premiumTitle: {
    color: '#92400e',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  premiumBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});