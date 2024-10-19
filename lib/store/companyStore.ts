import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface Company {
  tenantId: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface CompanyStore {
  companies: Company[];
  selectedCompany: Company | null;
  setCompanies: (companies: Company[]) => void;
  setSelectedCompany: (selectedCompany: Company) => void;
  fetchCompanies: () => Promise<void>;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      companies: [],
      selectedCompany: null,

      setCompanies: (companies: Company[]) => set({ companies }),

      setSelectedCompany: (selectedCompany) => set({ selectedCompany }),

      fetchCompanies: async () => {
        try {
          const response = await axios.get<Company[]>(
            "https://api.aionsites.com/companies/public/available",
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const companies = response.data;
          set({ companies });
        } catch (error) {
          console.error("Error fetching companies:", error);
        }
      },
    }),
    {
      name: "company-store", // unique name for the storage
      getStorage: () => AsyncStorage, // (optional) by default the 'localStorage' is used
    },
  ),
);
