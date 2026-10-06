import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const KEY_DARK = '@pokedex_dark_mode';
const KEY_ANIM = '@pokedex_animation';
const KEY_FAV_TYPE = '@pokedex_favourite_types';

export function useSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [animation, setAnimation] = useState(true);
  const [favouriteTypes, setFavouriteTypes] = useState<string[]>([]);

  //Đọc dữ liệu 1 lần khi mount
  const loadSettings = useCallback(async () => {
    try {
      const [dark, anim, favType] = await Promise.all([
        AsyncStorage.getItem(KEY_DARK),
        AsyncStorage.getItem(KEY_ANIM),
        AsyncStorage.getItem(KEY_FAV_TYPE),
      ]);
      setDarkMode(dark === 'true');
      setAnimation(anim !== 'false'); // Mặc định là true
      setFavouriteTypes(favType ? JSON.parse(favType) : []);
    } catch (e) {
      console.log('Lỗi đọc settings:', e);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    await AsyncStorage.setItem(KEY_DARK, String(value));
  };

  const toggleAnimation = async (value: boolean) => {
    setAnimation(value);
    await AsyncStorage.setItem(KEY_ANIM, String(value));
  };

  const toggleFavouriteType = async (type: string) => {
    let newList: string[];
    if (favouriteTypes.includes(type)) {
      newList = favouriteTypes.filter((t) => t !== type);
    } else {
      newList = [...favouriteTypes, type];
    }
    setFavouriteTypes(newList);
    await AsyncStorage.setItem(KEY_FAV_TYPE, JSON.stringify(newList));
  };

  return {
    darkMode,
    animation,
    favouriteTypes,
    toggleDarkMode,
    toggleAnimation,
    toggleFavouriteType,
  };
}