import { Text, View } from 'react-native';

interface StatsTabProps {
  statsData: any[];
  isDark: boolean;
  theme: any;
}

export default function StatsTab({ statsData, isDark, theme }: StatsTabProps) {
  return (
    <View style={{ marginTop: 10, gap: 12 }}>
      {statsData?.map((stat: any, index: any) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ width: 70, color: theme.textSecondary, fontSize: 14 }}>
            {stat.name}
          </Text>

          <Text style={{ width: 40, fontWeight: 'bold', fontSize: 14, color: theme.textPrimary }}>
            {stat.value}
          </Text>

          <View style={{
            flex: 1,
            height: 6,
            backgroundColor: isDark ? '#2D2A4A' : '#E5E7EB',
            borderRadius: 3,
            overflow: 'hidden',
            marginLeft: 10
          }}>
            <View style={{
              width: `${(stat.value / 255) * 100}%`,
              height: '100%',
              backgroundColor: stat.color,
              borderRadius: 3,
            }} />
          </View>
        </View>
      ))}
    </View>
  );
}