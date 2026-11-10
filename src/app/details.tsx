import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DetailTab from '../components/tabs/DetailTab';
import FormsTab from '../components/tabs/FormsTab';
import LocationTab from '../components/tabs/LocationTab';
import MovesTab from '../components/tabs/MovesTab';
import StatsTab from '../components/tabs/StatsTab';
import TypeTab from '../components/tabs/TypeTab';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../hooks/useFavourites';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useSeenPokemon } from '../hooks/useSeenPokemon';
import { colorByType } from '../utils/colorByType';

interface Pokemon {
  id: number;
  image: string;
  types: PokemonType[]
}

interface PokemonType {
  type: {
    name: string,
    url: string
  }
}

export default function Details() {

  const { isConnected } = useNetworkStatus();
  
  const params = useLocalSearchParams()

  const pokemonName = Array.isArray(params.name) ? params.name[0] : params.name;

  const [pokemon, setPokemon] = useState<any>();

  const [species, setSpecies] = useState<any>();

  const [locations, setLocations] = useState<any>();

  const [evolutionChain, setEvolutionChain] = useState<any[]>([]);

  // 👇 BỔ SUNG 1: State lưu dữ liệu các dạng (Mega, Gmax...)
  const [varietiesData, setVarietiesData] = useState<{ label: string; url: string }[]>([]);

  const [activeTab, setActiveTab] = useState('Forms');

  const { isFav, toggleFavourite } = useFavourites(pokemonName as string);

  const tabs = ['Forms', 'Detail', 'Moves', 'Stats', 'Location', 'Type'];

  const tabKeyMap: Record<string, any> = {
    'Forms': 'tabForms',
    'Detail': 'tabDetail',
    'Moves': 'tabMoves',
    'Stats': 'tabStats',
    'Location': 'tabLocation',
    'Type': 'tabType',
  };

  const { theme, isDark } = useTheme();
  const { t } = useLanguage();

  // 👇 BỔ SUNG 2: Gộp ảnh cơ bản và ảnh biến thể, chống trùng lặp
  const baseForms = [
    { label: 'Normal', url: pokemon?.sprites?.other?.['official-artwork']?.front_default },
    { label: 'Shiny', url: pokemon?.sprites?.other?.['official-artwork']?.front_shiny },
    { label: 'Home', url: pokemon?.sprites?.other?.home?.front_default },
  ].filter(item => item.url);

  const allFormsMap = new Map();
  [...baseForms, ...varietiesData].forEach((form) => {
    if (form.url && !allFormsMap.has(form.url)) {
      allFormsMap.set(form.url, form);
    }
  });
  const allForms = Array.from(allFormsMap.values());

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const englishEntry = species?.flavor_text_entries?.find(
    (entry: any) => entry.language.name === 'en'
  );

  const description = englishEntry ? englishEntry.flavor_text.replace(/[\n\f]/g, ' ') : t('loading');

  const statsData = pokemon?.stats?.map((item: any) => {

    const statNames: Record<string, string> = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Sp. Atk',
      'special-defense': 'Sp. Def',
      'speed': 'Speed',
    };

    const displayName = statNames[item.stat.name] || item.stat.name;

    const barColor = item.base_stat >= 50 ? '#4ADE80' : '#F87171';

    return {
      name: displayName,
      value: item.base_stat,
      color: barColor,
    };
  });

  const totalStats = pokemon?.stats?.reduce((sum: any, item: any) => sum + item.base_stat, 0);

  statsData?.push({
    name: t('total'),
    value: totalStats,
    color: '#4ADE80',
    isTotal: true,
  });

  const insets = useSafeAreaInsets();

  const movesData = pokemon?.moves?.map((item: any) => {

    const rawName = item.move.name;

    const cleanName = rawName.replace(/-/g, ' ');

    const capitalizedName = cleanName.replace(/\b\w/g, (char: any) => char.toUpperCase());
    return capitalizedName;
  }).slice(0, 30) || [];

  const locationsData = locations?.map((item: any) => {

    const rawName = item.location_area.name;

    const cleanName = rawName.replace(/-/g, ' ');

    const capitalizedName = cleanName.replace(/\b\w/g, (char: any) => char.toUpperCase());

    const maxChance = Math.max(
      ...item.version_details.map((v: any) => v.max_chance)
    );

    return {
      name: capitalizedName,
      chance: maxChance,
    };
  }) || [];

  const heldItemsData = pokemon?.held_items?.map((item: any) => {

    const rawName = item.item.name;

    const cleanName = rawName.replace(/-/g, ' ');
    return cleanName.replace(/\b\w/g, (char: string) => char.toUpperCase());
  }) || [];

  const [typeEffectiveness, setTypeEffectiveness] = useState<{
    weaknesses: { type: string; multiplier: number }[];
    resistances: { type: string; multiplier: number }[];
    immunities: string[];
  }>({ weaknesses: [], resistances: [], immunities: [] });

  const ALL_TYPES = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
  ];

  const { markAsSeen } = useSeenPokemon();

  function calculateTypeEffectiveness(typeDataArray: any[]) {
    const multipliers: Record<string, number> = {};

    ALL_TYPES.forEach((t) => (multipliers[t] = 1));

    typeDataArray.forEach((typeData) => {
      const relations = typeData.damage_relations;

      relations.double_damage_from.forEach((t: any) => {
        multipliers[t.name] *= 2;
      });
      relations.half_damage_from.forEach((t: any) => {
        multipliers[t.name] *= 0.5;
      });
      relations.no_damage_from.forEach((t: any) => {
        multipliers[t.name] *= 0;
      });
    });

    const weaknesses: { type: string; multiplier: number }[] = [];
    const resistances: { type: string; multiplier: number }[] = [];
    const immunities: string[] = [];

    Object.entries(multipliers).forEach(([type, mult]) => {
      if (mult === 0) immunities.push(type);
      if (mult > 1) weaknesses.push({ type, multiplier: mult });
      else if (mult < 1) resistances.push({ type, multiplier: mult });
    });

    weaknesses.sort((a, b) => b.multiplier - a.multiplier);
    resistances.sort((a, b) => a.multiplier - b.multiplier);

    return { weaknesses, resistances, immunities };
  }

  useEffect(() => {
    if (pokemonName) {
      fetchPokemonByName(pokemonName);
    }
  }, [pokemonName])

  useEffect(() => {
    if (pokemon) {
      setSelectedImage(pokemon?.sprites?.other?.['official-artwork']?.front_default);
    }
  }, [pokemon]);

  // Hàm đệ quy
  function parseEvolutionChain(node: any, result: any[] = []): any[] {
    result.push({
      name: node.species.name,
      id: node.species.url.split('/').filter(Boolean).pop(),
      condition: node.evolution_details?.[0] ? getEvolutionCondition(node.evolution_details[0]) : null,
    });

    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach((child: any) => parseEvolutionChain(child, result));
    }

    return result;
  }

  //Hàm phụ
  function getEvolutionCondition(details: any): string {
    if (details.min_level) return `Lv. ${details.min_level}`;
    if (details.item) return `${t('useItem')} ${details.item.name.replace(/-/g, ' ')}`;
    if (details.trigger?.name === 'trade') return t('trade');
    if (details.min_happiness) return `${t('friendship')} ${details.min_happiness}`;
    if (details.time_of_day) return `${t('atTime')} ${details.time_of_day}`;
    return t('special');
  }

  async function fetchPokemonByName(name: string) {
    try {
      const PokemonPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)

      const SpeciesPromise = fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)

      const LocationPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${name}/encounters`)

      const [PokemonResponse, SpeciesResponse, LocationResponse] = await Promise.all([
        PokemonPromise,
        SpeciesPromise,
        LocationPromise
      ]
      )

      if (!PokemonResponse.ok) {
        throw new Error("Không tìm thấy Pokemon!");
      }

      const [PokemonData, SpeciesData, LocationData] = await Promise.all([
        PokemonResponse.json(),
        SpeciesResponse.json(),
        LocationResponse.json()
      ])

      setPokemon(PokemonData);
      setSpecies(SpeciesData);
      setLocations(LocationData);
      markAsSeen(name);

      // 👇 BỔ SUNG 3: Logic Fetch động các biến thể (Mega, Gmax...)
      const varieties = SpeciesData.varieties || [];
      const varietyPromises = varieties.map(async (v: any) => {
        const res = await fetch(v.pokemon.url);
        const data = await res.json();
        
        const officialArt = data.sprites.other['official-artwork']?.front_default;
        const homeArt = data.sprites.other?.home?.front_default;
        const imageUrl = officialArt || homeArt;

        if (!imageUrl) return null;

        let label = v.pokemon.name;
        if (v.is_default) {
          label = 'Normal';
        } else if (label.includes('-mega-x')) {
          label = 'Mega X';
        } else if (label.includes('-mega-y')) {
          label = 'Mega Y';
        } else if (label.includes('-mega')) {
          label = 'Mega';
        } else if (label.includes('-gmax')) {
          label = 'Gigantamax';
        } else {
          const parts = label.split('-');
          label = parts.length > 1 ? parts.slice(1).join(' ').toUpperCase() : 'Form';
        }

        return { label, url: imageUrl };
      });

      const fetchedVarieties = (await Promise.all(varietyPromises)).filter(Boolean);
      setVarietiesData(fetchedVarieties as { label: string; url: string }[]);
      // 👆 KẾT THÚC BỔ SUNG 3

      const evolutionUrl = SpeciesData.evolution_chain.url;
      const evolutionRes = await fetch(evolutionUrl);
      const evolutionData = await evolutionRes.json();

      const flatChain = parseEvolutionChain(evolutionData.chain);
      setEvolutionChain(flatChain);

      const typeNames = PokemonData.types.map((t: any) => t.type.name);

      const typeResponses = await Promise.all(
        typeNames.map((name: string) => fetch(`https://pokeapi.co/api/v2/type/${name}`))
      );

      const typeData = await Promise.all(typeResponses.map((r: any) => r.json()));

      const effectiveness = calculateTypeEffectiveness(typeData);
      setTypeEffectiveness(effectiveness);

    } catch (e) {
      console.log(e)
    }
  }

  if (isConnected === false) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: theme.background[0] }}>
        <Ionicons name="cloud-offline-outline" size={80} color={theme.textSecondary} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textPrimary, marginTop: 20, textAlign: 'center' }}>
          Không có kết nối Internet
        </Text>
        <Text style={{ fontSize: 15, color: theme.textSecondary, marginTop: 10, textAlign: 'center' }}>
          Vui lòng kiểm tra lại đường truyền mạng của bạn và thử lại.
        </Text>
      </View>
    );
  }

  return (
    <>
      <LinearGradient
        colors={theme.background as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{
          gap: 16,
          padding: 16,
          paddingTop: 70
        }}>
          <View style={[styles.header, { borderBottomColor: theme.divider }]}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {pokemonName ? pokemonName.toUpperCase() : t('appName').toUpperCase()}
            </Text>
            <Text style={[styles.id, { color: theme.textSecondary }]}>
              #{String(pokemon?.id).padStart(3, "0")}
            </Text>

            <View style={{
              width: '100%',
              aspectRatio: 1,
              position: 'relative',
            }}>
              <Image
                source={{ uri: selectedImage }}
                style={{
                  // @ts-ignore
                  backgroundColor: colorByType[pokemon?.types[0].type?.name] + 90,
                  borderRadius: 20,
                  width: "100%",
                  height: "100%",
                }}
              />

              {/* Nút trái tim */}
              <TouchableOpacity
                onPress={toggleFavourite}
                activeOpacity={0.7}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFav ? '#EF4444' : '#1F2937'}
                />
              </TouchableOpacity>
            </View>

          </View>

          {/* Tabs Bar */}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 }}>
            {tabs.map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                <Text style={{
                  fontWeight: activeTab === tab ? 'bold' : 'normal',
                  color: activeTab === tab ? theme.accent : theme.textSecondary,
                  fontSize: 20
                }}>
                  {t(tabKeyMap[tab])}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tabs Forms */}
          {activeTab === 'Forms' && (
            <FormsTab
              pokemon={pokemon}
              formImages={allForms} // 👈 BỔ SUNG 4: Truyền allForms thay vì formImages cũ
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              evolutionChain={evolutionChain}
              description={description}
              theme={theme}
              isDark={isDark}
            />
          )}

          {/*Tabs Detail */}
          {activeTab === 'Detail' && (
            <DetailTab pokemon={pokemon} theme={theme} />
          )}

          {/* Tabs Stats */}
          {activeTab === 'Stats' && (
            <StatsTab statsData={statsData || []} isDark={isDark} theme={theme} />
          )}

          {/* Tabs Moves */}
          {activeTab === 'Moves' && (
            <MovesTab movesData={movesData} theme={theme} />
          )}

          {/* Tabs Location */}
          {activeTab === 'Location' && (
            <LocationTab locationsData={locationsData} heldItemsData={heldItemsData} theme={theme} isDark={isDark} />
          )}

          {/* Tab Type */}
          {activeTab === 'Type' && (
            <TypeTab typeEffectiveness={typeEffectiveness} isDark={isDark} theme={theme} />
          )}
        </ScrollView>
      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  id: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 15
  },
})