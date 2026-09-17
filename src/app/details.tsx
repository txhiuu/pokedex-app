import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('Forms');

    const tabs = ['Forms', 'Detail', 'Types', 'Stats'];

    const formImages = [
       pokemon?.sprites?.front_default, 
       pokemon?.sprites?.other?.['official-artwork']?.front_default, 
       pokemon?.sprites?.back_default, 
    ];

    useEffect(() => {
      fetchPokemonByName(pokemonName)
    }, [pokemonName])


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
      finally{
        setLoading(false);
      }
      if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10, color: '#666' }}>Đang tải dữ liệu...</Text>
            </View>
        );
      }
     
    }
    // console.log(pokemon),
    // console.log(species)
  return (
    <>
    <ScrollView 
      contentContainerStyle={{
        gap: 16,
        padding:16,
      }}
    >
       <View style={styles.header}>
        <Text style={styles.title}>
          {pokemonName ? pokemonName.toUpperCase() : "DETAILS"}
        </Text>
        <Text style={styles.id}>{String(pokemon?.id).padStart(3, "0")}</Text>
        <Image 
            source={{uri: pokemon?.sprites?.other?.['official-artwork']?.front_default}}
            style={{
            // @ts-ignore
            backgroundColor: colorByType[pokemon?.types[0].type?.name] + 90,
            borderRadius: 20,
            width: "100%",
            aspectRatio: 1
          }}
        />
      </View >

      //Tabs Bar
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

      //Content of TB
      {activeTab === 'Forms' && (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, marginTop: 10 }}
      >
        {formImages.map((formimage, index) => (
          <View key={index}     
                style={{
                  height: 90,
                  width: 90,
                  borderRadius: 20,
                  backgroundColor: (colorByType[pokemon?.types[0]?.type?.name]) + 90,   
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
          >
            <Image source={{ uri: formimage }}  
                style={{
                  width: '80%',
                  height: '80%',
                }}
              resizeMode="contain"
            />
      </View>
    ))}
  </ScrollView>
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