"use dom";

import "@/global.css";

import ShadLayout from "@/components/shad/shad-layout";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGlobalButtonHaptics } from "../global-button-haptics";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChevronLeft, Heart, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollView, View } from "react-native";
import { useRestaurantStore } from "@/lib/store/restaurantStore";

export default function DashboardRoute({
  navigate,
  notify,
  onButtonClick,
  restaurants,
}: {
  notify: () => void;
  onButtonClick: (size: number) => Promise<void>;
} & Props) {
  useGlobalButtonHaptics(onButtonClick);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  return (
    <ShadLayout navigate={navigate}>
      <TooltipProvider>
        <div
          className="bg-background text-foreground relative min-h-screen w-screen pb-4 "
          dir="rtl"
        >
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center p-4">
                <h2 className="text-2xl font-semibold">אני רוצה לאכול..</h2>
                <Button
                  variant="link"
                  className="text-[#FF8000] px-2 flex items-center hover:text-[#FF8000]/80 bg-[#FF8000]/10 "
                  onClick={() => navigate("/categories")}
                >
                  ראה הכל
                </Button>
              </div>
              <ScrollView
                style={{
                  flex: 1,
                  flexDirection: "row",
                  overflow: "scroll",
                  flexWrap: "nowrap",
                }}
                showsVerticalScrollIndicator={false}
              >
                <div className="flex space-x-3 space-x-reverse pb-3 pr-1 ">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.2 + index * 0.2,
                      }}
                      className={"mr-2"}
                    >
                      <Card
                        className={`w-32 flex-shrink-0 ${
                          index === categories.length - 1 ? "ml-4" : ""
                        }`}
                      >
                        <CardContent className="p-0">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-24 object-cover rounded-t-lg"
                          />
                          <div className="p-2">
                            <h3 className="font-semibold mt-2 text-right">
                              {category.name}
                            </h3>
                            <p className="text-sm text-muted-foreground text-right">
                              {category.places} מקומות
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollView>
            </div>

            <div className="p-3 pt-0">
              <h2 className="text-2xl font-semibold pb-4">כל המסעדות</h2>
              <div className="space-y-4">
                {restaurants.map((restaurant: any) => (
                  <AnimatedCard key={restaurant._id}>
                    <Card
                      className="relative overflow-hidden"
                      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                    >
                      <CardContent className="p-0">
                        {restaurant.popular && (
                          <Badge className="absolute top-2 left-2 bg-[#FF8000] text-white">
                            פופולרי
                          </Badge>
                        )}
                        <img
                          src={restaurant.profile.banner}
                          alt={restaurant.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold">
                                {restaurant.name}
                              </h3>
                              <p className="text-muted-foreground">
                                {restaurant.address}
                              </p>
                            </div>
                            <button
                              onClick={() => toggleFavorite(restaurant.id)}
                              className="text-muted-foreground hover:text-[#FF8000] transition-colors"
                            >
                              <Heart
                                className={`h-6 w-6 ${
                                  favorites.includes(restaurant.id)
                                    ? "fill-current text-[#FF8000]"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center mt-2 space-x-2 space-x-reverse flex-wrap">
                            <Badge variant="secondary">
                              <Clock className="h-4 w-4 ml-1" />
                              {restaurant.deliveryTime} דקות
                            </Badge>
                            <Badge variant="secondary">
                              <Star className="h-4 w-4 ml-1 fill-current" />
                              {restaurant.rating}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </ShadLayout>
  );
}
function AnimatedCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
}

const restaurants = [
  {
    id: 1,
    name: "דובנוב 8",
    type: "ביסטרו ארוחת בוקר",
    image: "/placeholder.svg?height=300&width=400",
    rating: 8.6,
    price: 4,
    deliveryTime: "45-55",
    popular: true,
  },
  {
    id: 2,
    name: "מסעדת השף",
    type: "מסעדה איטלקית",
    image: "/placeholder.svg?height=300&width=400",
    rating: 9.2,
    price: 3,
    deliveryTime: "30-40",
    popular: false,
  },
  {
    id: 3,
    name: "סושי בר",
    type: "מסעדה יפנית",
    image: "/placeholder.svg?height=300&width=400",
    rating: 8.9,
    price: 4,
    deliveryTime: "40-50",
    popular: true,
  },
  {
    id: 4,
    name: "פלאפל הזהב",
    type: "אוכל רחוב",
    image: "/placeholder.svg?height=300&width=400",
    rating: 9.0,
    price: 2,
    deliveryTime: "20-30",
    popular: false,
  },
  {
    id: 5,
    name: "פיצה נפוליטנה",
    type: "פיצרייה",
    image: "/placeholder.svg?height=300&width=400",
    rating: 8.7,
    price: 3,
    deliveryTime: "25-35",
    popular: true,
  },
];

const categories = [
  {
    name: "אוכל רחוב",
    places: 281,
    image: "/placeholder.svg?height=100&width=100",
  },
  { name: "סלט", places: 200, image: "/placeholder.svg?height=100&width=100" },
  { name: "כשר", places: 221, image: "/placeholder.svg?height=100&width=100" },
  { name: "פיצה", places: 150, image: "/placeholder.svg?height=100&width=100" },
  {
    name: "המבורגר",
    places: 180,
    image: "/placeholder.svg?height=100&width=100",
  },
];

type Props = {
  navigate: (typeof import("expo-router").router)["navigate"];

  ref?: import("react").RefObject<import("react-native-webview").WebView>;
  dom?: import("expo/dom").DOMProps;
  restaurants: any;
};
