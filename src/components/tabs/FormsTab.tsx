import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { colorByType } from '../../utils/colorByType';
import EvolutionChain from '../tabs/EvolutionChain';

interface FormsTabProps {
  pokemon: any;
  formImages: any[];
  selectedImage: string | undefined;
  setSelectedImage: (url: string) => void;
  evolutionChain: any[];
  description: string;
  theme: any;
  isDark: boolean;
}

export default function FormsTab({
  pokemon, formImages, selectedImage, setSelectedImage, evolutionChain, description, theme, isDark
}: FormsTabProps) {
  const { t } = useLanguage();

  return (
    <View>
      {/* Ảnh Forms */}
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

      {/* Chuỗi tiến hóa */}
      <EvolutionChain evolutionChain={evolutionChain} theme={theme} />

      {/* Mô tả */}
      <View style={{ marginTop: 25 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 8, textAlign: 'center' }}>
          {t('megaEvolution')}
        </Text>
        <Text style={{ fontSize: 15, lineHeight: 24, color: theme.textMuted }}>
          {description}
        </Text>
      </View>
    </View>
  );
}