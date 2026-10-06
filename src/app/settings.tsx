import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useFavourites } from '../hooks/useFavourites';
import { useSeenPokemon } from '../hooks/useSeenPokemon';
import { useSettings } from '../hooks/useSettings';
import { colorByType } from '../utils/colorByType';



export default function Settings() {

  const { favourites } = useFavourites();
  const { seenCount } = useSeenPokemon();
  const {
    darkMode,
    animation,
    toggleDarkMode,
    toggleAnimation,
    favouriteTypes,
    toggleFavouriteType,
  } = useSettings();

  const handleReset = () => {
    Alert.alert(
      '⚠️ Xóa toàn bộ dữ liệu',
      'Bạn có chắc chắn muốn xóa hết Pokemon yêu thích và cài đặt? Hành động này không thể hoàn tác!',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('✅ Đã xóa', 'Toàn bộ dữ liệu đã được xóa. Hãy khởi động lại app!');
          },
        },
      ]
    );
  };

  const handleOpenGitHub = () => {
    Linking.openURL('https://github.com/txhiuu');
  };



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
              <Text style={styles.statNumber}>{favourites.length}</Text>
              <Text style={styles.statLabel}>Yêu thích</Text>
            </View>


            <View style={styles.statBox}>
              <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="eye" size={22} color="#F59E0B" />
              </View>
              <Text style={styles.statNumber}>{seenCount}</Text>
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
            <View style={[styles.sectionIconCircle]}>
              <Ionicons name="flash" size={16} color="#F59E0B" />
            </View>
            <Text style={styles.sectionTitle}>Hiệu năng</Text>
          </View>

          <View style={styles.sectionBody}>
            <SettingRow
              icon="moon"
              iconColor="#6366F1"
              label="Dark Mode"
              rightElement={
                <Switch
                  value={darkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: '#E5E7EB', true: '#8B7BC7' }}
                  thumbColor={darkMode ? '#5B4B8A' : '#FFFFFF'}
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              icon="sparkles"
              iconColor="#EC4899"
              label="Animation"
              rightElement={
                <Switch
                  value={animation}
                  onValueChange={toggleAnimation}
                  trackColor={{ false: '#E5E7EB', true: '#8B7BC7' }}
                  thumbColor={animation ? '#5B4B8A' : '#FFFFFF'}
                />
              }
            />
          </View>
        </View>



        {/*HỆ YÊU THÍCH*/}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconCircle]}>
              <Ionicons name="color-palette" size={16} color="#e68e0a" />
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
              {Object.keys(colorByType).map((type) => {
                const isSelected = favouriteTypes.includes(type);
                const typeColor = colorByType[type] || '#CCCCCC';
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => toggleFavouriteType(type)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: isSelected ? typeColor + '40' : '#F3F4F6',
                      borderWidth: 1.5,
                      borderColor: isSelected ? typeColor : '#E5E7EB',
                    }}
                  >
                    <View style={{
                      width: 8, height: 8, borderRadius: 4,
                      backgroundColor: isSelected ? typeColor : '#9CA3AF',
                    }} />
                    <Text style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: isSelected ? typeColor : '#6B7280',
                      textTransform: 'capitalize',
                    }}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>


        {/*HỆ THỐNG*/}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="settings" size={16} color="#b1b3b7" />
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
            <TouchableOpacity onPress={handleOpenGitHub}>
              <SettingRow
                icon="information-circle"
                iconColor="#8B5CF6"
                label="Về ứng dụng"
                rightElement={<Ionicons name="chevron-forward" size={16} color="#D1D5DB" />}
              />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity onPress={handleReset}>
              <SettingRow
                icon="trash"
                iconColor="#EF4444"
                label="Xóa dữ liệu"
                rightElement={<Ionicons name="chevron-forward" size={16} color="#D1D5DB" />}
              />
            </TouchableOpacity>
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

