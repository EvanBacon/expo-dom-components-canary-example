import React from "react";
import { View, Image, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ClockIcon, StarIcon, HeartIcon } from "lucide-react-native";

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  profile: {
    banner: string;
  };
  deliveryTime: string;
  rating: number;
  popular: boolean;
}

interface RestaurantListProps {
  restaurants: Restaurant[];
  navigate: any;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const RestaurantList = ({
  restaurants,
  navigate,
  favorites,
  toggleFavorite,
}: RestaurantListProps) => {
  return (
    <View style={styles.listContainer}>
      {restaurants.map((restaurant) => (
        <AnimatedRestaurantCard
          key={restaurant._id}
          restaurant={restaurant}
          navigate={navigate}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </View>
  );
};

interface AnimatedRestaurantCardProps {
  restaurant: Restaurant;
  navigate: (path: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const AnimatedRestaurantCard = ({
  restaurant,
  navigate,
  favorites,
  toggleFavorite,
}: AnimatedRestaurantCardProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const favoriteScale = useSharedValue(1);

  const favoriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

  const handleFavoritePress = (event: any) => {
    event.stopPropagation();
    favoriteScale.value = withSpring(
      1.2,
      { damping: 15, stiffness: 300 },
      () => {
        favoriteScale.value = withSpring(1, { damping: 15, stiffness: 300 });
      },
    );
    toggleFavorite(restaurant._id);
  };
  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => navigate(`/restaurant/${restaurant._id}`)}
      style={styles.pressableContainer}
    >
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        {restaurant.popular && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>פופולרי</Text>
          </View>
        )}
        <Image
          source={{ uri: restaurant.profile.banner }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
            </View>
            <Pressable onPress={handleFavoritePress}>
              <Animated.View style={[favoriteAnimatedStyle]}>
                <HeartIcon
                  color={
                    favorites.includes(restaurant._id) ? "#FD8000" : "#666"
                  }
                  size={26}
                  fill={favorites.includes(restaurant._id) ? "#FD8000" : "none"}
                />
              </Animated.View>
            </Pressable>
          </View>
          <View style={styles.badgeContainer}>
            <View style={styles.infoBadge}>
              <ClockIcon color="#000" size={16} />
              <Text>{restaurant.deliveryTime} דקות</Text>
            </View>
            <View style={styles.infoBadge}>
              <StarIcon size={16} color="#000" />
              <Text>{restaurant.rating}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 16,
  },
  pressableContainer: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF8000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  bannerImage: {
    width: "100%",
    height: 192,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "left",
    fontFamily: "fredoka",
  },
  restaurantAddress: {
    color: "#666",
    fontSize: 14,
    textAlign: "left",
    fontFamily: "fredoka",
  },
  badgeContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  infoBadge: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    backgroundColor: "#EEE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
});

export default RestaurantList;
