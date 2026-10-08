import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../hooks/useFavourites';
import { colorByType } from '../utils/colorByType';

export default function Favourite() {
    const { favourites } = useFavourites();
    const [pokemonDetails, setPokemonDetails] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { theme, isDark } = useTheme();

    // Fetch chi tiết từng Pokemon yêu thích
    const loadDetails = useCallback(async () => {
        if (favourites.length === 0) {
            setPokemonDetails([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const details = await Promise.all(
                favourites.map(async (name) => {
                    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                    const data = await res.json();
                    return {
                        id: data.id,
                        name: data.name,
                        image: data.sprites.other['official-artwork'].front_default,
                        types: data.types,
                    };
                })
            );
            setPokemonDetails(details);
        } catch (e) {
            console.log(e);
        }
    }, [favourites]);

    // Tự động reload mỗi khi vào trang (quan trọng!)
    useFocusEffect(
        useCallback(() => {
            loadDetails();
        }, [loadDetails])
    );

    if (pokemonDetails.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: theme.background[0] }}>
                <Ionicons name="heart-outline" size={80} color={isDark ? '#4A4468' : '#C7D2FE'} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.textPrimary, marginTop: 15, textAlign: 'center' }}>
                    Chưa có Pokemon yêu thích
                </Text>
                <Text style={{ fontSize: 14, color: theme.textSecondary, textAlign: 'center', marginTop: 8 }}>
                    Hãy bấm vào trái tim ở trang chi tiết để thêm vào đây nhé!
                </Text>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={theme.background as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}
        >
            <FlatList
                data={pokemonDetails}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={{ gap: 16, padding: 16 }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item: pokemon }) => (
                    <Link
                        href={{ pathname: "/details", params: { name: pokemon.name } }}
                        style={{
                            // @ts-ignore
                            backgroundColor: isDark
                                ? colorByType[pokemon.types[0].type.name] + '30' 
                                : colorByType[pokemon.types[0].type.name] + '40',
                            borderRadius: 20,
                            padding: 10,
                            width: 170,
                        }}
                    >
                        <Image source={{ uri: pokemon.image }} style={{ width: 150, height: 150 }} />

                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.textPrimary, textTransform: 'capitalize', marginTop: 5 }}>
                            {pokemon.name}
                        </Text>
                        <Text style={{ fontSize: 13, color: theme.textSecondary, textTransform: 'capitalize' }}>
                            {pokemon.types[0].type.name}
                        </Text>
                        <Text style={{ fontSize: 13, color: theme.textMuted, fontWeight: '600', marginTop: 4 }}>
                            #{String(pokemon.id).padStart(3, "0")}
                        </Text>
                    </Link>
                )}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    name: {
        fontSize: 16, fontWeight: 'bold', color: '#1F2937', textTransform: 'capitalize', marginTop: 5

    },

    type: {
        fontSize: 13, color: '#6B7280', textTransform: 'capitalize'
    },
    id: {
        fontSize: 13, color: '#9CA3AF', fontWeight: '600', marginTop: 4
    },
})