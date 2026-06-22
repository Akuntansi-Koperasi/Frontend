import { api } from "./api";

type ApiRecordResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export type RolePermissionItem = {
  menu: string;
  class: string;
  level: "lihat" | "modifikasi" | "admin";
};

const handleApiError = (err: any): never => {
  const data = err?.response?.data;
  const message = data?.message ?? err?.message ?? "Terjadi kesalahan";
  const errors = data?.errors ?? {};
  const status = err?.response?.status ?? 500;
  const error: any = new Error(message);
  error.apiErrors = errors;
  error.status = status;
  throw error;
};

export const getRolePermissions = async (roleId: string | number) => {
  try {
    const response = await api.get<
      ApiRecordResponse<{
        id: number;
        name: string;
        permissions: Array<RolePermissionItem>;
      }>
    >(`/role/${roleId}/permissions`);

    return response.data.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAllPermissions = async () => {
  try {
    const response =
      await api.get<ApiRecordResponse<Array<RolePermissionItem>>>(
        `/permissions`,
      );
    return response.data.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const updateRolePermissions = async (
  roleId: string | number,
  permissions: Array<{ class: string; level: string }>,
) => {
  try {
    const response = await api.put<ApiRecordResponse<any>>(
      `/role/${roleId}/permissions`,
      {
        permissions,
      },
    );

    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export default {
  getRolePermissions,
  updateRolePermissions,
};
