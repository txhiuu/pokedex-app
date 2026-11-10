import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';

export const unstable_settings = {
  initialRouteName: 'onboarding',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Stack>
          <Stack.Screen
            name="onboarding"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="index" options={{ title: "Pokedex", headerTitleAlign: 'center' }} />
          <Stack.Screen
            name="details"
            options={{
              title: "Details",
              headerBackButtonDisplayMode: 'minimal',
              presentation: "formSheet",
              headerShown: true,
              sheetAllowedDetents: [0.95],
            }}
          />
          <Stack.Screen name="favourite" options={{ title: "Yêu thích", headerTitleAlign: 'center' }} />
          <Stack.Screen name="settings" options={{ title: "Cài đặt", headerTitleAlign: 'center' }} />
        </Stack>
      </LanguageProvider>
    </ThemeProvider>
  );
}
