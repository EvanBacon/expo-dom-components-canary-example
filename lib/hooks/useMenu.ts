import { useAuth } from "@/components/providers/auth-provider";
import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";

export default function useMenu(restaurantId: string) {
  const [menu, setMenu] = useState<any>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchMenu() {
      let response: AxiosResponse<any> | null = null;
      try {
        response = await axios.get(
          `https://api.aionsites.com/restaurants/${restaurantId}/menu`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              contentType: "application/json",
            },
          },
        );

        // Organize menu by category
        const categorizedMenu = response?.data.reduce((acc: any, item: any) => {
          const category = item.category || "Uncategorized"; // Default to "Uncategorized" if no category
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        }, {});

        setMenu(categorizedMenu);
        setCategories(Object.keys(categorizedMenu));
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [restaurantId, token]);

  return {
    loading,
    menu,
    categories,
  };
}
