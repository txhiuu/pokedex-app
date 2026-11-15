import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { colorByType } from '../../utils/colorByType';
import EvolutionChain from '../tabs/EvolutionChain';

interface FormsTabProps {
  pokemon: any;
  species: any; 
  formImages: any[];
  selectedImage: string | undefined;
  setSelectedImage: (url: string) => void;
  evolutionChain: any[];
  description: string;
  theme: any;
  isDark: boolean;
}

export default function FormsTab({
  pokemon, species, formImages, selectedImage, setSelectedImage, evolutionChain, description, theme, isDark
}: FormsTabProps) {
  const { t, language } = useLanguage(); // Lấy thêm language để xử lý mô tả

  const catchRate = species?.capture_rate || 0;
  
  const calculateCatchChance = (ballMultiplier: number) => {
    const modifiedRate = (catchRate * ballMultiplier) / 3;
    if (modifiedRate >= 255) return '100';
    return ((modifiedRate / 255) * 100).toFixed(1);
  };

  const pokeChance = calculateCatchChance(1);
  const greatChance = calculateCatchChance(1.5);
  const ultraChance = calculateCatchChance(2);

  const growthRate = species?.growth_rate?.name?.replace('-', ' ') || 'Unknown';
  const baseExp = pokemon?.base_experience || 0;
  const baseFriendship = species?.base_happiness || 0;
  const evYield = pokemon?.stats
    ?.filter((s: any) => s.effort > 0)
    .map((s: any) => `${s.effort} ${s.stat.name.toUpperCase()}`)
    .join(', ') || 'None';

  const specialEvolutions = formImages.filter(
    (f: any) => !['Normal', 'Shiny', 'Home'].includes(f.label)
  );

  return (
    <View>
      {/* 1. ẢNH FORMS */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, marginTop: 10 }}>
        {formImages.map((form, index) => {
          const isSelected = form.url === selectedImage;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImage(form.url)}
              style={{ alignItems: 'center', gap: 4 }}
            >
              <View
                style={{
                  height: 90, width: 90, borderRadius: 20,
                  backgroundColor: (colorByType[pokemon?.types[0]?.type?.name] || '#CCCCCC') + (isDark ? '40' : '90'),
                  justifyContent: 'center', alignItems: 'center',
                  borderWidth: isSelected ? 2 : 0,
                  borderColor: isSelected ? theme.accent : 'transparent',
                }}
              >
                <Image
                  source={{ uri: form.url }}
                  style={{ width: '80%', height: '80%', opacity: isSelected ? 1 : 0.4 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{
                fontSize: 11, fontWeight: '600',
                color: isSelected ? theme.accent : theme.textSecondary,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                {form.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 2. CHUỖI TIẾN HÓA */}
      <EvolutionChain evolutionChain={evolutionChain} theme={theme} />

      {/* 3. BẢNG CATCH RATE */}
      <View style={{ marginTop: 40, marginBottom: 10 }}>
        <View style={{ 
          backgroundColor: theme.surface, 
          borderRadius: 20, 
          padding: 20, 
          paddingTop: 30,
          borderWidth: 1,
          borderColor: '#F59E0B60',
          position: 'relative'
        }}>
          <View style={{ 
            position: 'absolute', 
            top: -16, 
            alignSelf: 'center', 
            backgroundColor: theme.surface, 
            paddingHorizontal: 20, 
            paddingVertical: 6, 
            borderRadius: 20, 
            borderWidth: 1.5, 
            borderColor: '#F59E0B' 
          }}>
            <Text style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: 16 }}>{t('catchRate')}</Text>
          </View>

          <Text style={{ fontSize: 14, color: theme.textPrimary, lineHeight: 22, marginBottom: 20 }}>
            {t('catchRateDesc')}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginBottom: 15 }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginBottom: 8 }}>
                <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: 'bold' }}>{pokeChance}%</Text>
              </View>
              <Image source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }} style={{ width: 45, height: 45 }} />
            </View>

            <View style={{ alignItems: 'center' }}>
              <View style={{ backgroundColor: '#DBEAFE', borderWidth: 1, borderColor: '#3B82F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginBottom: 8 }}>
                <Text style={{ color: '#3B82F6', fontSize: 11, fontWeight: 'bold' }}>{greatChance}%</Text>
              </View>
              <Image source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png' }} style={{ width: 45, height: 45 }} />
            </View>

            <View style={{ alignItems: 'center' }}>
              <View style={{ backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginBottom: 8 }}>
                <Text style={{ color: '#F59E0B', fontSize: 11, fontWeight: 'bold' }}>{ultraChance}%</Text>
              </View>
              <Image source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png' }} style={{ width: 45, height: 45 }} />
            </View>
          </View>

          <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: 'center', fontStyle: 'italic' }}>
            {t('catchRateNote')}
          </Text>
        </View>
      </View>

      {/* 4. BẢNG TRAINING */}
      <View style={{ marginTop: 15, backgroundColor: theme.surface, borderRadius: 20, padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 4 }}>
          📈 {t('training')}
        </Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.textSecondary, fontSize: 14 }}>{t('growthRate')}</Text>
          <Text style={{ color: theme.textPrimary, fontWeight: '600', textTransform: 'capitalize' }}>{growthRate}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.textSecondary, fontSize: 14 }}>{t('evYield')}</Text>
          <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>{evYield}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.textSecondary, fontSize: 14 }}>{t('baseExp')}</Text>
          <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>{baseExp}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.textSecondary, fontSize: 14 }}>{t('baseFriendship')}</Text>
          <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>{baseFriendship}</Text>
        </View>
      </View>

      {/* 5. SPECIAL EVOLUTIONS */}
      {specialEvolutions.length > 0 && (
        <View style={{ marginTop: 25, marginBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: theme.textPrimary, textAlign: 'center' }}>
            --- {t('specialEvolutions')} ---
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'center' }}>
            {specialEvolutions.map((evo: any, index: number) => (
              <View key={index} style={{ alignItems: 'center', width: '30%' }}>
                <Image source={{ uri: evo.url }} style={{ width: 80, height: 80 }} resizeMode="contain" />
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: theme.textPrimary, textAlign: 'center', marginTop: 5, textTransform: 'capitalize' }}>
                  {evo.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 6. MÔ TẢ (Xử lý ngôn ngữ) */}
      <View style={{ marginTop: 25 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 8, textAlign: 'center' }}>
          {t('megaEvolution')}
        </Text>
        
        {/* Kiểm tra nếu là tiếng Việt thì hiện ghi chú, ngược lại hiện mô tả tiếng Anh */}
        {language === 'vi' ? (
          <View style={{ backgroundColor: theme.surface, padding: 15, borderRadius: 10 }}>
            <Text style={{ fontSize: 14, color: theme.textSecondary, fontStyle: 'italic', textAlign: 'center' }}>
              (PokeAPI chưa hỗ trợ mô tả bằng tiếng Việt. Vui lòng chuyển sang English để xem chi tiết).
            </Text>
          </View>
        ) : (
          <Text style={{ fontSize: 15, lineHeight: 24, color: theme.textMuted, textAlign: 'center' }}>
            {description}
          </Text>
        )}
      </View>
    </View>
  );
}