import { StyleSheet, Text, View } from "react-native";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>
      <Text style={styles.subtitle}>
        Updating!!!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});