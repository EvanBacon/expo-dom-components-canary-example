import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { useLoginStore } from "./loginStore";

type Company = any;

interface CompanyStore {
  companies: Company[];
  selectedCompany: Company | null;
  selectedCompanyData: any;
  setCompanies: (companies: Company[]) => void;
  setSelectedCompany: (selectedCompany: Company) => void;
  fetchSelectedCompanyData: () => Promise<void>;
  fetchCompanies: () => Promise<void>;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      companies: [],
      selectedCompany: null,
      selectedCompanyData: null,

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

      fetchSelectedCompanyData: async () => {
        try {
          const response = await axios.get<Company[]>(
            `https://api.aionsites.com/companies/tenant/${
              useLoginStore.getState().tenantId
            }`,
            {
              headers: {
                Authorization: `Bearer ${useLoginStore.getState().token}`,
                "Content-Type": "application/json",
              },
            },
          );

          const selectedCompanyData = response?.data;
          set({ selectedCompanyData });
        } catch (error) {
          console.error("Error fetching companies:", error);
        }
      },
    }),
    {
      name: "company-store", // unique name for the storage
    },
  ),
);
