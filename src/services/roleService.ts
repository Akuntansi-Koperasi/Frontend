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

export const getRoleList = async (params: RoleParams) => {
  const response = await api.get<ApiListResponse<RoleOption>>("/role", {
    params: cleanParams(params),
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
};

export const createRole = async (payload: { name: string }) => {
  try {
    const response = await api.post<ApiRecordResponse<RoleOption>>(
      "/role",
      payload,
    );
    return mapRole(response.data.data);
  } catch (err) {
    handleApiError(err);
  }
};

export const updateRole = async (id: number, payload: { name: string }) => {
  try {
    const response = await api.put<ApiRecordResponse<RoleOption>>(
      `/role/${id}`,
      payload,
    );
    return mapRole(response.data.data);
  } catch (err) {
    handleApiError(err);
  }
};

export const deleteRole = async (id: number) => {
  try {
    const response = await api.delete<{ status: string; message: string }>(
      `/role/${id}`,
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getRoleDropdown = async (): Promise<Array<RoleOption>> => {
  const response =
    await api.get<ApiListResponse<{ id: number; name: string }>>(
      "/role/dropdown",
    );

  return response.data.data.map((role) => ({
    id: role.id,
    name: role.name,
  }));
};
