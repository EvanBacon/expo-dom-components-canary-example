import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { useLoginStore } from "./loginStore";

interface Restaurant {
  _id: string;
  profile?: {
    name?: string;
    picture?: string;
    banner?: string;
  };
  operatinData?: {
    status: "Open" | "Closed";
    sunday: { open: string; close: string; isClosed: boolean };
    monday: { open: string; close: string; isClosed: boolean };
    tuesday: { open: string; close: string; isClosed: boolean };
    wednesday: { open: string; close: string; isClosed: boolean };
    thursday: { open: string; close: string; isClosed: boolean };
    friday: { open: string; close: string; isClosed: boolean };
    saturday: { open: string; close: string; isClosed: boolean };
  };
  name: string;
  categories?: string;
  rating?: number;
  cuisine?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  location: {
    type: any;
    coordinates: [number, number];
  };
  distance?: number;
  deliveryTime?: number;
  menuId?: string;
}

interface RestaurantStore {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  setRestaurants: (restaurants: Restaurant[]) => void;
  setSelectedRestaurant: (selectedRestaurant: Restaurant) => void;
  fetchRestaurants: () => Promise<void>;
}

export const useRestaurantStore = create<RestaurantStore>()(
  persist(
    (set) => ({
      restaurants: [],
      selectedRestaurant: null,

      setRestaurants: (restaurants: Restaurant[]) => set({ restaurants }),

      setSelectedRestaurant: (selectedRestaurant) =>
        set({ selectedRestaurant }),

      fetchRestaurants: async () => {
        try {
          const { token, tenantId } = useLoginStore.getState();
          const response: AxiosResponse = await axios.get<Restaurant[]>(
            `https://api.aionsites.com/restaurants/${tenantId}/app/all`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const restaurants = response.data;
          set({ restaurants });
        } catch (error) {
          console.error("Error fetching restaurants:", error);
        }
      },
    }),
    {
      name: "restaurant-store", // unique name for the storage
      getStorage: () => AsyncStorage, // Use AsyncStorage for React Native
    },
  ),
);
