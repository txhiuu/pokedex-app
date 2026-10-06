import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const KEY_SEEN = '@pokedex_seen';

export function useSeenPokemon() {
  const [seenCount, setSeenCount] = useState(0);

  const loadSeen = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY_SEEN);
      const list: string[] = raw ? JSON.parse(raw) : [];
      setSeenCount(list.length);
    } catch (e) {
      console.log('Lỗi đọc seen:', e);
    }
  }, []);

  useEffect(() => {
    loadSeen();
  }, [loadSeen]);

  const markAsSeen = async (name: string) => {
    try {
      const raw = await AsyncStorage.getItem(KEY_SEEN);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(name)) {
        list.push(name);
        await AsyncStorage.setItem(KEY_SEEN, JSON.stringify(list));
        setSeenCount(list.length);
      }
    } catch (e) {
      console.log('Lỗi đánh dấu seen:', e);
    }
  };

  return { seenCount, markAsSeen, reload: loadSeen };
}