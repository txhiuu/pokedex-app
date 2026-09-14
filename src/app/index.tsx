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

const colorByType = {
  grass: "green",
  fire: "orange",
  water: "blue",
  bug: "lightgreen",
  normal: "brown"
}

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
            backgroundColor: colorByType[pokemon.types[0].type.name],
            borderRadius: 20
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