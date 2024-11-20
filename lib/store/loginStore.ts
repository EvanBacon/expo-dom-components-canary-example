import axios from "axios";
import { create } from "zustand";
import EncryptedStorage from "react-native-encrypted-storage";
import { useCompanyStore } from "./companyStore";

interface LoginState {
  token: string | null;
  tenantId: string | null;
  userInfo: any;
  isLoggedIn: boolean;
  setToken: (token: string | null) => Promise<void>;
  setUserInfo: (userInfo: any) => void;
  logout: () => Promise<void>;
  login: (
    username: string,
    password: string,
    tenantId: string,
  ) => Promise<void>;
  response: any;
  isLoading: boolean;
  error: any;
}

export const useLoginStore = create<LoginState>((set) => ({
  token: null,
  tenantId: null,
  userInfo: null,
  isLoggedIn: false,
  response: null,
  isLoading: false,
  error: null,

  setToken: async (token: string | null) => {
    if (token === null) {
      return;
    } else {
      await EncryptedStorage.setItem("userToken", token);
    }
    set({ token, isLoggedIn: !!token });
  },

  setUserInfo: (userInfo) => {
    set({ userInfo });
    if (userInfo?.firstName) {
      EncryptedStorage.setItem("firstName", userInfo.firstName);
    }
  },

  logout: async () => {
    await EncryptedStorage.removeItem("userToken");
    set({ token: null, userInfo: null, isLoggedIn: false });
  },

  login: async (username: string, password: string, tenantId: string) => {
    set({ isLoading: true, error: null });

    const authUrl = "https://api.aionsites.com/auth/login";

    try {
      const response = await axios.post(
        authUrl,
        { credentials: { username, password } },
        {
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": tenantId,
          },
          timeout: 10000,
        },
      );

      if (response.data.token) {
        await EncryptedStorage.setItem("userToken", response.data.token);
        set({
          token: response.data.token,
          tenantId,
          userInfo: response.data.userData,
          response: response.data,
        });
      } else {
        throw new Error("Login failed, no token received");
      }
    } catch (err: any) {
      console.error("Error during login request:", err);

      if (err.response) {
        set({ error: err.response.data });
      } else if (err.request) {
        set({
          error:
            "No response received from server. Check your network connection.",
        });
      } else {
        set({ error: err.message });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Function to initialize the login store with existing EncryptedStorage data
export async function initializeUserStore() {
  const token = (await EncryptedStorage.getItem("userToken")) || "Nil";

  if (token) {
    const response = await verifyToken(token);
    if (response) {
      useLoginStore.setState({
        token,
        isLoggedIn: true,
        userInfo: response.data.user,
        tenantId: response.data.user.tenantId,
      });
    } else {
      EncryptedStorage.removeItem("userToken");
      useLoginStore.setState({
        token: null,
        isLoggedIn: false,
        userInfo: null,
        tenantId: null,
      });
    }

    await useCompanyStore.getState().fetchSelectedCompanyData();
  }
}

// Function to verify the token’s validity
async function verifyToken(token: string): Promise<any> {
  try {
    const response = await axios.get("https://api.aionsites.com/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}
