import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@pokedex_favourites';

export function useFavourites(pokemonName?: string) {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [isFav, setIsFav] = useState(false);

  // Đọc danh sách từ AsyncStorage
  const loadFavourites = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      setFavourites(list);
      if (pokemonName) {
        setIsFav(list.includes(pokemonName));
      }
    } catch (e) {
      console.log('Lỗi đọc favourites:', e);
    }
  }, [pokemonName]);

  useEffect(() => {
    loadFavourites();
  }, [loadFavourites]);

  // Thêm/xóa khỏi yêu thích
  const toggleFavourite = async () => {
    if (!pokemonName) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      let list: string[] = raw ? JSON.parse(raw) : [];

      if (list.includes(pokemonName)) {
        list = list.filter((n) => n !== pokemonName);
        setIsFav(false);
      } else {
        list.push(pokemonName);
        setIsFav(true);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setFavourites(list);
    } catch (e) {
      console.log('Lỗi toggle favourite:', e);
    }
  };

  return { favourites, isFav, toggleFavourite, reload: loadFavourites };
}