import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { colorByType } from '../utils/colorByType';

const STAT_NAMES = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Atk' },
  { key: 'defense', label: 'Def' },
  { key: 'special-attack', label: 'Sp. A' },
  { key: 'special-defense', label: 'Sp. D' },
  { key: 'speed', label: 'Spd' },
];

export default function Compare() {

  const { theme, isDark } = useTheme();

  const insets = useSafeAreaInsets();

  const router = useRouter();

  const [searchText, setSearchText] = useState('');

  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedPokemons, setSelectedPokemons] = useState<any[]>([]);

  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    async function fetchAllNames() {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1500');
        const data = await res.json();
        setAllPokemonNames(data.results.map((p: any) => p.name));
      } catch (e) {
        console.log(e);
      }
    }
    fetchAllNames();
  }, []);

  const suggestions = searchText.length > 0
    ? allPokemonNames
        .filter(name => name.toLowerCase().startsWith(searchText.toLowerCase().trim()))
        .slice(0, 6)
    : [];

  const handleSelectPokemon = async (name: string) => {
    if (selectedPokemons.length >= 3) return;
    if (selectedPokemons.some(p => p.name === name)) return;

    setShowSuggestions(false);
    setSearchText('');
    setShowTable(false);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
      
      const newPokemon = {
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map((t: any) => t.type.name),
        height: data.height,
        weight: data.weight,
        stats: data.stats,
      };
      
      setSelectedPokemons(prev => [...prev, newPokemon]);
    } catch (e) {
      console.log(e);
    }
  };

  const removePokemon = (name: string) => {
    setSelectedPokemons(prev => prev.filter(p => p.name !== name));
    setShowTable(false);
  };

  const getStatValue = (pokemon: any, statName: string) => {
    const statObj = pokemon.stats.find((s: any) => s.stat.name === statName);
    return statObj ? statObj.base_stat : 0;
  };

  const getTotalStats = (pokemon: any) => {
    return pokemon.stats.reduce((sum: number, item: any) => sum + item.base_stat, 0);
  };

  const CompareRow = ({ label, values, isHigherBetter = true }: { label: string, values: number[], isHigherBetter?: boolean }) => {
    // Tìm giá trị cao nhất (hoặc thấp nhất nếu isHigherBetter = false)
    const bestValue = isHigherBetter ? Math.max(...values) : Math.min(...values);

    return (
      <View style={[styles.row, { borderBottomColor: theme.divider }]}>
        <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>{label}</Text>
        
        {values.map((val, index) => {
          const isBest = val === bestValue;
          return (
            <View key={index} style={styles.valueBox}>
              <Text style={[
                styles.rowValue, 
                { 
                  color: isBest ? '#10B981' : theme.textPrimary, 
                  fontWeight: isBest ? 'bold' : 'normal' 
                }
              ]}>
                {val}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={theme.background as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ paddingTop: 100, paddingBottom: 50 }}>
        
        <View style={{ paddingHorizontal: 16, zIndex: 100 }}>
          
          {/* Thanh tìm kiếm */}
          <View style={{ zIndex: 100 }}>
            <View style={{
              flexDirection: 'row', alignItems: 'center', backgroundColor: theme.searchBg,
              borderRadius: 20, paddingHorizontal: 12, borderWidth: 1, borderColor: theme.border, marginBottom: 20
            }}>
              <Ionicons name="search" size={20} color={theme.textSecondary} />
              <TextInput
                placeholder="Tìm Pokemon (tối đa 3)..."
                placeholderTextColor={theme.textSecondary}
                style={{ flex: 1, marginLeft: 8, color: theme.textPrimary, fontSize: 16, padding: 12 }}
                value={searchText}
                onChangeText={(text) => { setSearchText(text); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                editable={selectedPokemons.length < 3}
              />
            </View>

            {/* Dropdown gợi ý */}
            {showSuggestions && suggestions.length > 0 && (
              <View style={{
                position: 'absolute', top: 55, left: 0, right: 0,
                backgroundColor: theme.surface, borderRadius: 15, paddingVertical: 5,
                shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2, shadowRadius: 10, elevation: 15, zIndex: 999, maxHeight: 250, overflow: 'hidden'
              }}>
                <ScrollView keyboardShouldPersistTaps="handled">
                  {suggestions.map((name, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSelectPokemon(name)}
                      style={{ padding: 15, borderBottomWidth: index === suggestions.length - 1 ? 0 : 1, borderBottomColor: theme.divider }}
                    >
                      <Text style={{ fontSize: 16, color: theme.textPrimary, textTransform: 'capitalize' }}>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Khu vực 3 Khung chờ */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            {[0, 1, 2].map((index) => (
              <View key={index} style={styles.slotContainer}>
                {selectedPokemons[index] ? (
                  <View style={[styles.filledSlot, { backgroundColor: isDark ? colorByType[selectedPokemons[index].types[0]] + '30' : colorByType[selectedPokemons[index].types[0]] + '40' }]}>
                    <TouchableOpacity style={styles.removeBtn} onPress={() => removePokemon(selectedPokemons[index].name)}>
                      <Ionicons name="close-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
                    <Image source={{ uri: selectedPokemons[index].image }} style={{ width: 60, height: 60 }} resizeMode="contain" />
                    <Text style={[styles.pokeName, { color: theme.textPrimary }]} numberOfLines={1}>{selectedPokemons[index].name}</Text>
                  </View>
                ) : (
                  <View style={[styles.emptySlot, { borderColor: theme.textSecondary }]}>
                    <Ionicons name="add" size={24} color={theme.textSecondary} />
                    <Text style={{ color: theme.textSecondary, fontSize: 10, marginTop: 5, textAlign: 'center' }}>Chọn Pokemon {index + 1}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Nút Bắt đầu so sánh */}
          {selectedPokemons.length >= 2 && !showTable && (
            <TouchableOpacity 
              onPress={() => setShowTable(true)}
              style={{ backgroundColor: theme.accent, padding: 16, borderRadius: 15, marginTop: 30, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>So sánh ngay ⚡</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* BẢNG SO SÁNH */}
        {showTable && selectedPokemons.length >= 2 && (
          <View style={{ marginTop: 30, paddingHorizontal: 16 }}>
            <View style={[styles.tableContainer, { backgroundColor: theme.surface, shadowColor: isDark ? '#000' : '#5B4B8A' }]}>
              
              {/* Header Bảng */}
              <View style={[styles.headerRow, { borderBottomColor: theme.divider }]}>
                <Text style={[styles.headerLabel, { color: theme.textSecondary }]}>Info</Text>
                {selectedPokemons.map((p) => (
                  <Text key={p.name} style={[styles.headerName, { color: theme.textPrimary }]} numberOfLines={1}>{p.name}</Text>
                ))}
              </View>

              {/* Hệ (Types) */}
              <View style={[styles.row, { borderBottomColor: theme.divider }]}>
                <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>Types</Text>
                {selectedPokemons.map((p) => (
                  <View key={p.name} style={styles.valueBox}>
                    <Text style={{ color: colorByType[p.types[0]], fontSize: 11, fontWeight: 'bold', textTransform: 'capitalize', textAlign: 'center' }}>
                      {p.types.join(', ')}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Chiều cao & Cân nặng */}
              <CompareRow label="Height (m)" values={selectedPokemons.map(p => Number((p.height / 10).toFixed(1)))} isHigherBetter={false} />
              <CompareRow label="Weight (kg)" values={selectedPokemons.map(p => Number((p.weight / 10).toFixed(1)))} isHigherBetter={false} />

              {/* Các Chỉ số (Stats) */}
              {STAT_NAMES.map((stat) => (
                <CompareRow 
                  key={stat.key}
                  label={stat.label}
                  values={selectedPokemons.map(p => getStatValue(p, stat.key))}
                  isHigherBetter={true} 
                />
              ))}

              {/* Tổng chỉ số */}
              <CompareRow 
                label="Total" 
                values={selectedPokemons.map(p => getTotalStats(p))} 
                isHigherBetter={true} 
              />

            </View>
          </View>
        )}

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  slotContainer: {
    width: '31%',
    aspectRatio: 0.85,
  },
  emptySlot: {
    flex: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  filledSlot: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    position: 'relative',
  },
  removeBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  pokeName: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginTop: 5,
    textAlign: 'center',
  },
  // Style cho Bảng
  tableContainer: {
    borderRadius: 20,
    padding: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  headerLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerName: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  rowLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  valueBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowValue: {
    fontSize: 14,
  },
});