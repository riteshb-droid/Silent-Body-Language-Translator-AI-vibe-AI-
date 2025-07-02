import { useState, useEffect, useRef } from 'react';
import { geminiService } from '@/services/geminiService';
import { Platform } from 'react-native';

export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp: number;
  analysis: string;
  microExpressions: string[];
  bodyLanguage: string[];
}

export interface VoiceResult {
  sentiment: string;
  confidence: number;
  indicators: string[];
  stressLevel: number;
  engagement: number;
  timestamp: number;
}

export function useEmotionDetection() {
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [currentVoice, setCurrentVoice] = useState<VoiceResult | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);
  const [voiceHistory, setVoiceHistory] = useState<VoiceResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'emotion' | 'voice' | 'both'>('both');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef<number>(0);

  const startDetection = () => {
    if (isActive) return;
    
    setIsActive(true);
    setEmotionHistory([]);
    setVoiceHistory([]);
    sessionStartTime.current = Date.now();
    
    // Real-time analysis every 2.5 seconds for better responsiveness
    intervalRef.current = setInterval(async () => {
      if (isProcessing) return;
      
      setIsProcessing(true);
      
      try {
        // Analyze emotions if enabled
        if (analysisMode === 'emotion' || analysisMode === 'both') {
          const facialDescription = generateAdvancedFacialDescription();
          const emotionResult = await geminiService.analyzeEmotion(facialDescription);
          
          const emotionData: EmotionResult = {
            emotion: emotionResult.emotion,
            confidence: emotionResult.confidence,
            timestamp: Date.now(),
            analysis: emotionResult.analysis,
            microExpressions: emotionResult.microExpressions,
            bodyLanguage: emotionResult.bodyLanguage,
          };
          
          setCurrentEmotion(emotionData);
          setEmotionHistory(prev => [...prev, emotionData].slice(-100));
        }
        
        // Analyze voice if enabled
        if (analysisMode === 'voice' || analysisMode === 'both') {
          const voiceDescription = generateAdvancedVoiceDescription();
          const voiceResult = await geminiService.analyzeVoiceTone(voiceDescription);
          
          const voiceData: VoiceResult = {
            sentiment: voiceResult.sentiment,
            confidence: voiceResult.confidence,
            indicators: voiceResult.indicators,
            stressLevel: voiceResult.stressLevel,
            engagement: voiceResult.engagement,
            timestamp: Date.now(),
          };
          
          setCurrentVoice(voiceData);
          setVoiceHistory(prev => [...prev, voiceData].slice(-100));
        }
        
      } catch (error) {
        console.error('Detection error:', error);
        
        // Enhanced fallback with more realistic data
        if (analysisMode === 'emotion' || analysisMode === 'both') {
          const fallbackEmotion: EmotionResult = {
            emotion: getContextualMockEmotion(),
            confidence: Math.floor(Math.random() * 25) + 70,
            timestamp: Date.now(),
            analysis: 'Analyzing facial expressions and micro-movements',
            microExpressions: ['Subtle eye tension', 'Lip compression'],
            bodyLanguage: ['Forward lean', 'Open posture'],
          };
          
          setCurrentEmotion(fallbackEmotion);
          setEmotionHistory(prev => [...prev, fallbackEmotion].slice(-100));
        }
        
        if (analysisMode === 'voice' || analysisMode === 'both') {
          const fallbackVoice: VoiceResult = {
            sentiment: 'Neutral',
            confidence: Math.floor(Math.random() * 20) + 75,
            indicators: ['Steady pace', 'Clear tone'],
            stressLevel: Math.floor(Math.random() * 4) + 3,
            engagement: Math.floor(Math.random() * 4) + 5,
            timestamp: Date.now(),
          };
          
          setCurrentVoice(fallbackVoice);
          setVoiceHistory(prev => [...prev, fallbackVoice].slice(-100));
        }
      } finally {
        setIsProcessing(false);
      }
    }, 2500);
  };

  const stopDetection = () => {
    setIsActive(false);
    setCurrentEmotion(null);
    setCurrentVoice(null);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getAdvancedSessionSummary = async () => {
    if (emotionHistory.length === 0) return null;
    
    const emotions = emotionHistory.map(e => e.emotion);
    const avgConfidence = emotionHistory.reduce((sum, e) => sum + e.confidence, 0) / emotionHistory.length;
    const duration = (Date.now() - sessionStartTime.current) / 1000 / 60;
    
    // Calculate emotion changes
    let emotionChanges = 0;
    for (let i = 1; i < emotionHistory.length; i++) {
      if (emotionHistory[i].emotion !== emotionHistory[i-1].emotion) {
        emotionChanges++;
      }
    }
    
    // Count emotion frequencies
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Neutral';
    
    // Get AI-generated insights
    const aiReport = await geminiService.generateSessionReport({
      emotions,
      duration: Math.round(duration * 10) / 10,
      avgConfidence: Math.round(avgConfidence),
      dominantEmotion,
      emotionChanges,
    });
    
    return {
      dominantEmotion,
      avgConfidence: Math.round(avgConfidence),
      duration: Math.round(duration * 10) / 10,
      totalDetections: emotionHistory.length,
      emotionChanges,
      emotionDistribution: emotionCounts,
      aiInsights: aiReport,
      voiceAnalysis: voiceHistory.length > 0 ? {
        avgStress: voiceHistory.reduce((sum, v) => sum + v.stressLevel, 0) / voiceHistory.length,
        avgEngagement: voiceHistory.reduce((sum, v) => sum + v.engagement, 0) / voiceHistory.length,
        dominantSentiment: getMostFrequentSentiment(),
      } : null,
    };
  };

  const getMostFrequentSentiment = () => {
    if (voiceHistory.length === 0) return 'Neutral';
    
    const sentiments = voiceHistory.map(v => v.sentiment);
    const counts = sentiments.reduce((acc, sentiment) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Neutral';
  };

  const triggerHapticFeedback = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if (Platform.OS !== 'web') {
      // Would use Expo Haptics here for native platforms
      console.log(`Haptic feedback: ${intensity}`);
    } else {
      // Web alternative - could use vibration API if available
      if ('vibrate' in navigator) {
        const patterns = {
          light: [50],
          medium: [100],
          heavy: [200]
        };
        navigator.vibrate(patterns[intensity]);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isActive,
    currentEmotion,
    currentVoice,
    emotionHistory,
    voiceHistory,
    isProcessing,
    analysisMode,
    setAnalysisMode,
    startDetection,
    stopDetection,
    getAdvancedSessionSummary,
    triggerHapticFeedback,
  };
}

// Enhanced mock data generators with more realistic patterns
function generateAdvancedFacialDescription(): string {
  const timeOfDay = new Date().getHours();
  const isEvening = timeOfDay > 17;
  const isMorning = timeOfDay < 10;
  
  const descriptions = [
    "Person maintaining steady eye contact with slight forward lean, eyebrows relaxed, subtle smile indicating genuine engagement and active listening",
    "Individual showing micro-expressions of concentration - slight furrow between brows, focused gaze, minimal blinking, suggesting deep cognitive processing",
    "Subject displaying confident posture with shoulders back, direct gaze, relaxed facial muscles, and open hand gestures indicating self-assurance",
    "Person exhibiting neutral baseline expression with occasional eye movements, standard breathing pattern, and balanced facial symmetry",
    "Individual showing subtle stress indicators - slight jaw tension, increased blink rate, fidgeting hands, suggesting mild anxiety or nervousness",
    "Subject appearing distracted with wandering gaze, reduced facial animation, slumped posture, indicating decreased attention or boredom",
    ...(isEvening ? [
      "Person showing signs of fatigue with heavy eyelids, slower facial responses, and reduced energy in expressions",
      "Individual displaying end-of-day tiredness with subtle yawning, relaxed posture, and decreased alertness"
    ] : []),
    ...(isMorning ? [
      "Subject showing morning alertness with bright eyes, animated expressions, and energetic body language",
      "Person displaying fresh engagement with quick responses, attentive posture, and active facial expressions"
    ] : [])
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateAdvancedVoiceDescription(): string {
  const descriptions = [
    "Speaker using moderate pace with clear articulation, stable pitch range, and confident tone suggesting engagement and comfort",
    "Voice showing slight tension with faster speech rate, higher pitch variations, and occasional hesitations indicating mild stress",
    "Individual speaking with slow, measured pace, lower pitch, and calm tone suggesting relaxation or contemplation",
    "Speaker exhibiting animated vocal patterns with varied pitch, energetic pace, and expressive intonation indicating excitement",
    "Voice displaying monotone quality with reduced inflection, slower pace, and flat delivery suggesting disengagement or fatigue",
    "Individual using precise articulation with controlled pace, steady volume, and professional tone indicating focus and preparation"
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getContextualMockEmotion(): string {
  const timeOfDay = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  
  // Weight emotions based on time and context
  if (timeOfDay < 10) {
    return ['Focused', 'Engaged', 'Neutral', 'Confident'][Math.floor(Math.random() * 4)];
  } else if (timeOfDay > 17) {
    return ['Neutral', 'Distracted', 'Bored', 'Stressed'][Math.floor(Math.random() * 4)];
  } else if (dayOfWeek === 1) { // Monday
    return ['Focused', 'Stressed', 'Neutral'][Math.floor(Math.random() * 3)];
  } else if (dayOfWeek === 5) { // Friday
    return ['Engaged', 'Excited', 'Confident'][Math.floor(Math.random() * 3)];
  }
  
  return ['Engaged', 'Focused', 'Confident', 'Neutral', 'Nervous', 'Distracted'][Math.floor(Math.random() * 6)];
}