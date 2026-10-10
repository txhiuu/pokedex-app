import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import TabBar from '../components/TabBar';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { colorByType } from '../utils/colorByType';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: PokemonType[]
}

interface PokemonType {
  type: {
    name: string,
    url: string
  }
}


export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (!searchText.trim()) return;

    router.push(`/details?name=${searchText.toLowerCase().trim()}`);

    setSearchText('');
  };

  const [sortBy, setSortBy] = useState<'name' | 'id'>('id');

  const [sortOrder, setSortOrder] = useState<'up' | 'down'>('down');

  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortedPokemons = [...pokemons].sort((a, b) => {

    let comparison = 0;

    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else {
      comparison = a.id - b.id;
    }

    return sortOrder === 'up' ? comparison : -comparison;
  });

  const { theme, isDark } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    fetchPokemons();
  }, [])

  async function fetchPokemons() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=100")

      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            id: details.id,
            name: pokemon.name,
            image: details.sprites.front_default,
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
    <>
      <LinearGradient
        colors={theme.background as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >

        <FlatList
          data={sortedPokemons}

          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          contentContainerStyle={{
            gap: 16,
            padding: 16,
            paddingBottom: 120,
          }}

          ListHeaderComponent={
            <View>

              <Text style={[styles.header, { color: theme.textPrimary }]}>
                {t('appName')}
              </Text>
              <Text style={[styles.header_son, { color: theme.textSecondary }]}>
                {t('homeSubtitle')}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.searchBg,
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  borderColor: theme.border
                }}>


                  <Ionicons name="search" size={20} color={theme.textSecondary} />

                  <TextInput
                    placeholder={t('searchPlaceholder')}
                    placeholderTextColor={theme.textSecondary}
                    style={{ flex: 1, marginLeft: 8, color: theme.textPrimary, fontSize: 16 }}
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearch}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setShowSortMenu(!showSortMenu)}
                  style={{
                    backgroundColor: theme.accent,
                    padding: 12,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >

                  <Ionicons name="options-outline" size={20} color="white" />

                </TouchableOpacity>

              </View>
            </View>
          }

          renderItem={({ item: pokemon }) => (
            <Link key={pokemon.name} href={{ pathname: "/details", params: { name: pokemon.name } }}
              style={{
                // @ts-ignore
                backgroundColor: isDark
                  ? colorByType[pokemon.types[0].type.name] + '30'
                  : colorByType[pokemon.types[0].type.name] + '40',
                borderRadius: 20,
                padding: 10,
                width: 170
              }}>

              <View>
                <View style={{
                  flexDirection: "row",
                }}>
                  <Image
                    source={{ uri: pokemon.image }}
                    style={{ width: 150, height: 150 }}
                  />
                </View>
                <Text style={[styles.name, { color: theme.textPrimary }]}>{pokemon.name}</Text>
                <Text style={[styles.type, { color: theme.textSecondary }]}>{pokemon.types[0].type.name}</Text>
                <Text style={[styles.id, { color: theme.textMuted }]}>#{String(pokemon.id).padStart(3, "0")}</Text>
              </View>
            </Link>
          )}
        />


        {/*MODAL SẮP XẾP*/}
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
            {/*Hộp Menu chính*/}
            <View
              style={{
                marginTop: 130,
                marginRight: 16,
                backgroundColor: theme.surface,
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
              {/*SẮP XẾP THEO TÊN*/}
              <Text
                style={{
                  fontSize: 11,
                  color: theme.textSecondary,
                  fontWeight: '700',
                  paddingHorizontal: 12,
                  paddingTop: 8,
                  paddingBottom: 6,
                  letterSpacing: 0.5,
                }}
              >

                {t('sortByName').toUpperCase()}

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
                  backgroundColor: (sortBy === 'name' && sortOrder === 'up')
                    ? theme.accentLight
                    : 'transparent',
                }}
              >
                <Ionicons name="arrow-up" size={16} color={theme.accent} />
                <Text style={{ fontSize: 14, color: theme.textPrimary, flex: 1 }}>
                  {t('sortNameAsc')}
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
                  backgroundColor: (sortBy === 'name' && sortOrder === 'down')
                    ? theme.accentLight
                    : 'transparent',
                }}
              >
                <Ionicons name="arrow-down" size={16} color={theme.accent} />
                <Text style={{ fontSize: 14, color: theme.textPrimary, flex: 1 }}>

                  {t('sortNameDesc')}

                </Text>
              </TouchableOpacity>

              <View style={{ height: 1, backgroundColor: theme.divider, marginVertical: 6, marginHorizontal: 12 }} />

              {/*SẮP XẾP THEO ID*/}
              <Text
                style={{
                  fontSize: 11,
                  color: theme.textSecondary,
                  fontWeight: '700',
                  paddingHorizontal: 12,
                  paddingTop: 8,
                  paddingBottom: 6,
                  letterSpacing: 0.5,
                }}
              >

                {t('sortById').toUpperCase()}

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
                  backgroundColor: (sortBy === 'id' && sortOrder === 'up')
                    ? theme.accentLight
                    : 'transparent',
                }}
              >
                <Ionicons name="arrow-up" size={16} color={theme.accent} />
                <Text style={{ fontSize: 14, color: theme.textPrimary, flex: 1 }}>

                  {t('sortIdAsc')}

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
                  backgroundColor: (sortBy === 'id' && sortOrder === 'down')
                    ? theme.accentLight
                    : 'transparent',
                }}
              >
                <Ionicons name="arrow-down" size={16} color={theme.accent} />
                <Text style={{ fontSize: 14, color: theme.textPrimary, flex: 1 }}>

                  {t('sortIdDesc')}

                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

      </LinearGradient>
      <TabBar />
    </>
  );
}


const styles = StyleSheet.create({

  header: {
    paddingLeft: 16,
    fontWeight: 'bold',
    fontSize: 40,
    color: '#5B4B8A',
    paddingBottom: 5
  },

  header_son: {
    paddingLeft: 16,
    fontSize: 15,
    paddingBottom: 10
  },

  name: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',

  },

  type: {
    fontSize: 15,
    fontWeight: 'bold',
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