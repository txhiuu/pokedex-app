import { Stack } from "expo-router";
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';


export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Stack>
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
