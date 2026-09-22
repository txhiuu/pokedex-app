import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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

  const [searchText, setSearchText] = useState('');

 // console.log(JSON.stringify(pokemons[0], null, 2));

  const handleSearch = () => {
    if (!searchText.trim()) return;
   
    router.push(`/details?name=${searchText.toLowerCase().trim()}`);
  
  setSearchText(''); 
};

//api_load
  // const [offset, setOffset] = useState(0);

  // const [isLoadingMore, setIsLoadingMore] = useState(false);

//   const loadMore = () => {
  
//     if (isLoadingMore) setIsLoadingMore(true);

//    // const LIMIT = 150;
//   //gọi từng 20 poke/1 lần
//   const newOffset = offset + 20;
//     //const newOffset = offset + LIMIT;
  

//     setOffset(newOffset);

//   //gọi API với offset mới
//     fetchPokemons(newOffset, true);
//   };
// //

  const [sortBy, setSortBy] = useState<'name' | 'id'>('id');

  const [sortOrder, setSortOrder] = useState<'up' | 'down'>('down');

  const [showSortMenu, setShowSortMenu] = useState(false); // Ẩn menu lúc đầu

  const sortedPokemons = [...pokemons].sort((a, b) => {

    let comparison = 0;
  // Bước 1: So sánh theo tiêu chí (name hoặc id)
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else {
      comparison = a.id - b.id;
    }

  // Bước 2: Đảo ngược kết quả nếu là giảm dần (desc)
  return sortOrder === 'up' ? comparison : -comparison;
  });

  useEffect(() => {
     // fetch pokemons
     fetchPokemons();
  },[])

  async function fetchPokemons() {
    // if (isLoadingMore) setIsLoadingMore(true);
    try {
      // Gọi API lấy danh sách 20 Pokemon đầu tiên
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=100") 

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

//Nếu là "tải thêm" thì NỐI vào mảng cũ, nếu là "lần đầu" thì THAY THẾ
      // if (isLoadingMore) {
      //   setPokemons((prev) => [...prev, ...detailedPokemons]);
      // } 
      // else {
      //   setPokemons(detailedPokemons);
      // }
//
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <>
    {/* //use FlatList instead of ScrollView */}
    <FlatList
      data={sortedPokemons}

      numColumns={2}
      columnWrapperStyle={{
         justifyContent: 'space-between', 
      }}
      contentContainerStyle={{
        gap: 16, 
        padding: 16,
      }}
//
      //  onEndReached={loadMore}
      //  onEndReachedThreshold={0.5}
//      
      ListHeaderComponent={
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <View style={{ 
          flex: 1, 
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: '#F3F4F6',
          borderRadius: 20, 
          paddingHorizontal: 12, 
          borderWidth: 1,
          borderColor: "black" 
        }}>

          <Ionicons name="search" size={20} color="#9CA3AF" />

          <TextInput
            placeholder="Name or number"
            placeholderTextColor="#9CA3AF"
            style={{ flex: 1, marginLeft: 8, color: '#1F2937', fontSize: 16 }}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
        </View>

      <TouchableOpacity 
        onPress={() => setShowSortMenu(!showSortMenu)}
        style={{
          backgroundColor: '#5B4B8A',
          padding: 12,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >

        <Ionicons name="options-outline" size={20} color="white" />

      </TouchableOpacity>
      </View>
    }

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
    
    
{/* ==================== MODAL SẮP XẾP ==================== */}
      <Modal
        visible={showSortMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortMenu(false)}
      >
  
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            alignItems: 'flex-end',
          }}
          activeOpacity={1}
          onPress={() => setShowSortMenu(false)}
        >     
    {/* Hộp Menu chính */}
          <View
            style={{
              marginTop: 130, 
              marginRight: 16,
              backgroundColor: 'white',
              borderRadius: 16,
              paddingVertical: 8,
              paddingHorizontal: 4,
              width: 220,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
      {/* ===== NHÓM 1: SẮP XẾP THEO TÊN ===== */}
            <Text
              style={{
                fontSize: 11,
                color: '#9CA3AF',
                fontWeight: '700',
                paddingHorizontal: 12,
                paddingTop: 8,
                paddingBottom: 6,
                letterSpacing: 0.5,
              }}
            >

           THEO TÊN

            </Text>

      {/* Tên A → Z */}
            <TouchableOpacity 
              onPress={() => {
                setSortBy('name');
                setSortOrder('up');
                setShowSortMenu(false);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 12,
                gap: 12,
                borderRadius: 10,
                marginHorizontal: 4,
                backgroundColor:
                sortBy === 'name' && sortOrder === 'up' ? '#F3F4F6' : 'transparent',
              }}
            >
              <Ionicons name="arrow-up" size={16} color="#5B4B8A" />
              <Text style={{ fontSize: 14, color: '#1F2937', flex: 1 }}>

                Tên (A → Z)

              </Text>
            </TouchableOpacity>

      {/* Tên Z → A */}
            <TouchableOpacity
              onPress={() => {
                setSortBy('name');
                setSortOrder('down');
                setShowSortMenu(false);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 12,
                gap: 12,
                borderRadius: 10,
                marginHorizontal: 4,
                backgroundColor:
                sortBy === 'name' && sortOrder === 'down' ? '#F3F4F6' : 'transparent',
              }}
            >
              <Ionicons name="arrow-down" size={16} color="#5B4B8A" />
              <Text style={{ fontSize: 14, color: '#1F2937', flex: 1 }}>

                Tên (Z → A)

              </Text>
            </TouchableOpacity>

      {/* Đường kẻ ngăn cách */}
            <View
              style={{
                height: 1,
                  backgroundColor: '#F3F4F6',
                  marginVertical: 6,
                  marginHorizontal: 12,
              }}
            />

      {/* ===== NHÓM 2: SẮP XẾP THEO ID ===== */}
            <Text
              style={{
                fontSize: 11,
                color: '#9CA3AF',
                fontWeight: '700',
                paddingHorizontal: 12,
                paddingTop: 8,
                paddingBottom: 6,
                letterSpacing: 0.5,
              }}
            >

            THEO ID

            </Text>

      {/* ID Tăng dần */}
          <TouchableOpacity
            onPress={() => {
              setSortBy('id');
              setSortOrder('up');
              setShowSortMenu(false);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 12,
              gap: 12,
              borderRadius: 10,
              marginHorizontal: 4,
              backgroundColor:
              sortBy === 'id' && sortOrder === 'down' ? '#F3F4F6' : 'transparent',
            }}
          >
            <Ionicons name="arrow-up" size={16} color="#5B4B8A" />
            <Text style={{ fontSize: 14, color: '#1F2937', flex: 1 }}>

              ID (Tăng dần)

            </Text>
          </TouchableOpacity>

      {/* ID Giảm dần */}
          <TouchableOpacity
            onPress={() => {
              setSortBy('id');
              setSortOrder('down');
              setShowSortMenu(false);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 12,
              gap: 12,
              borderRadius: 10,
              marginHorizontal: 4,
              backgroundColor:
              sortBy === 'id' && sortOrder === 'down' ? '#F3F4F6' : 'transparent',
            }}
          >
            <Ionicons name="arrow-down" size={16} color="#5B4B8A" />
            <Text style={{ fontSize: 14, color: '#1F2937', flex: 1 }}>

              ID (Giảm dần)

            </Text>
          </TouchableOpacity>
      </View>
    </TouchableOpacity>
</Modal>
    </>
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