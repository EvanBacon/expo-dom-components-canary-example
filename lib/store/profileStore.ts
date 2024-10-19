import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLoginStore } from "./loginStore";

interface ProfileStore {
  orders: any[];
  monthlyPayments: any[];
  currentMonthlyPayment: any;
  ordersLoading: boolean;
  paymentsLoading: boolean;
  monthlyPaymentsLoading: boolean;
  monthlyPaymentOffset: number;
  fetchOrders: () => Promise<void>;
  fetchCurrentMonthPayment: () => Promise<void>;
  fetchMonthlyPayments: (offset?: number, bulk?: number) => Promise<void>;
  loadMoreMonthlyPayments: () => Promise<void>;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      orders: [],
      monthlyPayments: [],
      currentMonthlyPayment: null,
      ordersLoading: false,
      paymentsLoading: false,
      monthlyPaymentsLoading: false,
      monthlyPaymentOffset: 0,

      fetchOrders: async () => {
        const { token } = useLoginStore.getState();
        set({ ordersLoading: true });
        try {
          const response = await axios.get<any[]>(
            "https://api.aionsites.com/orders/own-orders",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );

          set({ orders: response.data });
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          set({ ordersLoading: false });
        }
      },

      fetchCurrentMonthPayment: async () => {
        set({ paymentsLoading: true });
        try {
          const response = await axios.get<any[]>(
            "https://api.aionsites.com/users/own-monthly-payments",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${useLoginStore.getState().token}`,
              },
            },
          );

          set({ currentMonthlyPayment: response.data });
        } catch (error) {
          console.error("Error fetching payments:", error);
        } finally {
          set({ paymentsLoading: false });
        }
      },

      fetchMonthlyPayments: async (offset = 0, bulk = 10) => {
        set({ monthlyPaymentsLoading: true });
        try {
          const response = await axios.get<any[]>(
            `https://api.aionsites.com/users/own-monthly-payments?monthOffset=${offset}&bulk=${bulk}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${useLoginStore.getState().token}`,
              },
            },
          );

          const { monthlyPayments } = get();
          set({
            monthlyPayments: [...monthlyPayments, ...response.data],
            monthlyPaymentOffset: offset + bulk,
          });
        } catch (error) {
          console.error("Error fetching monthly payments:", error);
        } finally {
          set({ monthlyPaymentsLoading: false });
        }
      },

      loadMoreMonthlyPayments: async () => {
        const { monthlyPaymentOffset, fetchMonthlyPayments } = get();
        await fetchMonthlyPayments(monthlyPaymentOffset);
      },
    }),
    {
      name: "profile-store", // unique name for the storage
      getStorage: () => AsyncStorage, // (optional) by default the 'localStorage' is used
    },
  ),
);
