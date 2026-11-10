import { Text, View } from 'react-native';

interface MovesTabProps {
  movesData: string[];
  theme: any;
}

export default function MovesTab({ movesData, theme }: MovesTabProps) {
  return (
    <View style={{
      marginTop: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8
    }}>
      {movesData.map((moveName, index) => (
        <View
          key={index}
          style={{
            backgroundColor: theme.cardBg,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Text style={{ color: theme.textPrimary, fontSize: 13 }}>
            {moveName}
          </Text>
        </View>
      ))}
    </View>
  );
}