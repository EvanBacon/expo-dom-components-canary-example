import { useState } from "react";
import axios from "axios";
import { useLoginStore } from "@/lib/store/loginStore"; // Adjust the import path

// Define the type for the custom hook's return value
interface LoginHook {
  login: (
    username: string,
    password: string,
    tenantId: string,
  ) => Promise<void>;
  response: any;
  isLoading: boolean;
  error: any;
}

/**
 * Custom hook to handle user login.
 * @returns {LoginHook} An object containing login function, loading state, and error state.
 */
export function useLogin(): LoginHook {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const { setToken, setUserInfo } = useLoginStore();

  const login = async (
    username: string,
    password: string,
    tenantId: string,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    const authUrl = "https://api.aionsites.com/auth/login";

    try {
      const maxRetries = 3;
      let attempt = 0;
      let response;

      while (attempt < maxRetries) {
        attempt += 1;
        try {
          response = await axios.post(
            authUrl,
            {
              credentials: { username, password },
            },
            {
              headers: {
                "Content-Type": "application/json",
                "x-tenant-id": tenantId,
              },
              timeout: 10000, // Set timeout to 10 seconds
            },
          );

          if (response.data.token) {
            break;
          } else {
            throw new Error("Login failed, no token received");
          }
        } catch (err) {
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
          } else {
            throw err;
          }
        }
      }

      setToken(response?.data.token);
      setUserInfo(response?.data.userData);
      setData(response?.data);
    } catch (err: any) {
      console.error("Error during login request:", err);

      if (err.response) {
        console.error("Response error:", err.response);
        setError(err.response.data);
      } else if (err.request) {
        console.error("Request made but no response received:", err.request);
        setError(
          "No response received from server. Check your network connection.",
        );
      } else {
        console.error("Error setting up the request:", err.message);
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { login, response: data, isLoading, error };
}
