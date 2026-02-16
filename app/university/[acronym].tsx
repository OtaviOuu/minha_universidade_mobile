import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

interface TeacherDiscipline {
  id: string;
  attributes: {
    teacher_id: string;
    discipline_id: string;
  };
}

interface TeacherDisciplinesResponse {
  data: TeacherDiscipline[];
}

const fetchTeacherDisciplines = async (acronym: string): Promise<TeacherDiscipline[]> => {
  const response = await fetch(
    `https://minha-universidade.onrender.com/api/json/teacher-disciplines?fields%5Bteacher_discipline%5D=id%2Cteacher_id%2Cdiscipline_id&university_acronym=${acronym}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.api+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: TeacherDisciplinesResponse = await response.json();
  return data.data || [];
};

export default function UniversityDetails() {
  const { acronym, name } = useLocalSearchParams<{ acronym: string; name: string }>();

  const { data: teacherDisciplines, isLoading, isError } = useQuery({
    queryKey: ["teacherDisciplines", acronym],
    queryFn: () => fetchTeacherDisciplines(acronym),
    retry: false,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2c3e50" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Erro ao carregar disciplinas</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>
          {teacherDisciplines?.length || 0} disciplinas encontradas
        </Text>
      </View>

      <FlatList
        data={teacherDisciplines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.disciplineCard}>
            <Text style={styles.disciplineId}>ID: {item.id.slice(0, 8)}...</Text>
            <View style={styles.disciplineInfo}>
              <Text style={styles.infoLabel}>Professor ID:</Text>
              <Text style={styles.infoValue}>{item.attributes.teacher_id.slice(0, 8)}...</Text>
            </View>
            <View style={styles.disciplineInfo}>
              <Text style={styles.infoLabel}>Disciplina ID:</Text>
              <Text style={styles.infoValue}>{item.attributes.discipline_id.slice(0, 8)}...</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma disciplina encontrada</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  listContainer: {
    padding: 16,
  },
  disciplineCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disciplineId: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  disciplineInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
