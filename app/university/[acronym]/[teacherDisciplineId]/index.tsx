import { useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

interface Review {
  id: string;
  attributes: {
    didactics_rate: number | null;
    exams_rate: number | null;
    "enforces_attendance?": boolean | null;
    geral_rating: number | null;
    "recommends?": boolean | null;
  };
}

interface ReviewsResponse {
  data: Review[];
}

const fetchReviews = async (teacherDisciplineId: string): Promise<Review[]> => {
  const response = await fetch(
    `https://minha-universidade.onrender.com/api/json/reviews?teacher_discipline_id=${teacherDisciplineId}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: ReviewsResponse = await response.json();

  return data.data || [];
};

const Badge = ({
  label,
  value,
  type = "rating",
}: {
  label: string;
  value: number | boolean | null;
  type?: "rating" | "boolean";
}) => {
  if (value === null) return null;

  const getBadgeStyle = () => {
    if (type === "boolean") {
      return value ? styles.badgeTrue : styles.badgeFalse;
    }
    const numValue = value as number;
    if (numValue >= 7) return styles.badgeHigh;
    if (numValue >= 5) return styles.badgeMedium;
    return styles.badgeLow;
  };

  const displayValue =
    type === "boolean" ? (value ? "Sim" : "Não") : `${value}/10`;

  return (
    <View style={[styles.badge, getBadgeStyle()]}>
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text style={styles.badgeValue}>{displayValue}</Text>
    </View>
  );
};

export default function ReviewsPage() {
  const { teacherDisciplineId, acronym } = useLocalSearchParams<{
    teacherDisciplineId: string;
    acronym: string;
  }>();

  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reviews", teacherDisciplineId],
    queryFn: () => fetchReviews(teacherDisciplineId),
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
        <Text style={styles.errorText}>Erro ao carregar avaliações</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Avaliações: {teacherDisciplineId}</Text>
        <Text style={styles.subtitle}>
          {reviews?.length || 0} avaliações encontradas
        </Text>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.badgesContainer}>
              <Badge
                label="Didática"
                value={item.attributes.didactics_rate}
                type="rating"
              />
              <Badge
                label="Provas"
                value={item.attributes.exams_rate}
                type="rating"
              />
              <Badge
                label="Avaliação Geral"
                value={item.attributes.geral_rating}
                type="rating"
              />
            </View>

            <View style={styles.badgesContainer}>
              <Badge
                label="Cobra presença"
                value={item.attributes["enforces_attendance?"]}
                type="boolean"
              />
              <Badge
                label="Recomenda"
                value={item.attributes["recommends?"]}
                type="boolean"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma avaliação encontrada</Text>
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
  reviewCard: {
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
  reviewId: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
    fontWeight: "600",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 2,
    color: "#fff",
    opacity: 0.9,
  },
  badgeValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  badgeHigh: {
    backgroundColor: "#27ae60",
  },
  badgeMedium: {
    backgroundColor: "#f39c12",
  },
  badgeLow: {
    backgroundColor: "#e74c3c",
  },
  badgeTrue: {
    backgroundColor: "#3498db",
  },
  badgeFalse: {
    backgroundColor: "#95a5a6",
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
