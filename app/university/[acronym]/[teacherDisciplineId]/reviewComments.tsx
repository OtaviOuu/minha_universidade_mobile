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
    user_id: string;
    didactics_rate: number | null;
    exams_rate: number | null;
    exams_comments: string | null;
    "enforces_attendance?": boolean | null;
    enforces_attendance_comments: string | null;
    geral_rating: number | null;
    geral_comments: string | null;
    "recommends?": boolean | null;
    teacher_discipline_id: string;
  };
}

interface ReviewsResponse {
  data: Review[];
}

const fetchReviewById = async (
  teacherDisciplineId: string,
  reviewId: string,
): Promise<Review | null> => {
  const params = new URLSearchParams({
    "fields[review]":
      "id,didactics_rate,exams_rate,exams_comments,enforces_attendance?,enforces_attendance_comments,geral_rating,geral_comments,recommends?,user_id,teacher_discipline_id",
    teacher_discipline_id: teacherDisciplineId,
  });

  const response = await fetch(
    `https://minha-universidade.onrender.com/api/json/reviews?${params.toString()}`,
    {
      method: "GET",
      headers: {
        accept: "application/vnd.api+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: ReviewsResponse = await response.json();

  return data.data.find((review) => review.id === reviewId) || null;
};

const RatingBadge = ({ rating }: { rating: number | null }) => {
  if (rating === null) return null;

  const getBadgeColor = () => {
    if (rating >= 7) return "#27ae60";
    if (rating >= 5) return "#f39c12";
    return "#e74c3c";
  };

  return (
    <View style={[styles.ratingBadge, { backgroundColor: getBadgeColor() }]}>
      <Text style={styles.ratingText}>{rating}/10</Text>
    </View>
  );
};

const CommentSection = ({
  title,
  comment,
}: {
  title: string;
  comment: string | null;
}) => {
  if (!comment) return null;

  return (
    <View style={styles.commentSection}>
      <Text style={styles.commentTitle}>{title}</Text>
      <Text style={styles.commentText}>{comment}</Text>
    </View>
  );
};

const BooleanBadge = ({
  label,
  value,
}: {
  label: string;
  value: boolean | null;
}) => {
  if (value === null) return null;

  return (
    <View
      style={[styles.booleanBadge, value ? styles.badgeYes : styles.badgeNo]}
    >
      <Text style={styles.booleanLabel}>{label}</Text>
      <Text style={styles.booleanValue}>{value ? "Sim" : "Não"}</Text>
    </View>
  );
};

export default function ReviewCommentsPage() {
  const { teacherDisciplineId, acronym, reviewId } = useLocalSearchParams<{
    teacherDisciplineId: string;
    acronym: string;
    reviewId: string;
  }>();

  const {
    data: review,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reviewComments", teacherDisciplineId, reviewId],
    queryFn: () => fetchReviewById(teacherDisciplineId, reviewId),
    retry: false,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2c3e50" />
        <Text style={styles.loadingText}>Carregando comentários...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>
          Erro ao carregar comentários das avaliações
        </Text>
      </SafeAreaView>
    );
  }

  if (!review) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>Avaliação não encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Detalhes da Avaliação</Text>
        </View>

        <View style={styles.content}>
          {/* Seção de Badges */}
          <View style={styles.badgesSection}>
            <Text style={styles.sectionTitle}>Avaliações</Text>

            <View style={styles.ratingsGrid}>
              <View style={styles.ratingItem}>
                <Text style={styles.ratingLabel}>Avaliação Geral</Text>
                <RatingBadge rating={review.attributes.geral_rating} />
              </View>

              <View style={styles.ratingItem}>
                <Text style={styles.ratingLabel}>Didática</Text>
                <RatingBadge rating={review.attributes.didactics_rate} />
              </View>

              <View style={styles.ratingItem}>
                <Text style={styles.ratingLabel}>Provas</Text>
                <RatingBadge rating={review.attributes.exams_rate} />
              </View>
            </View>

            <View style={styles.booleansRow}>
              <BooleanBadge
                label="Recomenda"
                value={review.attributes["recommends?"]}
              />
              <BooleanBadge
                label="Cobra Presença"
                value={review.attributes["enforces_attendance?"]}
              />
            </View>
          </View>

          <View style={styles.divider} />

          {/* Seção de Comentários */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>Comentários</Text>

            <CommentSection
              title="Comentário Geral"
              comment={review.attributes.geral_comments}
            />

            <CommentSection
              title="Sobre as Provas"
              comment={review.attributes.exams_comments}
            />

            <CommentSection
              title="Sobre Presença"
              comment={review.attributes.enforces_attendance_comments}
            />
          </View>
        </View>
      </ScrollView>
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
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  badgesSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingsGrid: {
    gap: 16,
    marginBottom: 20,
  },
  ratingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 60,
    alignItems: "center",
  },
  ratingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  booleansRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  booleanBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  badgeYes: {
    backgroundColor: "#3498db",
  },
  badgeNo: {
    backgroundColor: "#95a5a6",
  },
  booleanLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  booleanValue: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
  },
  commentsSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentSection: {
    marginBottom: 20,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
