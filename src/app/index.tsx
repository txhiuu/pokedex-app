import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
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

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  console.log(JSON.stringify(pokemons[0], null, 2));

  useEffect(() => {
     // fetch pokemons
     fetchPokemons();
  },[])

  async function fetchPokemons() {
    try {
      // Gọi API lấy danh sách 20 Pokemon đầu tiên
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20") 

      const data = await response.json(); 

      // Gọi song song API lấy thông tin chi tiết từng Pokemon
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url); 
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default, // main sprite
            imageBack: details.sprites.back_default,
            types: details.types
          };
        })
      );

      setPokemons(detailedPokemons);  

    } catch (e) {
      console.log(e)
    }
  }
  return (
    <ScrollView 
      contentContainerStyle={{
        gap: 16,
        padding:16
      }}
    >
      {pokemons.map((pokemon) => (
        <View key={pokemon.name} style={{
          // @ts-ignore
            backgroundColor: colorByType[pokemon.types[0].type.name] +40,
            borderRadius: 20,
            padding: 10
        }}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.type}>{pokemon.types[0].type.name}</Text>

          <View style={{
            flexDirection: "row",
            
          }}>
            <Image 
                 source={{uri: pokemon.image}}
                 style={{ width: 150, height: 150 }}
            />
            <Image 
                 source={{uri: pokemon.imageBack}}
                 style={{ width: 150, height: 150 }}
            />
          </View>
        </View>
      ))}
    </ScrollView>

  );
}


const styles = StyleSheet.create({
  name:{
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  type:{
    fontSize: 15,
    fontWeight:'bold',
    color: 'gray',
    textAlign: 'center'
  }
})