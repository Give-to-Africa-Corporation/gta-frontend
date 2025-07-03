import axios, { AxiosError, AxiosResponse } from "axios";
import {
  ApiResponse,
  AuthResponse,
  Campaign,
  CampaignCreate,
  CampaignQueryParams,
  CampaignUpdate,
  CompleteProfileRequest,
  Donation,
  DonationRequest,
  LoginRequest,
  NgoProfile,
  NgoProfileResponse,
  NgoQueryParams,
  RegisterRequest,
  UpdateProfileRequest,
} from "../lib/types";

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle session expiration
    if (error.response?.status === 401) {
      // Only clear the token, but don't force redirect
      localStorage.removeItem("token");

      // Set a flag that can be checked by components
      error.message = "Authentication failed: Your session has expired";
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
export const handleResponse = <T>(response: AxiosResponse): ApiResponse<T> => {
  return {
    success: true,
    data: response.data,
    message: response.data.message,
  };
};

// Helper function to handle API errors
export const handleError = (error: any): ApiResponse<any> => {
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "An unexpected error occurred";

  return {
    success: false,
    error: errorMessage,
  };
};

// Create FormData from object
const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === "bankDetails" || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string | Blob);
      }
    }
  });

  return formData;
};

// Auth API
export const authApi = {
  register: async (
    data: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post("/ngos/register", data);
      // Store token from registration response, just like login
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return handleResponse<AuthResponse>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post("/ngos/login", data);
      localStorage.setItem("token", response.data.token);
      return handleResponse<AuthResponse>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  logout: (): void => {
    localStorage.removeItem("token");
  },
};

// NGO API
export const ngoApi = {
  getProfile: async (): Promise<ApiResponse<NgoProfileResponse>> => {
    try {
      const response = await api.get("/ngos/profile");
      return handleResponse<NgoProfileResponse>(response);
    } catch (error) {
      if (isAuthError(error)) {
        localStorage.removeItem("token");
      }
      return handleError(error);
    }
  },

  completeProfile: async (
    data: CompleteProfileRequest
  ): Promise<ApiResponse<NgoProfile>> => {
    try {
      const response = await api.put("/ngos/complete-profile", data);
      return handleResponse<NgoProfile>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<ApiResponse<NgoProfile>> => {
    try {
      // Use the dedicated update-profile endpoint
      const response = await api.put("/ngos/update-profile", data);
      return handleResponse<NgoProfile>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  uploadDocuments: async (files: {
    registrationCertificate: File;
    leadershipProof: File | null;
    additionalDocument: File | null;
  }): Promise<ApiResponse<any>> => {
    try {
      const formData = new FormData();
      formData.append("registrationCertificate", files.registrationCertificate);

      // Only append if not null
      if (files.leadershipProof) {
        formData.append("leadershipProof", files.leadershipProof);
      }

      if (files.additionalDocument) {
        formData.append("additionalDocument", files.additionalDocument);
      }

      const response = await api.post("/ngos/upload-documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  uploadProfileImage: async (
    file: File
  ): Promise<ApiResponse<{ profileImage: string }>> => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await api.post("/ngos/upload-profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // If successful and profileImage is returned, ensure it's properly formatted
      if (response.data && response.data.profileImage) {
        // Make sure there's no leading slash added to the path
        const profileImage = response.data.profileImage;

        // Return the response as is - we'll handle path formatting in the UI
        return handleResponse<{ profileImage: string }>(response);
      }

      return handleResponse<{ profileImage: string }>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Admin-only API
  getAllNgos: async (
    params?: NgoQueryParams
  ): Promise<ApiResponse<NgoProfile[]>> => {
    try {
      const response = await api.get("/ngos/all", { params });
      return handleResponse<NgoProfile[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  approveNgo: async (ngoId: string): Promise<ApiResponse<NgoProfile>> => {
    try {
      const response = await api.put(`/ngos/${ngoId}/approve`);
      return handleResponse<NgoProfile>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  rejectNgo: async (ngoId: string): Promise<ApiResponse<NgoProfile>> => {
    try {
      const response = await api.put(`/ngos/${ngoId}/reject`);
      return handleResponse<NgoProfile>(response);
    } catch (error) {
      return handleError(error);
    }
  },
};

// Campaign API
export const campaignApi = {
  getAllCampaigns: async (
    params?: CampaignQueryParams
  ): Promise<ApiResponse<Campaign[]>> => {
    try {
      const response = await api.get("/campaigns", { params });
      return handleResponse<Campaign[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getCampaign: async (identifier: string): Promise<ApiResponse<Campaign>> => {
    try {
      const response = await api.get(`/campaigns/${identifier}`);
      return handleResponse<Campaign>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getNgoCampaigns: async (): Promise<ApiResponse<Campaign[]>> => {
    try {
      const response = await api.get("/campaigns/ngo/my-campaigns");
      return handleResponse<Campaign[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  createCampaign: async (
    data: CampaignCreate,
    files: {
      mainImage: File;
      additionalImages?: File[];
    }
  ): Promise<ApiResponse<Campaign>> => {
    try {
      const formData = new FormData();

      // Append campaign data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Append files
      formData.append("mainImage", files.mainImage);
      files.additionalImages?.forEach((file) => {
        formData.append("additionalImages", file);
      });

      const response = await api.post("/campaigns", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return handleResponse<Campaign>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  updateCampaign: async (
    campaignId: string,
    data: CampaignUpdate,
    files?: {
      mainImage?: File;
      additionalImages?: File[];
    }
  ): Promise<ApiResponse<Campaign>> => {
    try {
      const formData = new FormData();

      // Append campaign data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Append files if they exist
      if (files?.mainImage) {
        formData.append("mainImage", files.mainImage);
      }

      files?.additionalImages?.forEach((file) => {
        formData.append("additionalImages", file);
      });

      const response = await api.put(`/campaigns/${campaignId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return handleResponse<Campaign>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  deleteCampaign: async (campaignId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/campaigns/${campaignId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Donation API
  addDonation: async (
    campaignId: string,
    donation: DonationRequest
  ): Promise<ApiResponse<Donation>> => {
    try {
      const response = await api.post(
        `/campaigns/${campaignId}/donate`,
        donation
      );
      return handleResponse<Donation>(response);
    } catch (error) {
      return handleError(error);
    }
  },
};

// Hook to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

// Helper to check if an error is an auth error
export const isAuthError = (error: any): boolean => {
  return (
    error?.response?.status === 401 ||
    error?.message?.includes("Authentication failed") ||
    error?.message?.includes("unauthorized") ||
    error?.message?.includes("401")
  );
};

export default {
  authApi,
  ngoApi,
  campaignApi,
  isAuthenticated,
};
