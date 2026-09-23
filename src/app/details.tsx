import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Pokemon {
  id: number;
  image: string;
  types: PokemonType[]
}

interface PokemonType{
  type:{
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

      console.log(params.name);

    const [pokemon, setPokemon] = useState<any>();

    const [species, setSpecies] = useState<any>();

    const [locations, setLocations] = useState<any>();

    const [evolutionChain, setEvolutionChain] = useState<any[]>([]);

    const [activeTab, setActiveTab] = useState('Forms');

    const tabs = ['Forms', 'Detail', 'Moves', 'Stats', 'Location', 'Type'];

    const formImages = [
      pokemon?.sprites?.front_default, 
      pokemon?.sprites?.other?.['official-artwork']?.front_default, 
      pokemon?.sprites?.back_default, 
    ];

    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

    const englishEntry = species?.flavor_text_entries?.find(
      (entry: any) => entry.language.name === 'en'
    );

    const description = englishEntry ? englishEntry.flavor_text.replace(/[\n\f]/g, ' ') : "Loading...";
       
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
  
    
      const barColor = item.base_stat >= 50 ? '#4ADE80' : '#F87171'; // Màu xanh/đỏ

    return {
      name: displayName,
      value: item.base_stat,
      color: barColor,
    };
    });
    
    const totalStats = pokemon?.stats?.reduce((sum: any, item: any) => sum + item.base_stat, 0);

    // push vao statsData
    statsData?.push({
      name: 'Total',
      value: totalStats,
      color: '#4ADE80', 
      isTotal: true,
    });


    
    const movesData = pokemon?.moves?.map((item: any) => {

      const rawName = item.move.name;
   
      const cleanName = rawName.replace(/-/g, ' '); 
   
      const capitalizedName = cleanName.replace(/\b\w/g, (char:any) => char.toUpperCase());
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

  function calculateTypeEffectiveness(typeDataArray: any[]) {
    const multipliers: Record<string, number> = {};
  
  // Khởi tạo tất cả hệ = 1 (bình thường)
    ALL_TYPES.forEach((t) => (multipliers[t] = 1));

  // Nhân hệ số từ mỗi hệ của Pokemon
    typeDataArray.forEach((typeData) => {
      const relations = typeData.damage_relations;
    
    // Hệ này yếu với những hệ nào (x2)
      relations.double_damage_from.forEach((t: any) => {
        multipliers[t.name] *= 2;
      });
    // Hệ này kháng những hệ nào (x0.5)
      relations.half_damage_from.forEach((t: any) => {
        multipliers[t.name] *= 0.5;
      });
    // Hệ này miễn nhiễm với những hệ nào (x0)
      relations.no_damage_from.forEach((t: any) => {
        multipliers[t.name] *= 0;
      });
    });

  // Phân loại
      const weaknesses: { type: string; multiplier: number }[] = [];
      const resistances: { type: string; multiplier: number }[] = [];
      const immunities: string[] = [];

    Object.entries(multipliers).forEach(([type, mult]) => {
      if (mult === 0) immunities.push(type);
      if (mult > 1) weaknesses.push({ type, multiplier: mult });
      else if (mult < 1) resistances.push({ type, multiplier: mult });
    });

  // Sắp xếp yếu nhất lên đầu
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

    // Hàm đệ quy: Nhận vào 1 node, trả về mảng phẳng các bước tiến hóa
    function parseEvolutionChain(node: any, result: any[] = []): any[] {
    // 1. Thêm node hiện tại vào mảng kết quả
      result.push({
        name: node.species.name,
        id: node.species.url.split('/').filter(Boolean).pop(), // Lấy ID từ URL
      // Lấy điều kiện tiến hóa (nếu có)
        condition: node.evolution_details?.[0] ? getEvolutionCondition(node.evolution_details[0]) : null,
      });

    // 2. Duyệt tiếp các nhánh con (đệ quy)
      if (node.evolves_to && node.evolves_to.length > 0) {
        node.evolves_to.forEach((child: any) => parseEvolutionChain(child, result));
      }

      return result;
    } 

    //Hàm phụ: Chuyển điều kiện tiến hóa thành chuỗi dễ đọc
    function getEvolutionCondition(details: any): string {
      if (details.min_level) return `Lv. ${details.min_level}`;
      if (details.item) return `Dùng ${details.item.name.replace(/-/g, ' ')}`;
      if (details.trigger?.name === 'trade') return 'Trao đổi';
      if (details.min_happiness) return `Thân thiết ${details.min_happiness}`;
      if (details.time_of_day) return `Vào ${details.time_of_day}`;
      return 'Đặc biệt';
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
      setLocations(LocationData)

      const evolutionUrl = SpeciesData.evolution_chain.url;
      const evolutionRes = await fetch(evolutionUrl);
      const evolutionData = await evolutionRes.json();
    
      // Gọi hàm đệ quy để làm phẳng cây
      const flatChain = parseEvolutionChain(evolutionData.chain);
      setEvolutionChain(flatChain);

      //
      const typeNames = PokemonData.types.map((t: any) => t.type.name);

      const typeResponses = await Promise.all(
        typeNames.map((name: string) => fetch(`https://pokeapi.co/api/v2/type/${name}`))
      );

      const typeData = await Promise.all(typeResponses.map((r: any) => r.json()));

      // Gọi hàm tính toán
      const effectiveness = calculateTypeEffectiveness(typeData);
      setTypeEffectiveness(effectiveness);

      } catch (e) {
        console.log(e)
      }    
    }
    
   

  return (
    <>
    <LinearGradient
      colors={['#EEF2FF', '#E0E7FF']} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 0, y: 1 }} 
      style={{ flex: 1 }} 
    >
    <ScrollView contentContainerStyle={{
      gap: 16,
      padding:16
    }}>
      <View style={styles.header}>
        <Text style={styles.title}>
            {pokemonName ? pokemonName.toUpperCase() : "DETAILS"}
        </Text>
        <Text style={styles.id}>
            #{String(pokemon?.id).padStart(3, "0")}
        </Text>
        <Image 
            source={{uri: selectedImage}}
            style={{
            // @ts-ignore
            backgroundColor: colorByType[pokemon?.types[0].type?.name] + 90,
            borderRadius: 20,
            width: "100%",
            aspectRatio: 1
          }}
        />
      </View >

      {/* Tabs Bar */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 }}>
            {tabs.map((tab) => (
        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
          <Text style={{ 
            fontWeight: activeTab === tab ? 'bold' : 'normal',
            color: activeTab === tab ? 'black' : '#999',
            fontSize: 20
          }}>
          {tab}
          </Text>
        </TouchableOpacity>
            ))}
      </ScrollView>

      {/* Content of TB */}
      {activeTab === 'Forms' && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, marginTop: 10 }}>

        {formImages.map((formimage, index) => {
      // Check isImage?
          const isSelected = formimage === selectedImage;

      return (
        <TouchableOpacity key={index} onPress={() => setSelectedImage(formimage)} 
          style={{
            height: 90,
            width: 90,
            borderRadius: 20,
            backgroundColor: (colorByType[pokemon?.types[0]?.type?.name] || '#CCCCCC') + '90',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? 'white' : 'transparent',
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
    {/*==================== EVOLUTION CHAIN ====================*/}
    {evolutionChain.length > 1 && (
      <View style={{ marginTop: 25 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#1F2937', textAlign: 'center' }}>
          --- CHUỖI TIẾN HÓA ---
        </Text>

        {evolutionChain.map((evo, index) => (
          <View key={index}>
            {/*Thẻ Pokemon*/}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F9FAFB',
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
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937', textTransform: 'capitalize' }}>
                  {evo.name}
                </Text>
                <Text style={{ fontSize: 13, color: '#9CA3AF' }}>
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
                  color: '#5B4B8A',
                  fontWeight: '600',
                  backgroundColor: '#EEF2FF',
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

    {/* ==================== 3. DESCRIPTION ==================== */}
    <View style={{ marginTop: 25 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 , textAlign: 'center'}}>
        Mega Evolution
      </Text>

      <Text style={{ fontSize: 15, lineHeight: 24, color: '#555' }}>
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

        <Text style={{ color: '#999', fontSize: 15 }}>
          Height
        </Text>

        <Text style={{ fontWeight: '600', fontSize: 15 }}>
        {(pokemon?.height / 10).toFixed(1)} m
        </Text>
      </View>

    {/*Weight */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

        <Text style={{ color: '#999', fontSize: 15 }}>
          Weight
        </Text>

        <Text style={{ fontWeight: '600', fontSize: 15 }}>
        {(pokemon?.weight / 10).toFixed(1)} kg
        </Text>
      </View>

    {/*Base Experience */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

        <Text style={{ color: '#999', fontSize: 15 }}>
          Base Experience
        </Text>

        <Text style={{ fontWeight: '600', fontSize: 15 }}>
          {pokemon?.base_experience}
        </Text>
      </View>

    {/* Abilities */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

        <Text style={{ color: '#999', fontSize: 15 }}>
          Abilities
        </Text>

        <Text style={{ fontWeight: '600', fontSize: 15, textAlign: 'right', flex: 1 }}>
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
        
        <Text style={{ width: 70, color: '#999', fontSize: 14 }}>
          {stat.name}
        </Text>

        <Text style={{ width: 40, fontWeight: 'bold', fontSize: 14 }}>
          {stat.value}
        </Text>

        <View style={{ 
          flex: 1, 
          height: 6, 
          backgroundColor: '#E5E7EB',
          borderRadius: 3,
          overflow: 'hidden',
          marginLeft: 10 
        }}>
          {/*Thanh màu chạy bên trong*/}
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
      
    {movesData.map((moveName:any, index:any) => (
      <View 
        key={index}
        style={{
          backgroundColor: '#F3F4F6',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20, 
          borderWidth: 1,
          borderColor: '#E5E7EB',
        }}
      >
        <Text style={{ color: '#4B5563', fontSize: 13 }}>
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
      <Text style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>
        Pokemon này không xuất hiện trong tự nhiên.
      </Text>
    ) : (
      <View style={{ gap: 10 }}>
        {locationsData.map((loc: any, index:any) => (
          <View 
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F3F4F6',
              padding: 12,
              borderRadius: 10,
            }}
          >
           
            <Ionicons name="location-outline" size={18} color="#4B5563" style={{ marginRight: 8 }} />
            
            
            <Text style={{ color: '#4B5563', fontSize: 14, flex: 1 }}>
              {loc.name}
            </Text>

            {/* Tỉ lệ gặp*/}
            <View style={{
              backgroundColor: '#DCFCE7',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              marginLeft: 8,
            }}>
              <Text style={{ color: '#16A34A', fontSize: 12, fontWeight: '600' }}>
                {loc.chance}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    )}
    {/* heldItems */}
    {heldItemsData.length > 0 && (
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#1a1a1a' }}>

          🎁 Vật phẩm có thể cầm

        </Text>
        {heldItemsData.map((itemName: any, index: any) => (
          <View key={index} style={{ 

            backgroundColor: '#fff1d4',
            padding: 10, 
            borderRadius: 10, 
            marginBottom: 8 

          }}>
            <Text style={{ color: '#B45309', fontWeight: '600' }}>

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
          Weak against:
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {typeEffectiveness.weaknesses.map((w, i) => (
            <View
              key={i}
              style={{
                backgroundColor: (colorByType[w.type] || '#CCCCCC') + '30',
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
              <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 12 }}>
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
          Resistant against:
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
          Normal damage from:
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
  )}

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