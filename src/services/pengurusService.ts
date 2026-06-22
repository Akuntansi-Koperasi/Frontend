import { api } from "./api";
import { handleApiError } from "./errorService";

import type {
  AnggotaOption,
  JabatanOption,
  PengurusRecord,
  PengurusStatus,
  PengurusUpsertPayload,
} from "@/components/koperasi/pengurus/types";

export type PengurusParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

type BackendAnggota = {
  id: number;
  nama: string;
  email: string;
  photo_profile?: string | null;
};

type BackendJabatan = {
  id: number;
  nama_posisi: string;
  jenis_posisi: string;
  multiple: boolean | number | string;
};

type PengurusBackendRecord = {
  id: number;
  mulai: number | string;
  selesai: number | string | null;
  status: PengurusStatus;
  anggota: BackendAnggota;
  jabatan: BackendJabatan;
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

const mapBackendRecord = (record: PengurusBackendRecord): PengurusRecord => ({
  id: record.id,
  anggotaId: record.anggota.id,
  jabatanId: record.jabatan.id,
  nama: record.anggota.nama,
  email: record.anggota.email,
  avatar: record.anggota.photo_profile ?? null,
  jabatan: record.jabatan.nama_posisi,
  kategori: record.jabatan.jenis_posisi,
  mulaiMenjabat: Number(record.mulai),
  selesaiMenjabat: record.selesai == null ? null : Number(record.selesai),
  status: record.status,
});

const cleanParams = (params: PengurusParams): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  if (params.page != null) result.page = params.page;
  if (params.per_page != null) result.per_page = params.per_page;
  if (params.search != null && params.search !== "")
    result.search = params.search;

  return result;
};

export const getPengurusList = async (params: PengurusParams) => {
  const response = await api.get<ApiListResponse<PengurusBackendRecord>>(
    "/pengurus",
    {
      params: cleanParams(params),
    },
  );

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
    data: payload.data.map(mapBackendRecord),
  };
};

export const getAnggotaDropdown = async (): Promise<Array<AnggotaOption>> => {
  const response =
    await api.get<ApiListResponse<BackendAnggota>>("/anggota/dropdown");

  return response.data.data.map((anggota) => ({
    id: anggota.id,
    nama: anggota.nama,
    email: anggota.email,
    photo_profile: anggota.photo_profile ?? null,
  }));
};

export const getJabatanDropdown = async (): Promise<Array<JabatanOption>> => {
  const response =
    await api.get<ApiListResponse<BackendJabatan>>("/jabatan/dropdown");

  return response.data.data.map((jabatan) => ({
    id: jabatan.id,
    nama_posisi: jabatan.nama_posisi,
    jenis_posisi: jabatan.jenis_posisi,
    multiple: Boolean(jabatan.multiple),
  }));
};

export const createPengurus = async (payload: PengurusUpsertPayload) => {
  const body = {
    anggota_id: payload.anggotaId,
    jabatan_id: payload.jabatanId,
    mulai: String(payload.mulaiMenjabat),
    selesai:
      payload.selesaiMenjabat == null ? null : String(payload.selesaiMenjabat),
    status: payload.status,
  };

  try {
    const response = await api.post<ApiRecordResponse<PengurusBackendRecord>>(
      "/pengurus",
      body,
    );
    return mapBackendRecord(response.data.data);
  } catch (err) {
    handleApiError(err);
  }
};

export const updatePengurus = async (
  id: number,
  payload: PengurusUpsertPayload,
) => {
  const body = {
    jabatan_id: payload.jabatanId,
    mulai: String(payload.mulaiMenjabat),
    selesai:
      payload.selesaiMenjabat == null ? null : String(payload.selesaiMenjabat),
    status: payload.status,
  };

  try {
    const response = await api.put<ApiRecordResponse<PengurusBackendRecord>>(
      `/pengurus/${id}`,
      body,
    );
    return mapBackendRecord(response.data.data);
  } catch (err) {
    handleApiError(err);
  }
};

export const deletePengurus = async (id: number) => {
  try {
    const response = await api.delete<{ status: string; message: string }>(
      `/pengurus/${id}`,
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const akhiriPengurus = async (id: number) => {
  try {
    const response = await api.patch<ApiRecordResponse<PengurusBackendRecord>>(
      `/pengurus/${id}/akhiri`,
    );
    return mapBackendRecord(response.data.data);
  } catch (err) {
    handleApiError(err);
  }
};
