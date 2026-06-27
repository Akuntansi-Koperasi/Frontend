import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

import type {
  PengurusRecord,
  PengurusStatus,
  PengurusUpsertPayload,
} from "@/components/koperasi/pengurus/types";

export type { AnggotaOption, JabatanOption } from "@/components/koperasi/pengurus/types";

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

export const getPengurusList = createServerFn({ method: "GET" })
  .validator((data: { params?: PengurusParams }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<ApiListResponse<PengurusBackendRecord>>(
        "/pengurus",
        {
          params: cleanParams(data.params ?? {}),
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
    } catch (err) {
      handleApiError(err);
    }
  });

export const getAnggotaDropdown = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response =
        await api.get<ApiListResponse<BackendAnggota>>("/anggota/dropdown");

      return response.data.data.map((anggota) => ({
        id: anggota.id,
        nama: anggota.nama,
        email: anggota.email,
        photo_profile: anggota.photo_profile ?? null,
      }));
    } catch (err) {
      handleApiError(err);
    }
  },
);

export const getJabatanDropdown = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response =
        await api.get<ApiListResponse<BackendJabatan>>("/jabatan/dropdown");

      return response.data.data.map((jabatan) => ({
        id: jabatan.id,
        nama_posisi: jabatan.nama_posisi,
        jenis_posisi: jabatan.jenis_posisi,
        multiple: Boolean(jabatan.multiple),
      }));
    } catch (err) {
      handleApiError(err);
    }
  },
);

export const createPengurus = createServerFn({ method: "POST" })
  .validator((data: { payload: PengurusUpsertPayload }) => data)
  .handler(async ({ data }) => {
    try {
      const body = {
        anggota_id: data.payload.anggotaId,
        jabatan_id: data.payload.jabatanId,
        mulai: String(data.payload.mulaiMenjabat),
        selesai:
          data.payload.selesaiMenjabat == null ? null : String(data.payload.selesaiMenjabat),
        status: data.payload.status,
      };

      const response = await api.post<ApiRecordResponse<PengurusBackendRecord>>(
        "/pengurus",
        body,
      );
      return mapBackendRecord(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });

export const updatePengurus = createServerFn({ method: "POST" })
  .validator((data: { id: number; payload: PengurusUpsertPayload }) => data)
  .handler(async ({ data }) => {
    try {
      const body = {
        jabatan_id: data.payload.jabatanId,
        mulai: String(data.payload.mulaiMenjabat),
        selesai:
          data.payload.selesaiMenjabat == null ? null : String(data.payload.selesaiMenjabat),
        status: data.payload.status,
      };

      const response = await api.put<ApiRecordResponse<PengurusBackendRecord>>(
        `/pengurus/${data.id}`,
        body,
      );
      return mapBackendRecord(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });

export const deletePengurus = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.delete<{ status: string; message: string }>(
        `/pengurus/${data.id}`,
      );
      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  });

export const akhiriPengurus = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.patch<ApiRecordResponse<PengurusBackendRecord>>(
        `/pengurus/${data.id}/akhiri`,
      );
      return mapBackendRecord(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });
