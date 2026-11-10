import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const KEY_HISTORY = '@pokedex_search_history';
const MAX_HISTORY = 10; // Chỉ lưu 10 từ khóa gần nhất

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  const loadHistory = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY_HISTORY);
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addSearch = async (keyword: string) => {
    const cleanKeyword = keyword.trim().toLowerCase();
    if (!cleanKeyword) return;

    try {
      let newHistory = history.filter(item => item !== cleanKeyword); // Xóa trùng
      newHistory.unshift(cleanKeyword); // Đưa lên đầu
      newHistory = newHistory.slice(0, MAX_HISTORY); // Giới hạn 10

      setHistory(newHistory);
      await AsyncStorage.setItem(KEY_HISTORY, JSON.stringify(newHistory));
    } catch (e) {
      console.log(e);
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem(KEY_HISTORY);
  };

  return { history, addSearch, clearHistory };
}