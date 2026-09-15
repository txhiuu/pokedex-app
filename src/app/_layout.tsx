import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
      <Stack.Screen name="index" options={{ title:"Pokedex", headerTitleAlign:'center'}} />
      <Stack.Screen name="details" options={{
        title:"Details",
        headerBackButtonDisplayMode:'generic', 
        presentation:"formSheet",
        sheetAllowedDetents:[0.9],
        
      }}
      />
    
  </Stack>
  )
}
