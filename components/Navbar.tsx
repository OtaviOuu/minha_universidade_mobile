import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function Navbar() {
  return (
    <SafeAreaView edges={["top"]} style={styles.navbar}>
      <Text style={styles.logo}>MinhaUniversidade</Text>
      <View style={styles.navLinks}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  navLinks: {
    flexDirection: "row",
    gap: 12,
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#2c3e50",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
