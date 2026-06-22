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

type ApiRecordResponse<T> = {
  status: string;
  message: string;
  data: T;
};

type BackendUser = {
  id: number;
  email: string;
  photo_profile?: string | null;
};

type BackendRole = {
  id: number;
  name: string;
};

export type UserFormErrors = Partial<Record<string, Array<string>>> | null;

export type CreateUserPayload = {
  anggota_id: number;
  role_id: number;
};

export type UpdateUserPayload = {
  role_id: number;
};

type BackendAnggota = {
  id: number;
  nama: string;
  email: string;
  photo_profile: string | null;
  user?: BackendUser | null;
  role?: BackendRole | null;
};

export type UserRecord = {
  id: number;
  name: string;
  username: string;
  email: string;
  peran?: string | null;
  profile_image?: string | null;
  role?: { id: number; name: string } | null;
};

const mapUser = (anggota: BackendAnggota): UserRecord => ({
  id: anggota.id,
  name: anggota.nama,
  email: anggota.email,
  username: anggota.user?.email
    ? anggota.user.email.split("@")[0]
    : anggota.email.split("@")[0],
  peran: anggota.role?.name ?? null,
  profile_image: anggota.photo_profile ?? anggota.user?.photo_profile ?? null,
  role: anggota.role ? { id: anggota.role.id, name: anggota.role.name } : null,
});

const cleanParams = (params: {
  page?: number;
  per_page?: number;
  search?: string;
}) => {
  const result: Record<string, unknown> = {};
  if (params.page != null) result.page = params.page;
  if (params.per_page != null) result.per_page = params.per_page;
  if (params.search != null && params.search !== "")
    result.search = params.search;
  return result;
};

export const getUsers = async (params: {
  page?: number;
  per_page?: number;
  search?: string;
}) => {
  const response = await api.get<ApiListResponse<BackendAnggota>>("/user", {
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
    data: payload.data.map(mapUser),
  };
};

export type UserParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export const createUser = async (payload: CreateUserPayload) => {
  try {
    const response = await api.post<ApiRecordResponse<BackendAnggota>>(
      "/user",
      payload,
    );
    return mapUser(response.data.data);
  } catch (err) {
    handleApiError(err);
  }
};

export const updateUser = async (id: number, payload: UpdateUserPayload) => {
  try {
    const response = await api.put<ApiRecordResponse<BackendAnggota>>(
      `/user/${id}`,
      payload,
    );
    return mapUser(response.data.data);
  } catch (err) {
    handleApiError(err);
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await api.delete<{ status: string; message: string }>(
      `/user/${id}`,
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export default {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
