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

    const [activeTab, setActiveTab] = useState('Forms');

    const tabs = ['Forms', 'Detail', 'Moves', 'Stats', 'Location'];

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


    useEffect(() => {
      fetchPokemonByName(pokemonName)
    }, [pokemonName])
 
    useEffect(() => {
      if (pokemon) {
        setSelectedImage(pokemon?.sprites?.other?.['official-artwork']?.front_default);
      }
    }, [pokemon]);

    async function fetchPokemonByName(name: string) {
      try {
        const PokemonPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)

        const SpeciesPromise = fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)

        const [PokemonResponse, SpeciesResponse] = await Promise.all([
          PokemonPromise,
          SpeciesPromise
        ]    
        )

        const [PokemonData, SpeciesData] = await Promise.all([
          PokemonResponse.json(),
          SpeciesResponse.json()
        ])

      setPokemon(PokemonData),
      setSpecies(SpeciesData)

      } catch (e) {
        console.log(e)
      }    
    }
    
   

  return (
    <>
    <ScrollView contentContainerStyle={{
      gap: 16,
      padding:16,
    }}>
      <View style={styles.header}>
        <Text style={styles.title}>
            {pokemonName ? pokemonName.toUpperCase() : "DETAILS"}
        </Text>
        <Text style={styles.id}>
            {String(pokemon?.id).padStart(3, "0")}
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
      <View style={{ flexDirection: 'row', gap: 15, marginLeft: 10}}>
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
      </View>

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
    <View style={{ marginTop: 20, marginBottom: 30 }}>
  
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 }}>
        Mega Evolution
      </Text> 
  
      <Text style={{ fontSize: 15, lineHeight: 24, color: '#555' }}>
        {description}
      </Text>
    </View>
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
          {/* Thanh màu chạy bên trong */}
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
    </ScrollView>
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