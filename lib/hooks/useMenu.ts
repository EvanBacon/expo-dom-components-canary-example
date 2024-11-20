import { useAuth } from "@/components/providers/auth-provider";
import axios, { AxiosResponse } from "axios";
import { create } from "zustand";
import { useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  desc: string;
  index: number;
}

interface MenuStoreProps {
  restaurantId: string | null;
  menu: any;
  categories: Category[];
  categoryRefs: { [key: string]: React.RefObject<any> };
  loading: boolean;
  setRestaurantId: (id: string) => void;
  setMenu: (menu: any, categories: Category[]) => void;
  setLoading: (loading: boolean) => void;
  setCategoryRef: (key: any, ref: any) => void;
}

// Zustand store to manage restaurantId, menu, categories, and loading
export const useMenuStore = create<MenuStoreProps>((set) => ({
  restaurantId: null, // Store the last selected restaurantId
  menu: {},
  categories: [],
  categoryRefs: {},
  loading: true,
  setRestaurantId: (id: string) => set({ restaurantId: id }),
  setMenu: (menu: any, categories: Category[]) => set({ menu, categories }),
  setLoading: (loading: boolean) => set({ loading }),
  setCategoryRef: (key: any, ref: any) =>
    set((state) => ({
      categoryRefs: {
        ...state.categoryRefs,
        [key]: ref,
      },
    })),
}));

// The useMenu hook
export default function useMenu(restaurantId?: string) {
  const { token } = useAuth();
  const {
    menu,
    categories,
    loading,
    setRestaurantId,
    setMenu,
    setLoading,
    restaurantId: storedRestaurantId,
  } = useMenuStore();

  // Use the provided restaurantId or fallback to the last selected restaurantId from Zustand state
  const activeRestaurantId = restaurantId || storedRestaurantId;

  useEffect(() => {
    // If no restaurantId is available (neither passed nor stored), we do nothing
    if (!activeRestaurantId) {
      setLoading(false);
      return;
    }

    // Store the restaurantId if not already stored or provided
    if (!restaurantId) {
      setRestaurantId(activeRestaurantId);
    }

    // If the menu is already cached, use it
    if (menu[activeRestaurantId]) {
      setLoading(false); // Menu is already cached, so we don't fetch again
      setRestaurantId(activeRestaurantId); // Update the stored restaurantId
      return;
    }

    // Fetch the menu from the API
    async function fetchMenu() {
      setLoading(true);
      try {
        const response: AxiosResponse<any> = await axios.get(
          `https://api.aionsites.com/restaurants/${activeRestaurantId}/menu`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              contentType: "application/json",
            },
          },
        );

        // Store the fetched menu and categories in Zustand
        setMenu(
          { [activeRestaurantId as string]: response?.data?.items || [] },
          response?.data?.categories?.sort(
            async (a: Category, b: Category) => a.index - b.index,
          ) || [],
        );
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [activeRestaurantId, token, menu, setMenu, setLoading]);

  return {
    loading,
    menu: menu[activeRestaurantId as string] || [],
    activeRestaurantId,
    categories,
  };
}
