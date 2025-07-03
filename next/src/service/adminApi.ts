import { ApiResponse, AuthResponse, Campaign, NgoProfile } from "../lib/types";
import { api, handleError, handleResponse } from "./apiService";

export const adminApi = {
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post("/admin/login", { email, password });
      if (response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
      }
      return handleResponse<AuthResponse>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getAllNgos: async (): Promise<ApiResponse<NgoProfile[]>> => {
    try {
      const response = await api.get("/admin/ngos");
      return handleResponse<NgoProfile[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  approveNgo: async (ngoId: string): Promise<ApiResponse<NgoProfile>> => {
    try {
      if (!ngoId) {
        throw new Error("NGO ID is required");
      }
      const response = await api.put(`/admin/ngos/${ngoId}/approve`);
      return handleResponse<NgoProfile>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  rejectNgo: async (ngoId: string): Promise<ApiResponse<NgoProfile>> => {
    try {
      const response = await api.put(`/admin/ngos/${ngoId}/reject`);
      return handleResponse<NgoProfile>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getAllCampaigns: async (): Promise<ApiResponse<Campaign[]>> => {
    try {
      const response = await api.get("/admin/campaigns");
      return handleResponse<Campaign[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },
};
