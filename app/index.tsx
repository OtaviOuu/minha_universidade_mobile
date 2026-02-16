import { Text, View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";

interface University {
  id: string;
  attributes: {
    name: string;
    acronym: string;
    logo_url: string;
  };
}

const fetchUniversity = async (): Promise<University> => {
  const response = await fetch(
    "https://minha-universidade.onrender.com/api/json/universities",
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.data && data.data.length > 0) {
    return data.data[0];
  }

  throw new Error("No university data found");
};

export default function Index() {
  const {
    data: university,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["university"],
    queryFn: fetchUniversity,
    retry: false,
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (isError || !university) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Não foi possível carregar a universidade</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.universityCard}>
        <Image
          style={styles.universityLogo}
          source={{
            uri: university.attributes.logo_url,
          }}
          resizeMode="contain"
        />
        <Text style={styles.universityName}>{university.attributes.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  universityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  universityLogo: {
    width: 150,
    height: 100,
    marginBottom: 16,
  },
  universityName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
  },
});
