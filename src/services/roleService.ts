import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

type ApiListResponse<T> = {
  status: string;
  message: string;
  data: Array<T>;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type RoleOption = {
  id: number;
  name: string;
};

export type RoleParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type RoleRecord = {
  id: number;
  name: string;
};

export type RoleFormErrors = Partial<Record<string, Array<string>>> | null;

type ApiRecordResponse<T> = {
  status: string;
  message: string;
  data: T;
};

const cleanParams = (params: RoleParams): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  if (params.page != null) result.page = params.page;
  if (params.per_page != null) result.per_page = params.per_page;
  if (params.search != null && params.search !== "")
    result.search = params.search;

  return result;
};

const mapRole = (role: RoleOption): RoleRecord => ({
  id: role.id,
  name: role.name,
});

export const getRoleList = createServerFn({ method: "GET" })
  .validator((data: { params?: RoleParams }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<ApiListResponse<RoleOption>>("/role", {
        params: cleanParams(data.params ?? {}),
      });

      const payload = response.data;
      const meta = payload.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: payload.data.length,
      };

      return {
        current_page: meta.current_page,
        last_page: meta.last_page,
        per_page: meta.per_page,
        total: meta.total,
        data: payload.data.map(mapRole),
      };
    } catch (err) {
      handleApiError(err);
    }
  });

export const createRole = createServerFn({ method: "POST" })
  .validator((data: { payload: { name: string } }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<ApiRecordResponse<RoleOption>>(
        "/role",
        data.payload,
      );
      return mapRole(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });

export const updateRole = createServerFn({ method: "POST" })
  .validator((data: { id: number; payload: { name: string } }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.put<ApiRecordResponse<RoleOption>>(
        `/role/${data.id}`,
        data.payload,
      );
      return mapRole(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });

export const deleteRole = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.delete<{ status: string; message: string }>(
        `/role/${data.id}`,
      );
      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  });

export const getRoleDropdown = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response =
        await api.get<ApiListResponse<{ id: number; name: string }>>(
          "/role/dropdown",
        );

      return response.data.data.map((role) => ({
        id: role.id,
        name: role.name,
      }));
    } catch (err) {
      handleApiError(err);
    }
  },
);
