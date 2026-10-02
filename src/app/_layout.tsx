import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    < SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Pokedex", headerTitleAlign: 'center', headerStyle: { backgroundColor: '#FEF2F2' }, headerShadowVisible: false }} />
        <Stack.Screen name="details" options={{
          title: "Details",
          headerBackButtonDisplayMode: 'minimal',
          presentation: "formSheet",
          headerShown: true,
          sheetAllowedDetents: [0.95]
        }}
        />
        <Stack.Screen
          name="favourite"
          options={{
            title: "Yêu thích",
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#EEF2FF' },
            headerShadowVisible: false,
            headerTintColor: '#5B4B8A',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Cài đặt",
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#EEF2FF' },
            headerShadowVisible: false,
            headerTintColor: '#5B4B8A',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  )
}
