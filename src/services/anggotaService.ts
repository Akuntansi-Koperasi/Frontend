import { api } from "./api";
import { handleApiError } from "./errorService";
import type {
  AnggotaDropdownOption,
  AnggotaGender,
  AnggotaRecord,
  AnggotaStatus,
  AnggotaUpsertPayload,
} from "@/components/koperasi/anggota/types";

export type { AnggotaDropdownOption } from "@/components/koperasi/anggota/types";

export type AnggotaParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

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

type BackendAnggota = {
  id: number;
  nama: string;
  ktp: string | null;
  email: string;
  telp: string;
  gender: AnggotaGender;
  photo_profile: string | null;
  status: AnggotaStatus;
  tanggal_masuk: string;
  tanggal_keluar: string | null;
  akses?: string | null;
  user?: BackendUser | null;
  role?: BackendRole | null;
};

const mapAnggota = (anggota: BackendAnggota): AnggotaRecord => ({
  id: anggota.id,
  nama: anggota.nama,
  ktp: anggota.ktp ?? null,
  email: anggota.email,
  telp: anggota.telp,
  gender: anggota.gender,
  photo_profile: anggota.photo_profile ?? null,
  tanggal_masuk: anggota.tanggal_masuk,
  tanggal_keluar: anggota.tanggal_keluar ?? null,
  status: anggota.status,
  akses_sistem: Boolean(anggota.user?.id),
  akses: anggota.akses ?? null,
  user: anggota.user
    ? {
        id: anggota.user.id,
        email: anggota.user.email,
        photo_profile: anggota.user.photo_profile ?? null,
      }
    : null,
  role: anggota.role
    ? {
        id: anggota.role.id,
        name: anggota.role.name,
      }
    : null,
});

const cleanParams = (params: AnggotaParams): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  if (params.page != null) result.page = params.page;
  if (params.per_page != null) result.per_page = params.per_page;
  if (params.search != null && params.search !== "")
    result.search = params.search;

  return result;
};

export const getAnggotaList = async (params: AnggotaParams) => {
  const response = await api.get<ApiListResponse<BackendAnggota>>("/anggota", {
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
    data: payload.data.map(mapAnggota),
  };
};

export const getAnggotaDropdown = async (): Promise<
  Array<AnggotaDropdownOption>
> => {
  const response =
    await api.get<ApiListResponse<{ id: number; nama: string }>>(
      "/anggota/dropdown",
    );

  return response.data.data.map((anggota) => ({
    id: anggota.id,
    nama: anggota.nama,
  }));
};

export const getAnggotaNoUserDropdown = async (): Promise<
  Array<AnggotaDropdownOption>
> => {
  const response = await api.get<ApiListResponse<{ id: number; nama: string }>>(
    "/anggota/dropdown/no-user",
  );

  return response.data.data.map((anggota) => ({
    id: anggota.id,
    nama: anggota.nama,
  }));
};

const buildPayload = (payload: AnggotaUpsertPayload) => ({
  nama: payload.nama,
  ktp: payload.ktp,
  email: payload.email,
  telp: payload.telp,
  gender: payload.gender,
  photo_profile: payload.photo_profile,
  tanggal_masuk: payload.tanggal_masuk,
  tanggal_keluar: payload.tanggal_keluar,
  status: payload.status,
});

export const createAnggota = async (payload: AnggotaUpsertPayload) => {
  try {
    const response = await api.post<ApiRecordResponse<BackendAnggota>>(
      "/anggota",
      buildPayload(payload),
    );
    return mapAnggota(response.data.data);
  } catch (err) {
    handleApiError(err);
  }
};

export const updateAnggota = async (
  id: number,
  payload: AnggotaUpsertPayload,
) => {
  try {
    const response = await api.put<ApiRecordResponse<BackendAnggota>>(
      `/anggota/${id}`,
      buildPayload(payload),
    );
    return mapAnggota(response.data.data);
  } catch (err) {
    handleApiError(err);
  }
};

export const deleteAnggota = async (id: number) => {
  try {
    const response = await api.delete<{ status: string; message: string }>(
      `/anggota/${id}`,
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const aktifkanAnggota = async (id: number, roleId: number) => {
  try {
    const response = await api.patch<ApiRecordResponse<BackendAnggota>>(
      `/anggota/${id}/aktifkan`,
      {
        role_id: roleId,
      },
    );

    return mapAnggota(response.data.data);
  } catch (err) {
    handleApiError(err);
  }
};
