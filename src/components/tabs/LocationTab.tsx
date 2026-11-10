import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

interface LocationTabProps {
  locationsData: any[];
  heldItemsData: string[];
  theme: any;
  isDark: boolean;
}

export default function LocationTab({ locationsData, heldItemsData, theme, isDark }: LocationTabProps) {
  const { t } = useLanguage();

  return (
    <View style={{ marginTop: 10 }}>
      {locationsData.length === 0 ? (
        <Text style={{ color: theme.textSecondary, fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>
          {t('noNaturalAppearance')}
        </Text>
      ) : (
        <View style={{ gap: 10 }}>
          {locationsData.map((loc: any, index: any) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.cardBg,
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Ionicons name="location-outline" size={18} color={theme.textSecondary} style={{ marginRight: 8 }} />
              <Text style={{ color: theme.textPrimary, fontSize: 14, flex: 1 }}>
                {loc.name}
              </Text>
              <View style={{
                backgroundColor: theme.cardBg,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginLeft: 8,
              }}>
                <Text style={{ color: '#ef1b1b', fontSize: 12, fontWeight: '600' }}>
                  {loc.chance}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {heldItemsData.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#9a952f' }}>
            {t('heldItems')}
          </Text>
          {heldItemsData.map((itemName: any, index: any) => (
            <View key={index} style={{
              backgroundColor: isDark ? '#3D2E14' : '#fff1d4',
              padding: 10,
              borderRadius: 10,
              marginBottom: 8
            }}>
              <Text style={{ color: isDark ? '#FBBF24' : '#B45309', fontWeight: '600' }}>
                {itemName}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}