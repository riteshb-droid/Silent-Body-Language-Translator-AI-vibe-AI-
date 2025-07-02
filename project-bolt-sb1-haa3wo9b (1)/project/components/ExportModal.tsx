import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Download, FileText, Database, X, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useState } from 'react';
import { dataExportService } from '@/services/dataExportService';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ExportModal({ visible, onClose }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const exportFormats = [
    {
      id: 'json',
      title: 'JSON Data',
      description: 'Complete data export with all details',
      icon: Database,
      color: '#3B82F6',
      filename: 'vibe-ai-data.json',
      mimeType: 'application/json'
    },
    {
      id: 'csv',
      title: 'CSV Spreadsheet',
      description: 'Session data for analysis in Excel',
      icon: FileText,
      color: '#10B981',
      filename: 'vibe-ai-sessions.csv',
      mimeType: 'text/csv'
    },
    {
      id: 'pdf',
      title: 'PDF Report',
      description: 'Comprehensive analysis report',
      icon: FileText,
      color: '#8B5CF6',
      filename: 'vibe-ai-report.md',
      mimeType: 'text/markdown'
    }
  ];

  const handleExport = async (format: typeof exportFormats[0]) => {
    setIsExporting(true);
    setExportSuccess(null);
    
    try {
      let content: string;
      
      switch (format.id) {
        case 'json':
          content = await dataExportService.exportAsJSON();
          break;
        case 'csv':
          content = await dataExportService.exportAsCSV();
          break;
        case 'pdf':
          content = await dataExportService.exportAsPDF();
          break;
        default:
          throw new Error('Unknown export format');
      }
      
      dataExportService.downloadFile(content, format.filename, format.mimeType);
      setExportSuccess(format.title);
      
      // Auto-close success message after 2 seconds
      setTimeout(() => {
        setExportSuccess(null);
      }, 2000);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6']}
            style={styles.header}>
            <View style={styles.headerContent}>
              <Download size={24} color="#ffffff" />
              <Text style={styles.headerTitle}>Export Your Data</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.content}>
            <Text style={styles.description}>
              Download your complete emotional intelligence analysis history in your preferred format.
            </Text>

            {exportSuccess && (
              <View style={styles.successBanner}>
                <CheckCircle size={20} color="#10B981" />
                <Text style={styles.successText}>
                  {exportSuccess} exported successfully!
                </Text>
              </View>
            )}

            <View style={styles.formatsList}>
              {exportFormats.map((format) => (
                <TouchableOpacity
                  key={format.id}
                  style={[
                    styles.formatCard,
                    isExporting && styles.formatCardDisabled
                  ]}
                  onPress={() => handleExport(format)}
                  disabled={isExporting}>
                  <View style={[styles.formatIcon, { backgroundColor: format.color + '20' }]}>
                    <format.icon size={24} color={format.color} />
                  </View>
                  
                  <View style={styles.formatInfo}>
                    <Text style={styles.formatTitle}>{format.title}</Text>
                    <Text style={styles.formatDescription}>{format.description}</Text>
                  </View>
                  
                  {isExporting ? (
                    <ActivityIndicator size="small" color={format.color} />
                  ) : (
                    <Download size={20} color="#64748B" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>What's included:</Text>
              <Text style={styles.infoText}>
                • Complete session history and analysis{'\n'}
                • Emotional intelligence insights and trends{'\n'}
                • Personal development recommendations{'\n'}
                • Voice analysis data (when available){'\n'}
                • Progress tracking and analytics
              </Text>
            </View>

            <View style={styles.privacyNote}>
              <Text style={styles.privacyText}>
                🔒 Your data is processed locally and exported directly to your device. 
                No information is sent to external servers during export.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
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
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginLeft: 8,
  },
  formatsList: {
    marginBottom: 20,
  },
  formatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formatCardDisabled: {
    opacity: 0.6,
  },
  formatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  formatInfo: {
    flex: 1,
  },
  formatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  formatDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  privacyNote: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  privacyText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },
});