import { Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { colorByType } from '../../utils/colorByType';

interface TypeTabProps {
  typeEffectiveness: {
    weaknesses: { type: string; multiplier: number }[];
    resistances: { type: string; multiplier: number }[];
    immunities: string[];
  };
  isDark: boolean;
  theme: any;
}

export default function TypeTab({ typeEffectiveness, isDark, theme }: TypeTabProps) {
  const { t } = useLanguage();

  return (
    <View style={{ marginTop: 10, gap: 20 }}>
      {/* YẾU */}
      {typeEffectiveness.weaknesses.length > 0 && (
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#DC2626' }}>
            {t('weakAgainst')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {typeEffectiveness.weaknesses.map((w, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: (colorByType[w.type] || '#CCCCCC') + (isDark ? '40' : '30'),
                  borderWidth: 1,
                  borderColor: colorByType[w.type] || '#CCCCCC',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Text style={{ color: colorByType[w.type] || '#333', fontWeight: '600', textTransform: 'capitalize' }}>
                  {w.type}
                </Text>
                <Text style={{ color: theme.textPrimary, fontWeight: 'bold', fontSize: 12 }}>
                  x{w.multiplier}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* KHÁNG */}
      {typeEffectiveness.resistances.length > 0 && (
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#16A34A' }}>
            {t('resistantAgainst')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {typeEffectiveness.resistances.map((r, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: (colorByType[r.type] || '#CCCCCC') + '30',
                  borderWidth: 1,
                  borderColor: colorByType[r.type] || '#CCCCCC',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Text style={{ color: colorByType[r.type] || '#333', fontWeight: '600', textTransform: 'capitalize' }}>
                  {r.type}
                </Text>
                <Text style={{ color: '#16A34A', fontWeight: 'bold', fontSize: 12 }}>
                  x{r.multiplier}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* MIỄN NHIỄM */}
      {typeEffectiveness.immunities.length > 0 && (
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#5B4B8A' }}>
            {t('immuneTo')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {typeEffectiveness.immunities.map((type, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: (colorByType[type] || '#CCCCCC') + '30',
                  borderWidth: 1,
                  borderColor: colorByType[type] || '#CCCCCC',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: colorByType[type] || '#333', fontWeight: '600', textTransform: 'capitalize' }}>
                  {type}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}