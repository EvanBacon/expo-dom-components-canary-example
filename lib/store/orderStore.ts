import axios from "axios";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useLoginStore } from "./loginStore";

// Types for options, modifiers, and items
export interface CartOption {
  _id: string;
  quantity: number;
}

export interface CartModifier {
  _id: string;
  options: CartOption[];
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  modifiers: CartModifier[];
}

interface OrderItemData {
  _id: string;
  quantity: number;
  modifiers: {
    _id: string;
    options: {
      _id: string;
      quantity: number;
    }[];
  }[];
}

interface OrderData {
  items: OrderItemData[];
  messageToKitchen?: string;
  tip?: number;
}

interface CartState {
  carts: { [restaurantId: string]: CartItem[] };
  orderData: { [restaurantId: string]: OrderData };
  activeOrders: any[];
  addItem: (restaurantId: string, item: CartItem) => void;
  removeItem: (restaurantId: string, itemId: string) => void;
  updateItem: (restaurantId: string, item: CartItem) => void;
  emptyCart: (restaurantId: string) => void;
  updateMessageToKitchen: (restaurantId: string, message: string) => void;
  updateTip: (restaurantId: string, tip: number) => void;
  setCart: (restaurantId: string, items: CartItem[]) => void;
  changeModifier: (
    restaurantId: string,
    itemId: string,
    modifier: CartModifier,
  ) => void;
  updateOrderData: (restaurantId: string) => void;
  createOrder: (restaurantId: string) => Promise<void>;
  fetchActiveOrders: () => void;
}

export const useCartStore = create<CartState>()(
  immer((set, get) => ({
    carts: {},
    orderData: {},
    activeOrders: [],
    addItem: (restaurantId, item) => {
      set((state) => {
        if (!state.carts[restaurantId]) {
          state.carts[restaurantId] = [];
        }
        state.carts[restaurantId].push(item);
      });
      get().updateOrderData(restaurantId);
    },
    removeItem: (restaurantId, itemId) => {
      set((state) => {
        if (state.carts[restaurantId]) {
          state.carts[restaurantId] = state.carts[restaurantId].filter(
            (item) => item._id !== itemId,
          );
        }
      });
      get().updateOrderData(restaurantId);
    },
    updateItem: (restaurantId, updatedItem) => {
      set((state) => {
        if (state.carts[restaurantId]) {
          const index = state.carts[restaurantId].findIndex(
            (item) => item._id === updatedItem._id,
          );
          if (index !== -1) {
            state.carts[restaurantId][index] = updatedItem;
          }
        }
      });
      get().updateOrderData(restaurantId);
    },
    emptyCart: (restaurantId) => {
      set((state) => {
        state.carts[restaurantId] = [];
      });
      get().updateOrderData(restaurantId);
    },
    setCart: (restaurantId, items) => {
      set((state) => {
        state.carts[restaurantId] = items;
      });
      get().updateOrderData(restaurantId);
    },
    changeModifier: (restaurantId, itemId, modifier) => {
      set((state) => {
        const cartItems = state.carts[restaurantId];
        if (cartItems) {
          const item = cartItems.find((item) => item._id === itemId);
          if (item) {
            const modIndex = item.modifiers.findIndex(
              (mod) => mod._id === modifier._id,
            );
            if (modIndex !== -1) {
              item.modifiers[modIndex] = modifier;
            } else {
              item.modifiers.push(modifier);
            }
          }
        }
      });
      get().updateOrderData(restaurantId);
    },
    updateMessageToKitchen: (restaurantId, message) => {
      set((state) => {
        state.orderData[restaurantId].messageToKitchen = message;
      });
    },
    updateTip: (restaurantId, tip) => {
      set((state) => {
        state.orderData[restaurantId].tip = tip;
      });
    },
    updateOrderData: (restaurantId) => {
      const state = get();
      const cartItems = state.carts[restaurantId];
      if (!cartItems) {
        return;
      }
      const orderData: OrderData = {
        items: cartItems.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
          modifiers: item.modifiers.map((modifier) => ({
            _id: modifier._id,
            options: modifier.options.map((option) => ({
              _id: option._id,
              quantity: option.quantity,
            })),
          })),
        })),
      };
      // Update the orderData in the state
      set((state) => {
        state.orderData[restaurantId] = orderData;
      });
    },
    createOrder: async (restaurantId: any) => {
      const orderData = get().orderData[restaurantId];

      const response = await axios.post(
        "https://api.aionsites.com/orders/",
        {
          restaurantId,
          tenantId: useLoginStore.getState().tenantId,
          ...orderData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        },
      );

      if (response.status === 201) {
        get().emptyCart(restaurantId);
        set((state) => {
          state.activeOrders.push(response.data);
        });
      } else {
        throw new Error("Failed to create order");
      }
    },
    fetchActiveOrders: async () => {
      const response = await axios.get(
        "https://api.aionsites.com/orders/active/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        },
      );

      set((state) => {
        state.activeOrders = response.data;
      });
    },
  })),
);
