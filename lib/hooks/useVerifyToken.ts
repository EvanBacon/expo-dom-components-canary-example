import axios from "axios";
import { useState } from "react";
import { useLoginStore } from "../store/loginStore";

interface VerifyTokenResponse {
  user: any;
}

interface VerifyTokenHook {
  verifyToken: (token: string) => Promise<void>;
  response: VerifyTokenResponse | null;
  isLoading: boolean;
  error: any;
}

/**
 * Custom hook to handle user login using biometric means.
 * @returns {VerifyTokenResponse} An object containing verifyToken function, loading state, and error state.
 */
export function useVerifyToken(): VerifyTokenHook {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const { setUserInfo, setToken } = useLoginStore();

  const verifyToken = async (token: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    let response: any;
    try {
      response = await axios.post(
        `${process.env.BASE_URL}/auth/verify`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.user) {
        console.log(
          `Token verification failed: ${response.status} ${response.statusText}`,
        );
      }

      setUserInfo(response.data.user);
      setToken(token);
      setData(response.data);
    } catch (err: any) {
      setError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyToken, response: data, isLoading, error };
}
