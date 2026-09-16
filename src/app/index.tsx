import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

interface Pokemon {
  id: number;
  name: string;
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
            id: details.id,
            name: pokemon.name,
            image: details.sprites.front_default, // main sprite
         //   imageBack: details.sprites.back_default,
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
    //use FlatList instead of ScrollView
    <FlatList
      data={pokemons}

      numColumns={2}
      columnWrapperStyle={{
         justifyContent: 'space-between', 
      }}
      contentContainerStyle={{
        gap: 16, 
        padding: 16,
      }}
      renderItem={({ item: pokemon }) => (
        <Link key={pokemon.name} href={{pathname: "/details", params: {name: pokemon.name}}}
          style={{
            // @ts-ignore
            backgroundColor: colorByType[pokemon.types[0].type.name] + 40,
            borderRadius: 20,
            padding: 10,
            width: 170 
          }}>
          <View>
            <View style={{
              flexDirection: "row",
            }}>
              <Image 
                   source={{uri: pokemon.image}}
                   style={{ width: 150, height: 150 }}
              />
            </View>
            <Text style={styles.name}>{pokemon.name}</Text>
            <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
            <Text style={styles.id}>{String(pokemon.id).padStart(3, "0")}</Text>
          </View>
        </Link>
      )}
    />
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
  },
  id: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
})