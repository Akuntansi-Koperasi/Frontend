import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

export type ProdukSimpananParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type ProdukSimpananBackendRecord = {
  id: number;
  nama: string;
  tipe: "wajib" | "sukarela" | "pokok";
  suku_bunga: number | string | null;
  jumlah: number | null;
  keterangan: string | null;
};

export type ProdukSimpananRecord = {
  id: number;
  nama: string;
  jenis: "Wajib" | "Sukarela" | "Pokok";
  bunga: number;
  nominal: number;
  keterangan: string;
};

export type ProdukSimpananListResponse = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: Array<ProdukSimpananBackendRecord>;
};

const mapBackend = (b: ProdukSimpananBackendRecord): ProdukSimpananRecord => {
  const jenisTitleCase = b.tipe.charAt(0).toUpperCase() + b.tipe.slice(1);
  return {
    id: b.id,
    nama: b.nama,
    jenis: jenisTitleCase as "Wajib" | "Sukarela" | "Pokok",
    bunga: Number(b.suku_bunga || 0),
    nominal: b.jumlah || 0,
    keterangan: b.keterangan || "",
  };
};

export type ProdukSimpananListResult = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: Array<ProdukSimpananRecord>;
};

export const getProdukSimpananList = createServerFn({ method: "GET" })
  .validator((data: { params?: ProdukSimpananParams }) => data)
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
        data: ProdukSimpananListResponse;
      }>("/produk-simpanan", {
        params: cleanParams,
      });

      const payload = response.data;

      if (Array.isArray(payload.data)) {
        const items = payload.data as Array<ProdukSimpananBackendRecord>;
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

export const createProdukSimpanan = createServerFn({ method: "POST" })
  .validator((data: { payload: Omit<ProdukSimpananRecord, "id"> }) => data)
  .handler(async ({ data }) => {
    try {
      const body = {
        nama: data.payload.nama,
        tipe: data.payload.jenis.toLowerCase(),
        suku_bunga: data.payload.bunga,
        jumlah: data.payload.nominal,
        keterangan: data.payload.keterangan,
      };

      const response = await api.post<{
        status: string;
        message: string;
        data: ProdukSimpananBackendRecord;
      }>("/produk-simpanan", body);

      return mapBackend(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });

export const updateProdukSimpanan = createServerFn({ method: "POST" })
  .validator((data: { id: number; payload: Omit<ProdukSimpananRecord, "id"> }) => data)
  .handler(async ({ data }) => {
    try {
      const body = {
        nama: data.payload.nama,
        tipe: data.payload.jenis.toLowerCase(),
        suku_bunga: data.payload.bunga,
        jumlah: data.payload.nominal,
        keterangan: data.payload.keterangan,
      };

      const response = await api.put<{
        status: string;
        message: string;
        data: ProdukSimpananBackendRecord;
      }>(`/produk-simpanan/${data.id}`, body);

      return mapBackend(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });

export const deleteProdukSimpanan = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.delete<{ status: string; message: string }>(
        `/produk-simpanan/${data.id}`,
      );
      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  });
