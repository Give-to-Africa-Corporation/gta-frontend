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
  UserRegisterRequest,
  UserAuthResponse,
} from "../lib/types";

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

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

export const handleErrorBank = (error: any) => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unexpected server error occurred.";
    return {
      success: false,
      message,
      data: null,
      missingFields: error.response?.data?.missingFields || [],
    };
  }

  return {
    success: false,
    message: "An unknown error occurred.",
    data: null,
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

// User API
export const userApi = {
  userRegister: async (
    data: UserRegisterRequest
  ): Promise<ApiResponse<UserAuthResponse>> => {
    try {
      const response = await api.post("/users/register", data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return handleResponse<UserAuthResponse>(response);
    } catch (error) {
      return handleError(error);
    }
  },
}

// Auth API
export const authApi = {
  register: async (
    data: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post("/ngos/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

  completeBankDetails: async (
    data: any
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post("/ngos/complete-bank-details", data);
      return handleResponse(response);
    } catch (error) {
      return handleErrorBank(error);
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
      // console.log(response, "campaigns")
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
  data: any, // ya CampaignCreate type
  files: {
    banner: File;
    logo?: File;
  }
) => {
  try {
    const formData = new FormData();

    // Saara JSON ek hi "data" field me
    formData.append("data", JSON.stringify(data));

    // Files
    formData.append("banner", files.banner);
    if (files.logo) {
      formData.append("logo", files.logo);
    }

    const response = await api.post("/campaigns", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return handleResponse<Campaign>(response);
  } catch (error) {
    return handleError(error);
  }
  },

  updateCampaign: async (
  campaignId: string,
  data: any, // ya CampaignUpdate type
  files?: {
    banner?: File;
    logo?: File;
  }
): Promise<ApiResponse<Campaign>> => {
  try {
    const formData = new FormData();

    // 🔹 Same as createCampaign
    formData.append("data", JSON.stringify(data));

    // 🔹 Files (optional in update)
    if (files?.banner) {
      formData.append("banner", files.banner);
    }

    if (files?.logo) {
      formData.append("logo", files.logo);
    }

    const response = await api.put(
      `/campaigns/${campaignId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

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

  // Like campaign API
  likeCampaign: async (
    campaignId: string,
    userIP: string
  ): Promise<ApiResponse<{ likes: number }>> => {
    try {
      const response = await api.post(`/campaigns/${campaignId}/like`, {
        userIP,
      });
      return handleResponse<{ likes: number }>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Unlike campaign API
  unlikeCampaign: async (
    campaignId: string,
    userIP: string
  ): Promise<ApiResponse<{ likes: number }>> => {
    try {
      const response = await api.post(`/campaigns/${campaignId}/unlike`, {
        userIP,
      });
      return handleResponse<{ likes: number }>(response);
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

export const deactivateNgoAccount = async () => {
  const token = localStorage.getItem("token"); // ya jahan store ho
  const response = await api.post(
    "/ngos/deactivate",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};


export const updateNgoStatusByAdmin = async (
  ngoId: string,
  isActive: boolean
) => {
  const response = await api.post("/admin/status-active", {
    ngoId,
    isActive,
  });

  return response.data;
};


export default {
  authApi,
  ngoApi,
  campaignApi,
  userApi,
  isAuthenticated,
};
