import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';


const KEY_DARK = '@pokedex_dark_mode';

// ============ 2 BỘ MÀU ============
export const themes = {
  light: {
    background: ['#EEF2FF', '#E0E7FF'],
    surface: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    accent: '#5B4B8A',
    accentLight: '#EEF2FF',
    border: '#F3F4F6',
    divider: '#F3F4F6',
    searchBg: '#F3F4F6',
    cardBg: '#F9FAFB',
    isDark: false,
  },
  dark: {
    background: ['#0F0E1B', '#1A1830'],
    surface: '#1E1B3A',
    textPrimary: '#F9FAFB',
    textSecondary: '#A1A1B5',
    textMuted: '#8B8BA0',
    accent: '#A78BFA',
    accentLight: '#2D2A4A',
    border: '#2D2A4A',
    divider: '#2D2A4A',
    searchBg: '#2D2A4A',
    cardBg: '#252245',
    isDark: true,
  },
};

interface Theme {
  background: string[];  // Mảng string thường, không readonly
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  border: string;
  divider: string;
  searchBg: string;
  cardBg: string;
  isDark: boolean;
}

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: (value: boolean) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.light,
  isDark: false,
  toggleTheme: () => {},
  isLoading: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Đọc theme đã lưu khi mở app
  useEffect(() => {
    async function load() {
      try {
        const val = await AsyncStorage.getItem(KEY_DARK);
        setIsDark(val === 'true');
      } catch (e) {
        console.log('Lỗi đọc theme:', e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const toggleTheme = useCallback(async (value: boolean) => {
    setIsDark(value);
    await AsyncStorage.setItem(KEY_DARK, String(value));
  }, []);

  const theme = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook để dùng ở bất kỳ component nào
export function useTheme() {
  return useContext(ThemeContext);
}