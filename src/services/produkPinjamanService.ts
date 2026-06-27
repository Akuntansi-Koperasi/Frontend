import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

export type ProdukPinjamanParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type ProdukPinjamanBackendRecord = {
  id: number;
  nama: string;
  jenis?: string;
  type?: string;
  periode_pinjaman?: string;
  suku_bunga: number | string | null;
  keterangan: string | null;
};

export type JenisPinjamanBackend = "menurun" | "flat" | "anuitas";
export type PeriodePinjamanBackend =
  | "harian"
  | "mingguan"
  | "bulanan"
  | "tahunan";

export type ProdukPinjamanRecord = {
  id: number;
  nama: string;
  jenis: "Menurun" | "Flat" | "Anuitas";
  periode: "Harian" | "Mingguan" | "Bulanan" | "Tahunan";
  bunga: number;
  keterangan: string;
};

export type ProdukPinjamanListResponse = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: Array<ProdukPinjamanBackendRecord>;
};

export type ProdukPinjamanListResult = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: Array<ProdukPinjamanRecord>;
};

const mapBackend = (b: ProdukPinjamanBackendRecord): ProdukPinjamanRecord => {
  const jenisRaw = (b.type || b.jenis || "").toString();
  const jenis = jenisRaw
    ? jenisRaw.charAt(0).toUpperCase() + jenisRaw.slice(1)
    : "Menurun";

  const periodeRaw = (b.periode_pinjaman || "").toString();
  const periode = periodeRaw
    ? periodeRaw.charAt(0).toUpperCase() + periodeRaw.slice(1)
    : "Bulanan";

  return {
    id: b.id,
    nama: b.nama,
    jenis: jenis as ProdukPinjamanRecord["jenis"],
    periode: periode as ProdukPinjamanRecord["periode"],
    bunga: Number(b.suku_bunga || 0),
    keterangan: b.keterangan || "",
  };
};

export const getProdukPinjamanList = createServerFn({ method: "GET" })
  .validator((data: { params?: ProdukPinjamanParams }) => data)
  .handler(async ({ data }): Promise<ProdukPinjamanListResult> => {
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
        data: ProdukPinjamanListResponse;
      }>("/produk-pinjaman", {
        params: cleanParams,
      });

      const payload = response.data;

      if (Array.isArray(payload.data)) {
        const items = payload.data as Array<ProdukPinjamanBackendRecord>;
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
      throw err; // Never reached, but satisfies TypeScript
    }
  });

export const createProdukPinjaman = createServerFn({ method: "POST" })
  .validator((data: { payload: Omit<ProdukPinjamanRecord, "id"> }) => data)
  .handler(async ({ data }) => {
    try {
      const body = {
        nama: data.payload.nama,
        type: data.payload.jenis.toLowerCase(),
        periode_pinjaman: data.payload.periode.toLowerCase(),
        suku_bunga: data.payload.bunga,
        keterangan: data.payload.keterangan,
      };

      const response = await api.post<{
        status: string;
        message: string;
        data: ProdukPinjamanBackendRecord;
      }>("/produk-pinjaman", body);

      return mapBackend(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });

export const updateProdukPinjaman = createServerFn({ method: "POST" })
  .validator(
    (data: { id: number; payload: Omit<ProdukPinjamanRecord, "id"> }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const body = {
        nama: data.payload.nama,
        type: data.payload.jenis.toLowerCase(),
        periode_pinjaman: data.payload.periode.toLowerCase(),
        suku_bunga: data.payload.bunga,
        keterangan: data.payload.keterangan,
      };

      const response = await api.put<{
        status: string;
        message: string;
        data: ProdukPinjamanBackendRecord;
      }>(`/produk-pinjaman/${data.id}`, body);

      return mapBackend(response.data.data);
    } catch (err) {
      handleApiError(err);
    }
  });

export const deleteProdukPinjaman = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.delete<{ status: string; message: string }>(
        `/produk-pinjaman/${data.id}`,
      );
      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  });
