import { Text, View, Image, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View>
      <View style={styles.universityCard}>
        <Image
          style={styles.universityLogo}
          source={{
            uri: "https://scs.usp.br/identidadevisual/wp-content/uploads/2022/08/usp-logo-eps.jpg",
          }}
        />
      </View>
      <View style={styles.universityCard}>
        <Image
          style={styles.universityLogo}
          source={{
            uri: "https://scs.usp.br/identidadevisual/wp-content/uploads/2022/08/usp-logo-eps.jpg",
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  universityCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,

    alignItems: "center", // centraliza horizontal
  },
  universityLogo: {
    width: 150,
    height: 100,
  },
});
