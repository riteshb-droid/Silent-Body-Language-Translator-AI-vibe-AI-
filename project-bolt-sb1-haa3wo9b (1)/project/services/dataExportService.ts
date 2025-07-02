import { geminiService } from './geminiService';

export interface ExportData {
  user: {
    name: string;
    email: string;
    exportDate: string;
  };
  sessions: SessionData[];
  analytics: AnalyticsData;
  summary: ExportSummary;
}

export interface SessionData {
  id: string;
  date: string;
  duration: number;
  emotions: {
    emotion: string;
    confidence: number;
    timestamp: number;
    analysis: string;
    microExpressions: string[];
    bodyLanguage: string[];
  }[];
  voiceAnalysis: {
    sentiment: string;
    confidence: number;
    indicators: string[];
    stressLevel: number;
    engagement: number;
    timestamp: number;
  }[];
  summary: {
    dominantEmotion: string;
    avgConfidence: number;
    emotionChanges: number;
    socialEffectiveness: number;
    emotionalStability: number;
  };
  insights: string[];
  recommendations: string[];
}

export interface AnalyticsData {
  totalSessions: number;
  totalDuration: number;
  avgSessionDuration: number;
  emotionDistribution: Record<string, number>;
  confidenceOverTime: { date: string; confidence: number }[];
  improvementTrends: {
    socialEffectiveness: number[];
    emotionalStability: number[];
    dates: string[];
  };
}

export interface ExportSummary {
  overallProgress: string;
  keyInsights: string[];
  recommendations: string[];
  strengthsIdentified: string[];
  areasForImprovement: string[];
}

class DataExportService {
  private generateMockSessionData(): SessionData[] {
    const sessions: SessionData[] = [];
    const emotions = ['Engaged', 'Focused', 'Confident', 'Neutral', 'Nervous', 'Distracted'];
    const sentiments = ['Positive', 'Neutral', 'Calm', 'Excited', 'Stressed'];
    
    // Generate 15 mock sessions over the past month
    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 2));
      
      const sessionEmotions = [];
      const sessionVoice = [];
      const sessionDuration = Math.floor(Math.random() * 20) + 5; // 5-25 minutes
      
      // Generate emotion data points for the session
      const emotionCount = Math.floor(Math.random() * 8) + 3; // 3-10 emotion readings
      for (let j = 0; j < emotionCount; j++) {
        sessionEmotions.push({
          emotion: emotions[Math.floor(Math.random() * emotions.length)],
          confidence: Math.floor(Math.random() * 30) + 70,
          timestamp: date.getTime() + (j * 30000), // Every 30 seconds
          analysis: 'Detailed emotional state analysis based on facial expressions and body language',
          microExpressions: ['Subtle eye movement', 'Lip tension variation'],
          bodyLanguage: ['Forward lean', 'Open posture']
        });
      }
      
      // Generate voice analysis data
      const voiceCount = Math.floor(emotionCount * 0.7); // Slightly fewer voice readings
      for (let k = 0; k < voiceCount; k++) {
        sessionVoice.push({
          sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
          confidence: Math.floor(Math.random() * 25) + 75,
          indicators: ['Clear articulation', 'Steady pace', 'Appropriate volume'],
          stressLevel: Math.floor(Math.random() * 6) + 2, // 2-7
          engagement: Math.floor(Math.random() * 5) + 5, // 5-9
          timestamp: date.getTime() + (k * 45000) // Every 45 seconds
        });
      }
      
      const dominantEmotion = sessionEmotions
        .reduce((acc, curr) => {
          acc[curr.emotion] = (acc[curr.emotion] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      
      const topEmotion = Object.entries(dominantEmotion)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Neutral';
      
      sessions.push({
        id: `session_${i + 1}`,
        date: date.toISOString(),
        duration: sessionDuration,
        emotions: sessionEmotions,
        voiceAnalysis: sessionVoice,
        summary: {
          dominantEmotion: topEmotion,
          avgConfidence: Math.floor(sessionEmotions.reduce((sum, e) => sum + e.confidence, 0) / sessionEmotions.length),
          emotionChanges: Math.floor(Math.random() * 5) + 1,
          socialEffectiveness: Math.floor(Math.random() * 3) + 7, // 7-9
          emotionalStability: Math.floor(Math.random() * 3) + 6, // 6-8
        },
        insights: [
          'Maintained consistent engagement throughout the session',
          'Showed strong emotional awareness and regulation',
          'Demonstrated effective non-verbal communication'
        ],
        recommendations: [
          'Continue practicing active listening techniques',
          'Focus on maintaining eye contact during conversations',
          'Work on stress management in high-pressure situations'
        ]
      });
    }
    
    return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private generateAnalyticsData(sessions: SessionData[]): AnalyticsData {
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    const avgSessionDuration = totalDuration / totalSessions;
    
    // Calculate emotion distribution
    const emotionDistribution: Record<string, number> = {};
    sessions.forEach(session => {
      session.emotions.forEach(emotion => {
        emotionDistribution[emotion.emotion] = (emotionDistribution[emotion.emotion] || 0) + 1;
      });
    });
    
    // Generate confidence over time
    const confidenceOverTime = sessions.map(session => ({
      date: new Date(session.date).toLocaleDateString(),
      confidence: session.summary.avgConfidence
    })).reverse();
    
    // Generate improvement trends
    const improvementTrends = {
      socialEffectiveness: sessions.map(s => s.summary.socialEffectiveness).reverse(),
      emotionalStability: sessions.map(s => s.summary.emotionalStability).reverse(),
      dates: sessions.map(s => new Date(s.date).toLocaleDateString()).reverse()
    };
    
    return {
      totalSessions,
      totalDuration,
      avgSessionDuration: Math.round(avgSessionDuration * 10) / 10,
      emotionDistribution,
      confidenceOverTime,
      improvementTrends
    };
  }

  private async generateExportSummary(sessions: SessionData[], analytics: AnalyticsData): Promise<ExportSummary> {
    try {
      // Use Gemini to generate comprehensive insights
      const recentEmotions = sessions.slice(0, 5).flatMap(s => s.emotions.map(e => e.emotion));
      const avgEffectiveness = sessions.reduce((sum, s) => sum + s.summary.socialEffectiveness, 0) / sessions.length;
      const avgStability = sessions.reduce((sum, s) => sum + s.summary.emotionalStability, 0) / sessions.length;
      
      const prompt = `
        Generate a comprehensive personal development report based on this emotional intelligence data:
        
        - Total sessions: ${analytics.totalSessions}
        - Total analysis time: ${Math.round(analytics.totalDuration / 60)} hours
        - Recent emotions: ${recentEmotions.join(', ')}
        - Average social effectiveness: ${avgEffectiveness.toFixed(1)}/10
        - Average emotional stability: ${avgStability.toFixed(1)}/10
        - Top emotions: ${Object.entries(analytics.emotionDistribution).sort(([,a], [,b]) => b - a).slice(0, 3).map(([emotion]) => emotion).join(', ')}
        
        Provide a JSON response with:
        {
          "overallProgress": "2-sentence summary of overall emotional intelligence progress",
          "keyInsights": ["array of 4-5 key insights about emotional patterns"],
          "recommendations": ["array of 4-5 specific actionable recommendations"],
          "strengthsIdentified": ["array of 3-4 emotional intelligence strengths"],
          "areasForImprovement": ["array of 3-4 areas needing development"]
        }
        
        Focus on personal growth, social skills development, and emotional awareness.
      `;
      
      const result = await geminiService.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            overallProgress: parsed.overallProgress || 'Consistent progress in emotional intelligence development observed.',
            keyInsights: parsed.keyInsights || ['Strong emotional awareness', 'Good self-regulation skills'],
            recommendations: parsed.recommendations || ['Continue current practices', 'Focus on stress management'],
            strengthsIdentified: parsed.strengthsIdentified || ['Emotional awareness', 'Social engagement'],
            areasForImprovement: parsed.areasForImprovement || ['Stress management', 'Consistency']
          };
        }
      } catch (parseError) {
        console.warn('Summary generation JSON parsing failed');
      }
    } catch (error) {
      console.error('Summary generation error:', error);
    }
    
    // Fallback summary
    return {
      overallProgress: 'Your emotional intelligence journey shows consistent growth and self-awareness development. Continue building on these strong foundations.',
      keyInsights: [
        'Demonstrates strong emotional awareness in social situations',
        'Shows consistent engagement patterns across different contexts',
        'Maintains good emotional regulation under various conditions',
        'Exhibits positive social interaction patterns'
      ],
      recommendations: [
        'Continue practicing mindful awareness in daily interactions',
        'Focus on stress management techniques during challenging conversations',
        'Develop active listening skills for deeper connections',
        'Practice emotional regulation in high-pressure situations'
      ],
      strengthsIdentified: [
        'High emotional awareness and recognition',
        'Strong social engagement capabilities',
        'Good emotional stability and regulation'
      ],
      areasForImprovement: [
        'Stress response management',
        'Consistency across different social contexts',
        'Advanced micro-expression reading skills'
      ]
    };
  }

  async generateExportData(): Promise<ExportData> {
    const sessions = this.generateMockSessionData();
    const analytics = this.generateAnalyticsData(sessions);
    const summary = await this.generateExportSummary(sessions, analytics);
    
    return {
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        exportDate: new Date().toISOString()
      },
      sessions,
      analytics,
      summary
    };
  }

  async exportAsJSON(): Promise<string> {
    const data = await this.generateExportData();
    return JSON.stringify(data, null, 2);
  }

  async exportAsCSV(): Promise<string> {
    const data = await this.generateExportData();
    
    let csv = 'Date,Duration (min),Dominant Emotion,Avg Confidence,Social Effectiveness,Emotional Stability,Emotion Changes\n';
    
    data.sessions.forEach(session => {
      const date = new Date(session.date).toLocaleDateString();
      csv += `${date},${session.duration},${session.summary.dominantEmotion},${session.summary.avgConfidence},${session.summary.socialEffectiveness},${session.summary.emotionalStability},${session.summary.emotionChanges}\n`;
    });
    
    return csv;
  }

  async exportAsPDF(): Promise<string> {
    const data = await this.generateExportData();
    
    // Generate a comprehensive PDF report structure
    const pdfContent = `
# vibe AI - Personal Emotional Intelligence Report
**Generated on:** ${new Date(data.user.exportDate).toLocaleDateString()}
**User:** ${data.user.name}

## Executive Summary
${data.summary.overallProgress}

## Analytics Overview
- **Total Sessions:** ${data.analytics.totalSessions}
- **Total Analysis Time:** ${Math.round(data.analytics.totalDuration / 60)} hours
- **Average Session Duration:** ${data.analytics.avgSessionDuration} minutes

## Key Insights
${data.summary.keyInsights.map(insight => `• ${insight}`).join('\n')}

## Identified Strengths
${data.summary.strengthsIdentified.map(strength => `• ${strength}`).join('\n')}

## Areas for Improvement
${data.summary.areasForImprovement.map(area => `• ${area}`).join('\n')}

## Recommendations
${data.summary.recommendations.map(rec => `• ${rec}`).join('\n')}

## Session History
${data.sessions.slice(0, 10).map(session => `
**${new Date(session.date).toLocaleDateString()}** - ${session.duration} minutes
- Dominant Emotion: ${session.summary.dominantEmotion}
- Average Confidence: ${session.summary.avgConfidence}%
- Social Effectiveness: ${session.summary.socialEffectiveness}/10
`).join('\n')}

---
*This report was generated by vibe AI - Your Personal Emotional Intelligence Assistant*
    `;
    
    return pdfContent;
  }

  downloadFile(content: string, filename: string, mimeType: string) {
    if (typeof window === 'undefined') return;
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const dataExportService = new DataExportService();