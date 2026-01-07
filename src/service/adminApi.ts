// @ts-nocheck
import { create } from "domain";
import { ApiResponse, AuthResponse, Campaign, CauseType, NgoProfile, OrganizationType } from "../lib/types";
import { api, handleError, handleResponse } from "./apiService";
import { add } from "date-fns";

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
      console.log("GET ALL NGOS RESPONSE:", response);
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

  // organizations types
  getOrganizationTypesAPI: async (): Promise<OrganizationType[]> => {
    try {
      const response = await api.get("/admin/organization-types");
      return handleResponse<OrganizationType[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  addOrganizationTypeAPI: async (data: { typeName: string; description?: string }): Promise<OrganizationType> => {
    const { typeName, description } = data;
    try {
      const response = await api.post("/admin/organization-types", { typeName, description });
      return handleResponse<OrganizationType>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  deleteOrganizationTypeAPI: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/admin/organization-types/${id}`);
      return handleResponse<{ message: string }>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  updateOrganizationTypeAPI: async (id: string, updates: Partial<OrganizationType>): Promise<OrganizationType> => {
    try {
      const response = await api.put(`/admin/organization-types/${id}`, updates);
      return handleResponse<OrganizationType>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // cause type
  getCauseTypesAPI: async (): Promise<string[]> => {
    try {
      const response = await api.get("/admin/cause-types");
      return handleResponse<string[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  addCauseTypeAPI: async (data: { causeName: string; description?: string }): Promise<CauseType> => {
    const { causeName, description } = data;
    try {
      const response = await api.post("/admin/cause-types", { causeName, description });
      return handleResponse<CauseType>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  deleteCauseTypeAPI: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/admin/cause-types/${id}`);
      return handleResponse<{ message: string }>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  updateCauseTypeAPI: async (id: string, updates: Partial<CauseType>): Promise<CauseType> => {
    try {
      const response = await api.put(`/admin/cause-types/${id}`, updates);
      return handleResponse<CauseType>(response);
    } catch (error) {
      return handleError(error);
    }
  },

};