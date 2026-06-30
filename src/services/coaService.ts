import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

export type CoaParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type CoaBackendRecord = {
  id: number;
  koperasi_id: string;
  kategori_coa_id: string;
  nama: string;
  kode: string;
  keterangan: string | null;
  kategori: {
    id: number;
    nama: string;
    posisi: string;
  } | null;
};

export type CoaRecord = {
  id: number;
  kode: string;
  namaAkun: string;
  kategori: string;
  keterangan: string;
  kategori_coa_id: number;
};

const mapCoa = (b: CoaBackendRecord): CoaRecord => ({
  id: b.id,
  kode: b.kode,
  namaAkun: b.nama,
  kategori: b.kategori?.nama ?? "",
  keterangan: b.keterangan ?? "",
  kategori_coa_id: Number(b.kategori_coa_id),
});

export type CoaListResult = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: Array<CoaRecord>;
};

export const getCoaList = createServerFn({ method: "GET" })
  .validator((data: { params?: CoaParams }) => data)
  .handler(async ({ data }) => {
    try {
      const cleanParams: Record<string, unknown> = {};
      const params = data.params ?? {};
      if (params.page != null) cleanParams.page = params.page;
      if (params.per_page != null) cleanParams.per_page = params.per_page;
      if (params.search != null && params.search !== "")
        cleanParams.search = params.search;

      const response = await api.get<{
        status: string;
        message: string;
        data: Array<CoaBackendRecord>;
        meta?: {
          current_page: number;
          last_page: number;
          per_page: number;
          total: number;
        };
      }>("/coa", {
        params: cleanParams,
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
        data: payload.data.map(mapCoa),
      };
    } catch (err) {
      handleApiError(err);
    }
  });

export const createCoa = createServerFn({ method: "POST" })
  .validator(
    (data: {
      payload: { kategori_coa_id: number; nama: string; kode?: string; keterangan?: string };
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const response = await api.post<{
        status: string;
        message: string;
        data: CoaBackendRecord;
      }>("/coa", data.payload);

      return mapCoa(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });

export const updateCoa = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: number;
      payload: { kategori_coa_id: number; nama: string; kode?: string; keterangan?: string };
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const response = await api.put<{
        status: string;
        message: string;
        data: CoaBackendRecord;
      }>(`/coa/${data.id}`, data.payload);

      return mapCoa(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });

export const deleteCoa = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.delete<{ status: string; message: string }>(
        `/coa/${data.id}`,
      );
      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  });

export const getKategoriCoaDropdown = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const response = await api.get<{
        status: string;
        message: string;
        data: Array<{ id: number; nama: string }>;
      }>("/kategori-coa-default/dropdown");

      return response.data.data.map((k) => ({
        id: k.id,
        nama: k.nama,
      }));
    } catch (err) {
      handleApiError(err);
    }
  });