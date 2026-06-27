import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

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

export const getRolePermissions = createServerFn({ method: "GET" })
  .validator((data: { roleId: string | number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<
        ApiRecordResponse<{
          id: number;
          name: string;
          permissions: Array<RolePermissionItem>;
        }>
      >(`/role/${data.roleId}/permissions`);

      return response.data.data;
    } catch (err) {
      handleApiError(err);
    }
  });

export const getAllPermissions = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response =
        await api.get<ApiRecordResponse<Array<RolePermissionItem>>>(
          `/permissions`,
        );
      return response.data.data;
    } catch (err) {
      handleApiError(err);
    }
  },
);

export const updateRolePermissions = createServerFn({ method: "POST" })
  .validator((data: { roleId: string | number; permissions: Array<{ class: string; level: string }> }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.put<ApiRecordResponse<any>>(
        `/role/${data.roleId}/permissions`,
        {
          permissions: data.permissions,
        },
      );

      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  });

export default {
  getRolePermissions,
  updateRolePermissions,
};
