import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { en } from '../languages/en';
import { TranslationKey, vi } from '../languages/vi';

const KEY_LANG = '@pokedex_language';

type Language = 'vi' | 'en';

const translations = { vi, en };

interface LanguageContextType {
  language: Language;
  t: (key: TranslationKey) => string;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  t: (key) => key,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    async function load() {
      try {
        const saved = await AsyncStorage.getItem(KEY_LANG);
        if (saved === 'vi' || saved === 'en') {
          setLanguageState(saved);
        }
      } catch (e) {
        console.log('Lỗi đọc ngôn ngữ:', e);
      }
    }
    load();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(KEY_LANG, lang);
  }, []);

  // Hàm "dịch": nhận key, trả về chuỗi theo ngôn ngữ hiện tại
  const t = useCallback(
    (key: TranslationKey) => translations[language][key] || key,
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}