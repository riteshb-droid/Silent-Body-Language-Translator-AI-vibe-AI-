import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Calendar, Download, ChartBar as BarChart, Users, Clock, Target } from 'lucide-react-native';
import { useState } from 'react';

const { width } = Dimensions.get('window');

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const emotionData = [
    { emotion: 'Engaged', percentage: 35, color: '#10B981' },
    { emotion: 'Focused', percentage: 25, color: '#3B82F6' },
    { emotion: 'Confident', percentage: 18, color: '#8B5CF6' },
    { emotion: 'Neutral', percentage: 12, color: '#6B7280' },
    { emotion: 'Nervous', percentage: 7, color: '#F59E0B' },
    { emotion: 'Distracted', percentage: 3, color: '#EF4444' },
  ];

  const weeklyTrends = [
    { day: 'Mon', engaged: 78, sessions: 3 },
    { day: 'Tue', engaged: 85, sessions: 4 },
    { day: 'Wed', engaged: 72, sessions: 2 },
    { day: 'Thu', engaged: 91, sessions: 5 },
    { day: 'Fri', engaged: 88, sessions: 4 },
    { day: 'Sat', engaged: 65, sessions: 2 },
    { day: 'Sun', engaged: 82, sessions: 3 },
  ];

  const insights = [
    {
      title: 'Peak Performance',
      value: 'Thursday 2-4 PM',
      trend: '+12%',
      icon: TrendingUp,
      color: '#10B981',
    },
    {
      title: 'Avg Session Length',
      value: '14 minutes',
      trend: '+2m',
      icon: Clock,
      color: '#3B82F6',
    },
    {
      title: 'Accuracy Rate',
      value: '94.2%',
      trend: '+5.3%',
      icon: Target,
      color: '#8B5CF6',
    },
    {
      title: 'People Analyzed',
      value: '127',
      trend: '+23',
      icon: Users,
      color: '#F59E0B',
    },
  ];

  const recentSessions = [
    {
      date: 'Today, 2:30 PM',
      duration: '18m',
      participants: 3,
      avgEngagement: 87,
      dominantEmotion: 'Engaged',
      emotionColor: '#10B981',
    },
    {
      date: 'Today, 10:15 AM',
      duration: '12m',
      participants: 1,
      avgEngagement: 92,
      dominantEmotion: 'Focused',
      emotionColor: '#3B82F6',
    },
    {
      date: 'Yesterday, 4:45 PM',
      duration: '25m',
      participants: 5,
      avgEngagement: 76,
      dominantEmotion: 'Mixed',
      emotionColor: '#6B7280',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1e293b', '#334155']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>Analytics & Reports</Text>
        <Text style={styles.headerSubtitle}>Insights into your emotional intelligence</Text>
        
        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}>
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.activePeriodButtonText
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.insightsGrid}>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: insight.color + '20' }]}>
                <insight.icon size={20} color={insight.color} />
              </View>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightValue}>{insight.value}</Text>
              <Text style={[styles.insightTrend, { color: insight.color }]}>
                {insight.trend}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emotion Distribution</Text>
            <TouchableOpacity style={styles.exportButton}>
              <Download size={16} color="#64748B" />
              <Text style={styles.exportButtonText}>Export</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.emotionChart}>
            {emotionData.map((item, index) => (
              <View key={index} style={styles.emotionRow}>
                <View style={styles.emotionInfo}>
                  <View style={[styles.emotionDot, { backgroundColor: item.color }]} />
                  <Text style={styles.emotionLabel}>{item.emotion}</Text>
                </View>
                <View style={styles.emotionBarContainer}>
                  <View
                    style={[
                      styles.emotionBar,
                      { 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }
                    ]}
                  />
                </View>
                <Text style={styles.emotionPercentage}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Engagement Trend</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {weeklyTrends.map((day, index) => (
                <View key={index} style={styles.chartBar}>
                  <View
                    style={[
                      styles.bar,
                      { 
                        height: `${day.engaged}%`,
                        backgroundColor: day.engaged > 80 ? '#10B981' : day.engaged > 60 ? '#3B82F6' : '#F59E0B',
                      }
                    ]}
                  />
                  <Text style={styles.chartLabel}>{day.day}</Text>
                  <Text style={styles.chartValue}>{day.engaged}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          {recentSessions.map((session, index) => (
            <View key={index} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionDate}>{session.date}</Text>
                <View style={styles.sessionStats}>
                  <Text style={styles.sessionDuration}>{session.duration}</Text>
                  <Text style={styles.sessionParticipants}>
                    {session.participants} {session.participants === 1 ? 'person' : 'people'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.sessionContent}>
                <View style={styles.engagementMeter}>
                  <Text style={styles.engagementLabel}>Avg Engagement</Text>
                  <View style={styles.engagementBar}>
                    <View
                      style={[
                        styles.engagementFill,
                        { 
                          width: `${session.avgEngagement}%`,
                          backgroundColor: session.avgEngagement > 85 ? '#10B981' : session.avgEngagement > 70 ? '#3B82F6' : '#F59E0B',
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.engagementValue}>{session.avgEngagement}%</Text>
                </View>
                
                <View style={styles.dominantEmotion}>
                  <Text style={styles.emotionLabel}>Dominant Emotion</Text>
                  <View style={[styles.emotionTag, { backgroundColor: session.emotionColor + '20' }]}>
                    <Text style={[styles.emotionTagText, { color: session.emotionColor }]}>
                      {session.dominantEmotion}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 24,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: '#ffffff',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#cbd5e1',
  },
  activePeriodButtonText: {
    color: '#1e293b',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  insightCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  insightTrend: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  exportButtonText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginLeft: 4,
  },
  emotionChart: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emotionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emotionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  emotionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  emotionLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  emotionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  emotionBar: {
    height: '100%',
    borderRadius: 4,
  },
  emotionPercentage: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '600',
    width: 32,
    textAlign: 'right',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: '600',
  },
  sessionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  sessionStats: {
    alignItems: 'flex-end',
  },
  sessionDuration: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  sessionParticipants: {
    fontSize: 12,
    color: '#64748b',
  },
  sessionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  engagementMeter: {
    flex: 1,
    marginRight: 16,
  },
  engagementLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  engagementBar: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  engagementFill: {
    height: '100%',
    borderRadius: 3,
  },
  engagementValue: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '600',
  },
  dominantEmotion: {
    alignItems: 'flex-end',
  },
  emotionTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  emotionTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
});