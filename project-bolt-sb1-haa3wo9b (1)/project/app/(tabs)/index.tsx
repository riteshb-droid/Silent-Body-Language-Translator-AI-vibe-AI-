import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Users, Clock, Target, Eye, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();

  const stats = [
    { title: 'Total Scans', value: '127', icon: Eye, color: '#3B82F6' },
    { title: 'Accuracy Score', value: '94%', icon: Target, color: '#10B981' },
    { title: 'Weekly Sessions', value: '23', icon: TrendingUp, color: '#8B5CF6' },
    { title: 'Avg Duration', value: '12m', icon: Clock, color: '#F59E0B' },
  ];

  const recentSessions = [
    { time: '2 hours ago', duration: '15m', mood: 'Engaged', accuracy: 92 },
    { time: '5 hours ago', duration: '8m', mood: 'Nervous', accuracy: 87 },
    { time: 'Yesterday', duration: '22m', mood: 'Confident', accuracy: 96 },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#3B82F6', '#8B5CF6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Good afternoon!</Text>
          <Text style={styles.subtitle}>Ready to read the mood?</Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => router.push('/scanner')}>
            <Zap size={20} color="#ffffff" />
            <Text style={styles.scanButtonText}>Start New Scan</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          {recentSessions.map((session, index) => (
            <View key={index} style={styles.sessionCard}>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTime}>{session.time}</Text>
                <Text style={styles.sessionDetails}>
                  {session.duration} • {session.mood}
                </Text>
              </View>
              <View style={styles.accuracyBadge}>
                <Text style={styles.accuracyText}>{session.accuracy}%</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionCard}>
            <Users size={24} color="#3B82F6" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Group Analysis</Text>
              <Text style={styles.actionSubtitle}>Analyze multiple people</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <TrendingUp size={24} color="#10B981" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Weekly Report</Text>
              <Text style={styles.actionSubtitle}>View your progress</Text>
            </View>
          </TouchableOpacity>
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
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 24,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  sessionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTime: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  sessionDetails: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  accuracyBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  accuracyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionContent: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
});