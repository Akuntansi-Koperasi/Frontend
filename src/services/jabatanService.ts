import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

export type JabatanParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type JabatanBackendRecord = {
  id: number;
  nama_posisi: string;
  jenis_posisi: string;
  multiple: boolean | string | number;
};

export type JabatanRecord = {
  id: number;
  nama: string;
  kategori: string;
  multiple: boolean;
};

export type JabatanListResponse = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: Array<JabatanBackendRecord>;
};

const mapBackend = (b: JabatanBackendRecord): JabatanRecord => ({
  id: b.id,
  nama: b.nama_posisi,
  kategori: b.jenis_posisi,
  multiple: b.multiple === true || b.multiple === 1 || b.multiple === "1",
});

export type JabatanListResult = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: Array<JabatanRecord>;
};

export const getJabatanList = createServerFn({ method: "GET" })
  .validator((data: { params?: JabatanParams }) => data)
  .handler(async ({ data }) => {
    try {
      const cleanParams: Record<string, any> = {};
      const params = data.params ?? {};
      if (params.page != null) cleanParams.page = params.page;
      if (params.per_page != null) cleanParams.per_page = params.per_page;
      if (params.search != null && params.search !== "")
        cleanParams.search = params.search;

      const response = await api.get<{
        status: string;
        message: string;
        data: JabatanListResponse;
      }>("/jabatan", {
        params: cleanParams,
      });

      const payload = response.data;

      if (Array.isArray(payload.data)) {
        const items = payload.data as Array<JabatanBackendRecord>;
        const meta = (payload as any).meta ?? {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: items.length,
        };
        return {
          current_page: meta.current_page,
          last_page: meta.last_page,
          per_page: meta.per_page,
          total: meta.total,
          data: items.map(mapBackend),
        };
      }

      const d = payload.data;
      return {
        current_page: d.current_page,
        last_page: d.last_page,
        per_page: d.per_page,
        total: d.total,
        data: d.data.map(mapBackend),
      };
    } catch (err) {
      handleApiError(err);
    }
  });

export const createJabatan = createServerFn({ method: "POST" })
  .validator(
    (data: {
      payload: { nama: string; kategori: string; multiple: boolean };
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const body = {
        nama_posisi: data.payload.nama,
        jenis_posisi: data.payload.kategori,
        multiple: data.payload.multiple,
      };

      const response = await api.post<{
        status: string;
        message: string;
        data: JabatanBackendRecord;
      }>("/jabatan", body);

      return mapBackend(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });

export const updateJabatan = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: number;
      payload: { nama: string; kategori: string; multiple: boolean };
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const body = {
        nama_posisi: data.payload.nama,
        jenis_posisi: data.payload.kategori,
        multiple: data.payload.multiple,
      };

      const response = await api.put<{
        status: string;
        message: string;
        data: JabatanBackendRecord;
      }>(`/jabatan/${data.id}`, body);

      return mapBackend(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });

export const deleteJabatan = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.delete<{ status: string; message: string }>(
        `/jabatan/${data.id}`,
      );
      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  });
