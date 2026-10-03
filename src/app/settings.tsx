import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colorByType } from '../utils/colorByType';

const fake_stats = {
  favourites: 12,
  seen: 47,
};

const FAVOURITE_TYPES = ['fire', 'water', 'grass', 'electric'];

export default function Settings() {
  return (
    <LinearGradient
      colors={['#EEF2FF', '#E0E7FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/*STATS*/}
        <View style={styles.statsCard}>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            
            <View style={styles.statBox}>
              <View style={[styles.statIconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="heart" size={22} color="#EF4444" />
              </View>
              <Text style={styles.statNumber}>{fake_stats.favourites}</Text>
              <Text style={styles.statLabel}>Yêu thích</Text>
            </View>

        
            <View style={styles.statBox}>
              <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="eye" size={22} color="#F59E0B" />
              </View>
              <Text style={styles.statNumber}>{fake_stats.seen}</Text>
              <Text style={styles.statLabel}>Đã xem</Text>
            </View>
          </View>

          <View style={styles.trainerRow}>
            <View style={styles.pokeballMini} />
            <Text style={styles.trainerName}>Pokédex Trainer</Text>
          </View>
        </View>


        {/*HIỆU NĂNG*/}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="flash" size={16} color="#F59E0B" />
            </View>
            <Text style={styles.sectionTitle}>Hiệu năng</Text>
          </View>

          <View style={styles.sectionBody}>
            <SettingRow
              icon="moon"
              iconColor="#6366F1"
              label="Dark Mode"
              rightElement={<ToggleMock value={false} />}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="sparkles"
              iconColor="#EC4899"
              label="Animation"
              rightElement={<ToggleMock value={true} />}
            />
          </View>
        </View>



        {/*HỆ YÊU THÍCH*/}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="color-palette" size={16} color="#EC4899" />
            </View>
            <Text style={styles.sectionTitle}>Hệ yêu thích</Text>
          </View>

          <View style={styles.sectionBody}>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              paddingVertical: 14,
            }}>
              {FAVOURITE_TYPES.map((type) => {
                const isSelected = FAVOURITE_TYPES.includes(type);
                const typeColor = colorByType[type] || '#CCCCCC';
                return (
                  <View
                    key={type}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: typeColor + '20',
                      borderWidth: 1.5,
                      borderColor: typeColor,
                    }}
                  >
                    <View style={{
                      width: 8, height: 8, borderRadius: 4, backgroundColor: typeColor,
                    }} />
                    <Text style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: typeColor,
                      textTransform: 'capitalize',
                    }}>
                      {type}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>


        {/*HỆ THỐNG*/}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="settings" size={16} color="#3B82F6" />
            </View>
            <Text style={styles.sectionTitle}>Hệ thống</Text>
          </View>

          <View style={styles.sectionBody}>
            <SettingRow
              icon="language"
              iconColor="#3B82F6"
              label="Ngôn ngữ"
              rightElement={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ color: '#9CA3AF', fontSize: 14 }}>Việt</Text>
                  <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                </View>
              }
            />
            <View style={styles.divider} />
            <SettingRow
              icon="resize"
              iconColor="#10B981"
              label="Đơn vị đo"
              rightElement={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ color: '#9CA3AF', fontSize: 14 }}>Mét</Text>
                  <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                </View>
              }
            />
            <View style={styles.divider} />
            <SettingRow
              icon="information-circle"
              iconColor="#8B5CF6"
              label="Về ứng dụng"
              rightElement={<Ionicons name="chevron-forward" size={16} color="#D1D5DB" />}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="trash"
              iconColor="#EF4444"
              label="Xóa dữ liệu"
              rightElement={<Ionicons name="chevron-forward" size={16} color="#D1D5DB" />}
            />
          </View>
        </View>

        {/*credit cuối*/}
        <View style={{ alignItems: 'center', paddingVertical: 20, gap: 4 }}>
          <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
            Made with ❤️ by <Text style={{ color: '#5B4B8A', fontWeight: '600' }}>Spider-Hiếu</Text>
          </Text>
          <Text style={{ fontSize: 11, color: '#D1D5DB' }}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    gap: 20,
    shadowColor: '#5B4B8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  pokeballMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#1F2937',
  },
  trainerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5B4B8A',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 4,
  },
  sectionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B4B8A',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionBody: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 16,
    shadowColor: '#5B4B8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});

function SettingRow({ icon, iconColor, label, rightElement }: any) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      gap: 12,
    }}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={{ flex: 1, fontSize: 15, color: '#1F2937', fontWeight: '500' }}>
        {label}
      </Text>
      {rightElement}
    </View>
  );
}

function ToggleMock({ value }: { value: boolean }) {
  return (
    <View style={{
      width: 46,
      height: 26,
      borderRadius: 13,
      backgroundColor: value ? '#5B4B8A' : '#E5E7EB',
      padding: 3,
      justifyContent: 'center',
      alignItems: value ? 'flex-end' : 'flex-start',
    }}>
      <View style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      }} />
    </View>
  );
}