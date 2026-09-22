import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
      <Stack.Screen name="index" options={{ title:"Pokedex", headerTitleAlign:'center', headerStyle: { backgroundColor: '#FEF2F2' }, headerShadowVisible: false }} />
      <Stack.Screen name="details" options={{
        title:"Details",
        headerBackButtonDisplayMode:'minimal', 
        presentation: "formSheet",
        headerShown: true,
        sheetAllowedDetents:[0.95]
      }}
      />
  </Stack>
  )
}
