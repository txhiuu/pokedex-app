import { Ionicons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

interface EvolutionChainProps {
  evolutionChain: any[];
  theme: any;
}

export default function EvolutionChain({ evolutionChain, theme }: EvolutionChainProps) {
  const { t } = useLanguage();

  if (evolutionChain.length <= 1) return null;

  return (
    <View style={{ marginTop: 25 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: theme.textPrimary, textAlign: 'center' }}>
        --- {t('evolutionChain')} ---
      </Text>

      {evolutionChain.map((evo, index) => (
        <View key={index}>
          {/* Thẻ Pokemon */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.cardBg,
            borderRadius: 15,
            padding: 12,
            gap: 12,
          }}>
            <Image
              source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png` }}
              style={{ width: 70, height: 70 }}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.textPrimary, textTransform: 'capitalize' }}>
                {evo.name}
              </Text>
              <Text style={{ fontSize: 13, color: theme.textSecondary }}>
                #{String(evo.id).padStart(3, '0')}
              </Text>
            </View>
          </View>

          {/* Mũi tên + Điều kiện */}
          {index < evolutionChain.length - 1 && evolutionChain[index + 1].condition && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 30,
              paddingVertical: 8,
              gap: 8,
            }}>
              <Ionicons name="arrow-down" size={20} color="#9CA3AF" />
              <Text style={{
                fontSize: 13,
                color: theme.accent,
                fontWeight: '600',
                backgroundColor: theme.accentLight,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 10,
              }}>
                {evolutionChain[index + 1].condition}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}