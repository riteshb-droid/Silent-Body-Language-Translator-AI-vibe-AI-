import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  interpolateColor 
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface EmotionIndicatorProps {
  emotion: string;
  confidence: number;
  isVisible: boolean;
  analysis?: string;
  microExpressions?: string[];
  bodyLanguage?: string[];
}

export function EmotionIndicator({ 
  emotion, 
  confidence, 
  isVisible, 
  analysis,
  microExpressions = [],
  bodyLanguage = []
}: EmotionIndicatorProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const pulseScale = useSharedValue(1);
  
  useEffect(() => {
    if (isVisible) {
      opacity.value = withSpring(1, { damping: 15 });
      scale.value = withSpring(1, { damping: 12 });
      
      // Pulse animation for high confidence
      if (confidence > 85) {
        pulseScale.value = withSequence(
          withTiming(1.05, { duration: 600 }),
          withTiming(1, { duration: 600 })
        );
      }
    } else {
      opacity.value = withSpring(0);
      scale.value = withSpring(0.8);
    }
  }, [isVisible, confidence]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { scale: pulseScale.value }
    ],
  }));

  const getEmotionColor = (emotion: string): [string, string] => {
    switch (emotion) {
      case 'Engaged': return ['#10B981', '#059669'];
      case 'Focused': return ['#3B82F6', '#2563EB'];
      case 'Confident': return ['#8B5CF6', '#7C3AED'];
      case 'Excited': return ['#F59E0B', '#D97706'];
      case 'Neutral': return ['#6B7280', '#4B5563'];
      case 'Nervous': return ['#F59E0B', '#D97706'];
      case 'Distracted': return ['#EF4444', '#DC2626'];
      case 'Bored': return ['#94A3B8', '#64748B'];
      case 'Angry': return ['#DC2626', '#B91C1C'];
      case 'Stressed': return ['#EF4444', '#DC2626'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 90) return '#10B981';
    if (confidence >= 80) return '#3B82F6';
    if (confidence >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const colors = getEmotionColor(emotion);
  const confidenceColor = getConfidenceColor(confidence);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={[colors[0] + '25', colors[1] + '40']}
        style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.emotionText, { color: colors[1] }]}>
              {emotion}
            </Text>
            <View style={[styles.confidenceBadge, { backgroundColor: confidenceColor }]}>
              <Text style={styles.confidenceText}>
                {confidence}%
              </Text>
            </View>
          </View>
          
          {analysis && (
            <Text style={styles.analysisText} numberOfLines={2}>
              {analysis}
            </Text>
          )}
          
          {microExpressions.length > 0 && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Micro-expressions:</Text>
              <Text style={styles.detailsText} numberOfLines={1}>
                {microExpressions.join(' • ')}
              </Text>
            </View>
          )}
          
          {bodyLanguage.length > 0 && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Body language:</Text>
              <Text style={styles.detailsText} numberOfLines={1}>
                {bodyLanguage.join(' • ')}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  gradient: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emotionText: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  confidenceText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  analysisText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    marginBottom: 8,
  },
  detailsContainer: {
    marginBottom: 4,
  },
  detailsLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    marginBottom: 2,
  },
  detailsText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 14,
  },
});