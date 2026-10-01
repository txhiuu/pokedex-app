import { Ionicons } from '@expo/vector-icons';
import { useGlobalSearchParams } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useFavourites } from '../hooks/useFavourites';

export default function FavouriteButton() {
  const params = useGlobalSearchParams();
  const pokemonName = Array.isArray(params.name) ? params.name[0] : params.name;

  const { isFav, toggleFavourite } = useFavourites(pokemonName as string);

  return (
    <TouchableOpacity
      onPress={toggleFavourite}
      style={{ marginRight: 16, padding: 4 }}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isFav ? 'heart' : 'heart-outline'}
        size={26}
        color={isFav ? '#EF4444' : '#1F2937'}
      />
    </TouchableOpacity>
  );
}