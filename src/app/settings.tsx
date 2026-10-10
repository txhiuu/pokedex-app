import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Linking, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../hooks/useFavourites';
import { useSeenPokemon } from '../hooks/useSeenPokemon';
import { useSettings } from '../hooks/useSettings';
import { colorByType } from '../utils/colorByType';


export default function Settings() {

  const { favourites } = useFavourites();
  const { seenCount } = useSeenPokemon();
  const {
    animation,
    toggleAnimation,
    favouriteTypes,
    toggleFavouriteType,
  } = useSettings();

  const { theme, isDark, toggleTheme } = useTheme();
  const { language, t, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleReset = () => {
    Alert.alert(
      t('resetTitle'),
      t('resetMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert(t('deleted'), t('deletedMessage'));
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
      colors={theme.background as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/*STATS*/}
        <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>

          <View style={{ flexDirection: 'row', gap: 12 }}>

            <View style={styles.statBox}>
              <View style={[styles.statIconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="heart" size={22} color="#EF4444" />
              </View>
              <Text style={[styles.statNumber, { color: theme.textPrimary }]}>
                {favourites.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {t('favouritesCount')}
              </Text>
            </View>


            <View style={styles.statBox}>
              <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="eye" size={22} color="#F59E0B" />
              </View>
              <Text style={[styles.statNumber, { color: theme.textPrimary }]}>
                {seenCount}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {t('seenCount')}
              </Text>
            </View>
          </View>

          <View style={[styles.trainerRow, { borderTopColor: theme.divider }]}>
            <View style={[styles.pokeballMini, { borderColor: theme.textPrimary }]} />
            <Text style={[styles.trainerName, { color: theme.accent }]}>{t('trainerName')}</Text>
          </View>
        </View>


        {/*HIỆU NĂNG*/}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconCircle]}>
              <Ionicons name="flash" size={16} color="#F59E0B" />
            </View>
            <Text style={[styles.sectionTitle, { color: theme.accent }]}>{t('performance')}</Text>
          </View>

          <View style={[styles.sectionBody, { backgroundColor: theme.surface }]}>
            <SettingRow
              theme={theme}
              icon="moon"
              iconColor="#6366F1"
              label={t('darkMode')}
              rightElement={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#E5E7EB', true: theme.accent }}
                  thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
                />
              }
            />
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <SettingRow
              theme={theme}
              icon="sparkles"
              iconColor="#EC4899"
              label={t('animation')}
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
            <Text style={[styles.sectionTitle, { color: theme.accent }]}>{t('favouriteTypes')}</Text>
          </View>

          <View style={[styles.sectionBody, { backgroundColor: theme.surface }]}>
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
            <Text style={[styles.sectionTitle, { color: theme.accent }]}>{t('system')}</Text>
          </View>

          <View style={[styles.sectionBody, { backgroundColor: theme.surface }]}>
            <TouchableOpacity onPress={() => setShowLangMenu(true)}>
              <SettingRow
                theme={theme}
                icon="language"
                iconColor="#3B82F6"
                label={t('language')}
                rightElement={
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
                      {language === 'vi' ? 'Tiếng Việt' : 'English'}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                  </View>
                }
              />
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <SettingRow
              theme={theme}
              icon="resize"
              iconColor="#10B981"
              label={t('unit')}
              rightElement={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ color: '#9CA3AF', fontSize: 14 }}>Mét</Text>
                  <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                </View>
              }
            />
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <TouchableOpacity onPress={handleOpenGitHub}>
              <SettingRow
                theme={theme}
                icon="information-circle"
                iconColor="#8B5CF6"
                label={t('about')}
                rightElement={<Ionicons name="chevron-forward" size={16} color="#D1D5DB" />}
              />
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <TouchableOpacity onPress={handleReset}>
              <SettingRow
                theme={theme}
                icon="trash"
                iconColor="#EF4444"
                label={t('resetData')}
                rightElement={<Ionicons name="chevron-forward" size={16} color="#D1D5DB" />}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/*credit cuối*/}
        <View style={{ alignItems: 'center', paddingVertical: 20, gap: 4 }}>
          <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
            {t('credit')} <Text style={{ color: '#5B4B8A', fontWeight: '600' }}>Spider-Hiếu</Text>
          </Text>
          <Text style={{ fontSize: 11, color: '#D1D5DB' }}>{t('version')} 1.0.0</Text>
        </View>

        <Modal
          visible={showLangMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLangMenu(false)}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={1}
            onPress={() => setShowLangMenu(false)}
          >
            <View style={{
              backgroundColor: theme.surface,
              borderRadius: 20,
              padding: 20,
              width: 280,
              gap: 10,
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 10, textAlign: 'center' }}>
                {t('selectLanguage')}
              </Text>

              {/* Tiếng Việt */}
              <TouchableOpacity
                onPress={() => { setLanguage('vi'); setShowLangMenu(false); }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: language === 'vi' ? theme.accentLight : 'transparent',
                }}
              >
                <Text style={{ fontSize: 16, color: theme.textPrimary, fontWeight: '600' }}>🇻🇳 Tiếng Việt</Text>
                {language === 'vi' && <Ionicons name="checkmark-circle" size={22} color={theme.accent} />}
              </TouchableOpacity>

              {/* English */}
              <TouchableOpacity
                onPress={() => { setLanguage('en'); setShowLangMenu(false); }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: language === 'en' ? theme.accentLight : 'transparent',
                }}
              >
                <Text style={{ fontSize: 16, color: theme.textPrimary, fontWeight: '600' }}>🇬🇧 English</Text>
                {language === 'en' && <Ionicons name="checkmark-circle" size={22} color={theme.accent} />}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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

function SettingRow({ icon, iconColor, label, rightElement, theme }: any) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      gap: 12,
    }}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={{ flex: 1, fontSize: 15, color: theme.textPrimary, fontWeight: '500' }}>
        {label}
      </Text>
      {rightElement}
    </View>
  );
}