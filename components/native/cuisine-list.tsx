import React from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from "react-native-reanimated";

interface Category {
  name: string;
  places: number;
  image: string;
}

interface CategoryListProps {
  categories: Category[];
}

const CategoriesList = ({ categories }: CategoryListProps) => {
  return (
    <FlatList
      data={categories}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.name}
      renderItem={({ item, index }) => (
        <CategoryCard
          category={item}
          index={index}
          totalCategories={categories.length + 1}
        />
      )}
      contentContainerStyle={{
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 2,
      }}
    />
  );
};

interface CategoryCardProps {
  category: Category;
  index: number;
  totalCategories: number;
}

const CategoryCard = ({
  category,
  index,
  totalCategories,
}: CategoryCardProps) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(50);
  const scale = useSharedValue(1); // Shared value for press animation

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withDelay(200 + index * 200, withTiming(1, { duration: 300 })),
      transform: [
        {
          translateX: withDelay(
            200 + index * 200,
            withTiming(0, { duration: 300 }),
          ),
        },
        { scale: scale.value }, // Scale effect on press
      ],
    };
  }, [index]);

  // Handle press in and out animations
  const handlePressIn = () => {
    scale.value = withSpring(0.95); // Scale down slightly
  };

  const handlePressOut = () => {
    scale.value = withSpring(1); // Return to normal scale
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => console.log(`${category.name} pressed`)}
    >
      <Animated.View
        style={[
          styles.cardContainer,
          animatedStyle,
          {
            marginRight: 8,
            marginLeft: index === totalCategories - 1 ? 16 : 0,
          },
        ]}
      >
        <View style={styles.card}>
          <Image
            source={{ uri: category.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{category.name}</Text>
            <Text style={styles.cardSubtitle}>{category.places} מקומות</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexShrink: 0,
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 108,
  },
  cardContent: {
    padding: 8,
    paddingBottom: 12,
  },
  cardTitle: {
    fontWeight: "600",
    fontFamily: "fredoka",
    fontSize: 14,
    textAlign: "left",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
    fontFamily: "fredoka",
    textAlign: "left",
  },
});

export default CategoriesList;
