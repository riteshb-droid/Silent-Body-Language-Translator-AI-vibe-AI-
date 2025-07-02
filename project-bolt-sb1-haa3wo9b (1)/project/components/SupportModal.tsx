import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleHelp as HelpCircle, X, MessageCircle, Mail, Book, Bug, Star, ExternalLink, Phone, Globe } from 'lucide-react-native';
import { useState } from 'react';

interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SupportModal({ visible, onClose }: SupportModalProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat Support',
      subtitle: 'Get instant help from our support team',
      color: '#10B981',
      onPress: () => Alert.alert('Live Chat', 'Live chat will be available in the next update!')
    },
    {
      icon: Mail,
      title: 'Email Support',
      subtitle: 'Send us a detailed message',
      color: '#3B82F6',
      onPress: () => Linking.openURL('mailto:support@vibeai.app?subject=vibe AI Support Request')
    },
    {
      icon: Phone,
      title: 'Phone Support',
      subtitle: 'Speak directly with our team',
      color: '#8B5CF6',
      onPress: () => Alert.alert('Phone Support', 'Phone support available for Pro users. Upgrade to access this feature.')
    },
    {
      icon: Bug,
      title: 'Report a Bug',
      subtitle: 'Help us improve the app',
      color: '#EF4444',
      onPress: () => Linking.openURL('mailto:bugs@vibeai.app?subject=Bug Report - vibe AI')
    }
  ];

  const resources = [
    {
      icon: Book,
      title: 'User Guide',
      subtitle: 'Complete guide to using vibe AI',
      color: '#F59E0B',
      onPress: () => Alert.alert('User Guide', 'Opening user guide...')
    },
    {
      icon: Globe,
      title: 'Knowledge Base',
      subtitle: 'Browse articles and tutorials',
      color: '#06B6D4',
      onPress: () => Alert.alert('Knowledge Base', 'Opening knowledge base...')
    },
    {
      icon: Star,
      title: 'Feature Requests',
      subtitle: 'Suggest new features',
      color: '#84CC16',
      onPress: () => Linking.openURL('mailto:features@vibeai.app?subject=Feature Request')
    }
  ];

  const faqItems = [
    {
      question: 'How accurate is the emotion detection?',
      answer: 'vibe AI uses advanced AI models with 85-95% accuracy in controlled conditions. Accuracy may vary based on lighting, camera quality, and individual facial characteristics.'
    },
    {
      question: 'Is my data private and secure?',
      answer: 'Yes! All emotion analysis happens on your device. No video or audio is sent to our servers unless you explicitly choose to share reports. Your privacy is our top priority.'
    },
    {
      question: 'Can I use vibe AI in video calls?',
      answer: 'Currently, vibe AI works best in face-to-face conversations. Video call integration is planned for future updates.'
    },
    {
      question: 'How much battery does the app use?',
      answer: 'vibe AI is optimized for battery efficiency. Typical usage consumes 5-10% battery per hour of active scanning.'
    },
    {
      question: 'What devices are supported?',
      answer: 'vibe AI works on iOS 13+ and Android 8+ devices with front-facing cameras. For best results, use devices with good camera quality.'
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription anytime through your device\'s app store settings. Your Pro features will remain active until the end of your billing period.'
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.header}>
            <View style={styles.headerContent}>
              <HelpCircle size={24} color="#ffffff" />
              <Text style={styles.headerTitle}>Help & Support</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>How can we help you?</Text>
              <Text style={styles.welcomeText}>
                Our support team is here to help you get the most out of vibe AI. 
                Choose from the options below or browse our FAQ.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Support</Text>
              <View style={styles.optionsGrid}>
                {supportOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionCard}
                    onPress={option.onPress}>
                    <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
                      <option.icon size={24} color={option.color} />
                    </View>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                    <ExternalLink size={16} color="#94A3B8" style={styles.externalIcon} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resources</Text>
              <View style={styles.resourcesList}>
                {resources.map((resource, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.resourceItem,
                      index === resources.length - 1 && styles.lastItem
                    ]}
                    onPress={resource.onPress}>
                    <View style={styles.resourceLeft}>
                      <View style={[styles.resourceIcon, { backgroundColor: resource.color + '20' }]}>
                        <resource.icon size={20} color={resource.color} />
                      </View>
                      <View style={styles.resourceInfo}>
                        <Text style={styles.resourceTitle}>{resource.title}</Text>
                        <Text style={styles.resourceSubtitle}>{resource.subtitle}</Text>
                      </View>
                    </View>
                    <ExternalLink size={16} color="#94A3B8" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              <View style={styles.faqList}>
                {faqItems.map((faq, index) => (
                  <View key={index} style={styles.faqItem}>
                    <TouchableOpacity
                      style={styles.faqQuestion}
                      onPress={() => toggleFaq(index)}>
                      <Text style={styles.faqQuestionText}>{faq.question}</Text>
                      <Text style={[
                        styles.faqToggle,
                        expandedFaq === index && styles.faqToggleExpanded
                      ]}>
                        {expandedFaq === index ? '−' : '+'}
                      </Text>
                    </TouchableOpacity>
                    {expandedFaq === index && (
                      <View style={styles.faqAnswer}>
                        <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Still need help?</Text>
              <Text style={styles.contactText}>
                Our support team typically responds within 24 hours. 
                For urgent issues, please use live chat or phone support.
              </Text>
              <View style={styles.contactDetails}>
                <Text style={styles.contactDetail}>📧 support@vibeai.app</Text>
                <Text style={styles.contactDetail}>🌐 help.vibeai.app</Text>
                <Text style={styles.contactDetail}>📱 Available 24/7</Text>
              </View>
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
  welcomeSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  externalIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  resourcesList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resourceItem: {
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
  resourceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  resourceSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  faqList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  faqToggle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748B',
    width: 24,
    textAlign: 'center',
  },
  faqToggleExpanded: {
    color: '#10B981',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  contactInfo: {
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactDetails: {
    gap: 8,
  },
  contactDetail: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
  },
});