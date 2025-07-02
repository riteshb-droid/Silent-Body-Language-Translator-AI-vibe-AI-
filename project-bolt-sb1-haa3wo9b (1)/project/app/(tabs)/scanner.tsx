import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Mic, MicOff, RotateCcw, Zap, Eye, EyeOff, Brain, Waves } from 'lucide-react-native';
import { Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  interpolateColor
} from 'react-native-reanimated';
import { useEmotionDetection } from '@/hooks/useEmotionDetection';
import { EmotionIndicator } from '@/components/EmotionIndicator';

const { width, height } = Dimensions.get('window');

export default function Scanner() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [isStealthMode, setIsStealthMode] = useState(false);
  
  const {
    isActive,
    currentEmotion,
    currentVoice,
    analysisMode,
    setAnalysisMode,
    startDetection,
    stopDetection,
    triggerHapticFeedback,
    isProcessing
  } = useEmotionDetection();
  
  const scanAnimation = useSharedValue(0);
  const processingAnimation = useSharedValue(0);
  
  useEffect(() => {
    if (isActive) {
      scanAnimation.value = withRepeat(
        withTiming(1, { duration: 3000 }),
        -1,
        true
      );
    } else {
      scanAnimation.value = 0;
    }
  }, [isActive]);

  useEffect(() => {
    if (isProcessing) {
      processingAnimation.value = withRepeat(
        withTiming(1, { duration: 1500 }),
        -1,
        true
      );
    } else {
      processingAnimation.value = 0;
    }
  }, [isProcessing]);

  const animatedScanStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scanAnimation.value,
      [0, 0.5, 1],
      ['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.1)']
    );
    
    return {
      backgroundColor,
      transform: [{ scale: 0.98 + (scanAnimation.value * 0.02) }],
    };
  });

  const animatedProcessingStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + (processingAnimation.value * 0.5),
    transform: [{ rotate: `${processingAnimation.value * 360}deg` }],
  }));

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Camera size={64} color="#3B82F6" />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          vibe AI needs camera access to analyze facial expressions and body language in real-time.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    triggerHapticFeedback('light');
  };

  const toggleScanning = () => {
    if (isActive) {
      stopDetection();
    } else {
      startDetection();
    }
    triggerHapticFeedback('medium');
  };

  const toggleAnalysisMode = () => {
    const modes: Array<'emotion' | 'voice' | 'both'> = ['emotion', 'voice', 'both'];
    const currentIndex = modes.indexOf(analysisMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setAnalysisMode(nextMode);
    triggerHapticFeedback('light');
  };

  const toggleStealthMode = () => {
    setIsStealthMode(!isStealthMode);
    triggerHapticFeedback('light');
  };

  const getAnalysisModeIcon = () => {
    switch (analysisMode) {
      case 'emotion': return Brain;
      case 'voice': return Waves;
      case 'both': return Zap;
    }
  };

  const getAnalysisModeText = () => {
    switch (analysisMode) {
      case 'emotion': return 'Facial Analysis';
      case 'voice': return 'Voice Analysis';
      case 'both': return 'Full Analysis';
    }
  };

  const AnalysisModeIcon = getAnalysisModeIcon();

  return (
    <View style={styles.container}>
      {!isStealthMode ? (
        <CameraView style={styles.camera} facing={facing}>
          {isActive && (
            <Animated.View style={[styles.scanOverlay, animatedScanStyle]} />
          )}
          
          {currentEmotion && isActive && (analysisMode === 'emotion' || analysisMode === 'both') && (
            <EmotionIndicator
              emotion={currentEmotion.emotion}
              confidence={currentEmotion.confidence}
              isVisible={true}
              analysis={currentEmotion.analysis}
              microExpressions={currentEmotion.microExpressions}
              bodyLanguage={currentEmotion.bodyLanguage}
            />
          )}
          
          {currentVoice && isActive && (analysisMode === 'voice' || analysisMode === 'both') && (
            <View style={styles.voiceIndicator}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.4)']}
                style={styles.voiceBadge}>
                <Waves size={16} color="#8B5CF6" />
                <Text style={styles.voiceText}>
                  {currentVoice.sentiment} • Stress: {currentVoice.stressLevel}/10
                </Text>
              </LinearGradient>
            </View>
          )}
        </CameraView>
      ) : (
        <View style={styles.stealthContainer}>
          <LinearGradient
            colors={['#1e293b', '#334155']}
            style={styles.stealthGradient}>
            <Eye size={64} color="#64748B" />
            <Text style={styles.stealthTitle}>Stealth Mode Active</Text>
            <Text style={styles.stealthSubtitle}>
              Analyzing emotions silently in the background
            </Text>
            <Text style={styles.stealthMode}>Mode: {getAnalysisModeText()}</Text>
            
            {currentEmotion && isActive && (
              <View style={styles.stealthResults}>
                <Text style={styles.stealthEmotionText}>
                  {currentEmotion.emotion} ({currentEmotion.confidence}%)
                </Text>
                {currentVoice && (
                  <Text style={styles.stealthVoiceText}>
                    Voice: {currentVoice.sentiment} • Engagement: {currentVoice.engagement}/10
                  </Text>
                )}
              </View>
            )}
          </LinearGradient>
        </View>
      )}

      <View style={styles.controls}>
        <View style={styles.topControls}>
          <TouchableOpacity 
            style={[styles.controlButton, isStealthMode && styles.activeButton]}
            onPress={toggleStealthMode}>
            {isStealthMode ? (
              <EyeOff size={20} color="#ffffff" />
            ) : (
              <Eye size={20} color="#64748B" />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, styles.modeButton]}
            onPress={toggleAnalysisMode}>
            <AnalysisModeIcon size={20} color="#3B82F6" />
          </TouchableOpacity>

          {isProcessing && (
            <Animated.View style={[styles.processingIndicator, animatedProcessingStyle]}>
              <Brain size={16} color="#8B5CF6" />
            </Animated.View>
          )}
        </View>

        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.secondaryButton} onPress={toggleCameraFacing}>
            <RotateCcw size={24} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.scanButton, isActive && styles.activeScanButton]}
            onPress={toggleScanning}>
            <LinearGradient
              colors={isActive ? ['#EF4444', '#DC2626'] : ['#3B82F6', '#8B5CF6']}
              style={styles.scanButtonGradient}>
              <Zap size={32} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.placeholder} />
        </View>
      </View>

      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: isActive ? '#10B981' : '#6B7280' }]} />
          <Text style={styles.statusText}>
            {isActive ? 'Analyzing...' : 'Ready to scan'}
          </Text>
        </View>
        
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.statusText}>{getAnalysisModeText()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  voiceIndicator: {
    position: 'absolute',
    bottom: 200,
    alignSelf: 'center',
  },
  voiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  voiceText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  stealthContainer: {
    flex: 1,
  },
  stealthGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  stealthTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 12,
  },
  stealthSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  stealthMode: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 24,
  },
  stealthResults: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  stealthEmotionText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  stealthVoiceText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '500',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  modeButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  processingIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  activeScanButton: {
    transform: [{ scale: 1.1 }],
  },
  scanButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 48,
    height: 48,
  },
  statusBar: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
});