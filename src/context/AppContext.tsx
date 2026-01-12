// @ts-nocheck
import {
  Campaign,
  NgoProfile,
  NgoProfileResponse,
  OrganizationType,
  User,
} from "@/lib/types";
import { adminApi } from "@/service/adminApi";
import { authApi, campaignApi, ngoApi } from "@/service/apiService";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

// Define shape of context data
interface AppContextType {
  campaigns: Campaign[];
  ngos: NgoProfile[];
  user: User | null;
  isLoading: boolean;
  loadCampaigns: () => Promise<void>;
  refreshUserData: () => Promise<NgoProfile | null>;
  profileData: NgoProfileResponse | null; // Store all profile data including campaigns and stats
  lastFetchTimestamps: Record<string, number>; // Track when data was last fetched
  logout: () => void; // Add logout method
  approveNGO: (id: string) => Promise<void>; // Added missing function
  rejectNGO: (id: string) => Promise<void>; // Added missing function
  login: (email: string, password: string, role?: string) => Promise<void>; // Added missing function
  loadAdminData: () => Promise<void>; // Added new function
  organizationTypes: OrganizationType[];
  fetchOrganizationTypes: () => void;
  addOrganizationType: (data: {
    typeName: string;
    description?: string;
    userId: string;
  }) => Promise<void>;
  updateOrganizationType: (
    id: string,
    updates: Partial<OrganizationType>
  ) => Promise<void>;
  deleteOrganizationType: (id: string) => Promise<void>;
  causeTypes: { causeName: string; description?: string }[];
  fetchCauseTypes: () => void;
  addCauseType: (data: {
    causeName: string;
    description?: string;
    userId: string;
  }) => Promise<void>;
  updateCauseType: (
    oldCauseName: string,
    newCauseName: string
  ) => Promise<void>;
  deleteCauseType: (causeName: string) => Promise<void>;
}

// Create context with default values
const AppContext = createContext<AppContextType>({
  campaigns: [],
  ngos: [],
  user: null,
  isLoading: false,
  loadCampaigns: async () => {},
  refreshUserData: async () => null,
  profileData: null,
  lastFetchTimestamps: {},
  logout: () => {},
  approveNGO: async () => {},
  rejectNGO: async () => {},
  login: async () => {},
  loadAdminData: async () => {},
  organizationTypes: [],
  fetchOrganizationTypes: () => {},
  addOrganizationType: async () => {},
  updateOrganizationType: async () => {},
  deleteOrganizationType: async () => {},
  causeTypes: [],
  fetchCauseTypes: () => {},
  addCauseType: async () => {},
  updateCauseType: async () => {},
  deleteCauseType: async () => {}
});

interface ContextType {
  organizationTypes: OrganizationType[];
  fetchOrganizationTypes: () => void;
  addOrganizationType: (data: {
    typeName: string;
    description?: string;
    userId: string;
  }) => Promise<void>;
  updateOrganizationType: (
    id: string,
    updates: Partial<OrganizationType>
  ) => Promise<void>;
  deleteOrganizationType: (id: string) => Promise<void>;
}

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [ngos, setNgos] = useState<NgoProfile[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<NgoProfileResponse | null>(
    null
  );
  const [lastFetchTimestamps, setLastFetchTimestamps] = useState<
    Record<string, number>
  >({});
  const [organizationTypes, setOrganizationTypes] = useState<
    OrganizationType[]
  >([]);
  const [causeTypes, setCauseTypes] = useState<
    { causeType: string; description?: string }[]
  >([]);

  // Helper to check if we need to refetch data
  const shouldRefetch = (key: string, maxAge: number = 60000): boolean => {
    const lastFetch = lastFetchTimestamps[key] || 0;
    return Date.now() - lastFetch > maxAge;
  };

  // Update timestamp for a particular fetch
  const updateFetchTimestamp = (key: string) => {
    setLastFetchTimestamps((prev) => ({
      ...prev,
      [key]: Date.now(),
    }));
  };

  // Load campaigns from API
  const loadCampaigns = useCallback(async () => {
    // If it's been less than 1 minute since last fetch, don't refetch
    if (!shouldRefetch("campaigns", 60000)) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await campaignApi.getAllCampaigns();

      if (response.success && response.data) {
        // Convert API campaigns to our expected format
        setCampaigns(response.data);
        updateFetchTimestamp("campaigns");
      } else {
        console.error("Failed to load Causes:", response.error);
      }
    } catch (error) {
      console.error("Error loading Causes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [lastFetchTimestamps]);

  // Load full profile data including campaigns and stats
const loadProfileData = useCallback(
  async (forceRefresh: boolean = false) => {
    // 👇 normal login / auto calls (no force)
    if (!forceRefresh && !shouldRefetch("profileData", 120000)) {
      return profileData;
    }

    try {
      const response = await ngoApi.getProfile();

      if (response.success && response.data) {
        setProfileData(response.data);
        updateFetchTimestamp("profileData");
        return response.data;
      } else {
        console.error("Failed to load profile data:", response.error);
        return null;
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      return null;
    }
  },
  [lastFetchTimestamps, profileData]
);


  // Refresh user profile data
  const refreshUserData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Try to reuse profile data if we already have it and it's fresh
      let userData;
      if (profileData && !shouldRefetch("profileData", 120000)) {
        userData = profileData;
      } else {
        // Otherwise fetch new profile data
        userData = await loadProfileData();
      }

      if (userData) {
        // Convert NgoProfile to User with role property
        setUser({
          id: userData.ngo._id || userData.ngo.id || "",
          email: userData.ngo.email,
          name: userData.ngo.name,
          role: "ngo",
          isVerified: userData.ngo.status === "approved",
          status: userData.ngo.status,
          profileComplete: userData.ngo.profileComplete,
        });

        // If user has campaigns, load them
        if (userData.campaigns) {
          setCampaigns((prevCampaigns) => {
            // Update campaigns with user's campaigns or add them
            const updatedCampaigns = [...prevCampaigns];
            userData.campaigns.forEach((campaign) => {
              const index = updatedCampaigns.findIndex(
                (c) => c._id === campaign._id
              );
              if (index >= 0) {
                updatedCampaigns[index] = campaign;
              } else {
                updatedCampaigns.push(campaign);
              }
            });
            return updatedCampaigns;
          });
        }

        return userData.ngo;
      } else {
        console.error("Failed to load user profile");
        return null;
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadProfileData, profileData]);

  // Implement logout function
  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setProfileData(null);
    // Clear timestamp for user data
    setLastFetchTimestamps((prev) => ({
      ...prev,
      profileData: 0,
    }));
    toast.success("You have been logged out successfully");
  }, []);

  // Implement approveNGO function
  const approveNGO = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      // Use the _id if available, otherwise use id
      const ngoId = id;
      const response = await ngoApi.approveNgo(ngoId);

      if (response.success) {
        // Update the NGO status in the local state
        setNgos((prevNgos) =>
          prevNgos.map((ngo) =>
            ngo._id === ngoId || ngo.id === ngoId
              ? { ...ngo, status: "approved" }
              : ngo
          )
        );
        toast.success("NGO approved successfully");
      } else {
        toast.error(response.error || "Failed to approve NGO");
      }
    } catch (error) {
      console.error("Error approving NGO:", error);
      toast.error("An error occurred while approving the NGO");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Implement rejectNGO function
  const rejectNGO = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await ngoApi.rejectNgo(id);

      if (response.success) {
        // Update the NGO status in the local state
        setNgos((prevNgos) =>
          prevNgos.map((ngo) =>
            ngo.id === id || ngo._id === id
              ? { ...ngo, status: "rejected" }
              : ngo
          )
        );
        toast.success("NGO rejected successfully");
      } else {
        toast.error(response.error || "Failed to reject NGO");
      }
    } catch (error) {
      console.error("Error rejecting NGO:", error);
      toast.error("An error occurred while rejecting the NGO");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update the login function in AppContext
  const login = useCallback(
    async (email: string, password: string, role: string = "ngo") => {
      try {
        setIsLoading(true);
        let response;

        if (role === "admin") {
          response = await adminApi.login(email, password);
        } else {
          response = await authApi.login({ email, password });
        }

        if (!response.success) {
          throw new Error(response.error || "Login failed");
        }

        // If login is successful, load user data
        if (role === "admin") {
          setUser({
            id: response.data.userId,
            email: email,
            name: "Admin",
            role: "admin",
            isVerified: true,
            status: "approved",
            profileComplete: true,
          });
        } else {
          await refreshUserData();
        }

        toast.success("Login successful!");
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshUserData]
  );

  // Add admin-specific functions
  const loadAdminData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [ngosResponse, campaignsResponse] = await Promise.all([
        adminApi.getAllNgos(),
        adminApi.getAllCampaigns(),
      ]);

      if (ngosResponse.success) {
        setNgos(ngosResponse.data);
      }
      if (campaignsResponse.success) {
        setCampaigns(campaignsResponse.data);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);

      try {
        // First, try to load user profile if user is logged in
        const token = localStorage.getItem("token");
        if (token) {
          await refreshUserData();
        }

        // Then load all campaigns
        await loadCampaigns();
      } catch (error) {
        console.error("Error initializing data:", error);
        toast.error("Failed to load initial data");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [loadCampaigns, refreshUserData]);

  // organization type
  const fetchOrganizationTypes = async () => {
    const data = await adminApi.getOrganizationTypesAPI();
    // console.log("Fetched Organization Types:", data);
    setOrganizationTypes(data);
  };

  const addOrganizationType = async (data: {
    typeName: string;
    description?: string;
    userId: string;
  }) => {
    const newType = await adminApi.addOrganizationTypeAPI(data);
    setOrganizationTypes((prev) =>
      Array.isArray(prev) ? [...prev, newType] : [newType]
    );
  };

  const updateOrganizationType = async (
    id: string,
    updates: Partial<OrganizationType>
  ) => {
    const updated = await adminApi.updateOrganizationTypeAPI(id, updates);
    setOrganizationTypes((prev) =>
      Array.isArray(prev)
        ? prev.map((item) => (item._id === id ? updated : item))
        : []
    );
  };

  const deleteOrganizationType = async (id: string) => {
    await adminApi.deleteOrganizationTypeAPI(id);
    setOrganizationTypes((prev) =>
      Array.isArray(prev) ? prev.filter((item) => item._id !== id) : []
    );
  };

  useEffect(() => {
    fetchOrganizationTypes();
  }, [organizationTypes.length]);

  // cause types
  const fetchCauseTypes = async () => {
    const data = await adminApi.getCauseTypesAPI();
    // console.log("Fetched Cause Types:", data);
    setCauseTypes(data);
  };

  const addCauseType = async (data: {
    causeName: string;
    description?: string;
    userId: string;
  }) => {
    const newTypes = await adminApi.addCauseTypeAPI(data);
    setCauseTypes((prev) => Array.isArray(prev) ? [...prev, newTypes] : [newTypes]);
  };

  const updateCauseType = async (
    oldCauseName: string,
    newCauseName: string
  ) => {
    const updated = await adminApi.updateCauseTypeAPI(oldCauseName, newCauseName);
    setCauseTypes((prev) =>
      Array.isArray(prev)
        ? prev.map((item) => (item.causeName === oldCauseName ? updated : item))
        : []
    );
  };

  const deleteCauseType = async (id: string) => {
    await adminApi.deleteCauseTypeAPI(id);
    setCauseTypes((prev) =>
      Array.isArray(prev) ? prev.filter((item) => item._id !== id) : []
    );
  };

  useEffect(() => {
    fetchCauseTypes();
  }, [causeTypes.length]);  
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

  // all types
   const [organizationTypesall, setOrganizationTypesall] = useState([]);
  const [causeTypesall, setCauseTypesall] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [orgRes, causeRes] = await Promise.all([
          fetch(`${API_URL}/ngos/organization-types-all`),
          fetch(`${API_URL}/ngos/cause-types-all`),
        ]);

        if (!orgRes.ok || !causeRes.ok) {
          throw new Error("Failed to load dropdown data");
        }

        const orgData = await orgRes.json();
        console.log("Organization Types Data ok:", orgData);
        const causeData = await causeRes.json();
        console.log("Cause Types Data ok:", causeData);

        // 👉 assume API returns [{ typeName: "NGO" }]
        setOrganizationTypesall(orgData?.data?.map((i) => i.typeName));
        setCauseTypesall(causeData?.data?.map((i) => i.causeName));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeta();
  }, []);

  return (
    <AppContext.Provider
      value={{
        campaigns,
        ngos,
        user,
        isLoading,
        loadCampaigns,
        refreshUserData,
        profileData,
        loadProfileData,
        lastFetchTimestamps,
        logout,
        approveNGO,
        rejectNGO,
        login,
        loadAdminData,
        organizationTypes,
        fetchOrganizationTypes,
        addOrganizationType,
        updateOrganizationType,
        deleteOrganizationType,
        causeTypes,
        fetchCauseTypes,
        addCauseType,
        updateCauseType,
        deleteCauseType,
        organizationTypesall, causeTypesall, loading, error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the AppContext
export function useAppContext() {
  return useContext(AppContext);
}
