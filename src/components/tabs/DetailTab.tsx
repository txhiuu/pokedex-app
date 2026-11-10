import { Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

interface DetailTabProps {
  pokemon: any;
  theme: any;
}

export default function DetailTab({ pokemon, theme }: DetailTabProps) {
  const { t } = useLanguage();

  return (
    <View style={{ marginTop: 10, gap: 12 }}>
      {/* Height */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: theme.textSecondary, fontSize: 15 }}>
          {t('height')}
        </Text>
        <Text style={{ fontWeight: '600', fontSize: 15, color: theme.textPrimary }}>
          {(pokemon?.height / 10).toFixed(1)} m
        </Text>
      </View>

      {/* Weight */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: theme.textSecondary, fontSize: 15 }}>
          {t('weight')}
        </Text>
        <Text style={{ fontWeight: '600', fontSize: 15, color: theme.textPrimary }}>
          {(pokemon?.weight / 10).toFixed(1)} kg
        </Text>
      </View>

      {/* Base Experience */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: theme.textSecondary, fontSize: 15 }}>
          {t('baseExp')}
        </Text>
        <Text style={{ fontWeight: '600', fontSize: 15, color: theme.textPrimary }}>
          {pokemon?.base_experience}
        </Text>
      </View>

      {/* Abilities */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: theme.textSecondary, fontSize: 15 }}>
          {t('abilities')}
        </Text>
        <Text style={{ fontWeight: '600', fontSize: 15, textAlign: 'right', flex: 1, color: theme.textPrimary }}>
          {pokemon?.abilities?.map((item: any) => item.ability.name).join(', ')}
        </Text>
      </View>
    </View>
  );
}