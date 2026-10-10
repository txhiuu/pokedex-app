import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../hooks/useFavourites';
import { useSeenPokemon } from '../hooks/useSeenPokemon';

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


const colorByType: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function Details() {
  const params = useLocalSearchParams()

  const pokemonName = Array.isArray(params.name) ? params.name[0] : params.name;

  const [pokemon, setPokemon] = useState<any>();

  const [species, setSpecies] = useState<any>();

  const [locations, setLocations] = useState<any>();

  const [evolutionChain, setEvolutionChain] = useState<any[]>([]);

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

  const formImages = [
    pokemon?.sprites?.front_default,
    pokemon?.sprites?.other?.['official-artwork']?.front_default,
    pokemon?.sprites?.back_default,
  ];

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
    fetchPokemonByName(pokemonName)
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

      setPokemon(PokemonData),
        setSpecies(SpeciesData),
        setLocations(LocationData),
        markAsSeen(name)

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
          padding: 16
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

          {/* Content of TB */}
          {activeTab === 'Forms' && (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, marginTop: 10 }}>

              {formImages.map((formimage, index) => {
                const isSelected = formimage === selectedImage;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedImage(formimage)}
                    style={{
                      height: 90,
                      width: 90,
                      borderRadius: 20,
                      backgroundColor: (colorByType[pokemon?.types[0]?.type?.name] || '#CCCCCC') + (isDark ? '40' : '90'),
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: isSelected ? theme.accent : 'transparent',
                    }}
                  >
                    <Image source={{ uri: formimage }}
                      style={{
                        width: '80%',
                        height: '80%',
                        opacity: isSelected ? 1 : 0.4,
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}


          {/* Tabs Forms */}
          {activeTab === 'Forms' && (
            <ScrollView style={{ marginTop: 10, marginBottom: 30 }}>
              <View>
                
                {evolutionChain.length > 1 && (
                  <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: theme.textPrimary, textAlign: 'center' }}>
                      --- {t('evolutionChain')} ---
                    </Text>

                    {evolutionChain.map((evo, index) => (
                      <View key={index}>
                        {/*Thẻ Pokemon*/}
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

                        {/*Mũi tên + Điều kiện tiến hóa*/}
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

                )}

                {/*DESCRIPTION*/}
                <View style={{ marginTop: 25 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 8, textAlign: 'center' }}>
                    {t('megaEvolution')}
                  </Text>

                  <Text style={{ fontSize: 15, lineHeight: 24, color: theme.textMuted }}>
                    {description}
                  </Text>
                </View>
              </View>
            </ScrollView>
          )}


          {/*Tabs Detail */}
          {activeTab === 'Detail' && (
            <View style={{ marginTop: 10, gap: 12 }}>

              {/*Height */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                <Text style={{ color: theme.textSecondary, fontSize: 15 }}>
                  {t('height')}
                </Text>

                <Text style={{ fontWeight: '600', fontSize: 15, color: theme.textPrimary }}>
                  {(pokemon?.height / 10).toFixed(1)} m
                </Text>
              </View>

              {/*Weight */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                <Text style={{ color: theme.textSecondary, fontSize: 15 }}>
                  {t('weight')}
                </Text>

                <Text style={{ fontWeight: '600', fontSize: 15, color: theme.textPrimary }}>
                  {(pokemon?.weight / 10).toFixed(1)} kg
                </Text>
              </View>

              {/*Base Experience */}
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
          )}


          {/* Tabs Stats */}
          {activeTab === 'Stats' && (
            <View style={{ marginTop: 10, gap: 12 }}>
              {statsData?.map((stat: any, index: any) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>

                  <Text style={{ width: 70, color: theme.textSecondary, fontSize: 14 }}>
                    {stat.name}
                  </Text>

                  <Text style={{ width: 40, fontWeight: 'bold', fontSize: 14, color: theme.textPrimary }}>
                    {stat.value}
                  </Text>

                  <View style={{
                    flex: 1,
                    height: 6,
                    backgroundColor: isDark ? '#2D2A4A' : '#E5E7EB',
                    borderRadius: 3,
                    overflow: 'hidden',
                    marginLeft: 10
                  }}>
                    <View style={{

                      width: `${(stat.value / 255) * 100}%`,
                      height: '100%',
                      backgroundColor: stat.color,
                      borderRadius: 3,

                    }} />
                  </View>

                </View>
              ))}
            </View>
          )}


          {activeTab === 'Moves' && (
            <View style={{
              marginTop: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8
            }}>

              {movesData.map((moveName: any, index: any) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: theme.cardBg,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}
                >
                  <Text style={{ color: theme.textPrimary, fontSize: 13 }}>
                    {moveName}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Tabs Location */}
          {activeTab === 'Location' && (
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

                      {/* Tỉ lệ gặp*/}
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

          )}

          {/* Tab Type */}
          {activeTab === 'Type' && (
            <View style={{ marginTop: 10, gap: 20 }}>

              {/*YẾU*/}
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

              {/*KHÁNG*/}
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

              {/*MIỄN NHIỄM*/}
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