import type { ProdukPinjamanRecord } from "@/services/produkPinjamanService";

export type JenisPinjaman = ProdukPinjamanRecord["jenis"];
export type PeriodePinjaman = ProdukPinjamanRecord["periode"];

export const JENIS_PINJAMAN: Array<JenisPinjaman> = [
  "Menurun",
  "Flat",
  "Anuitas",
];
export const PERIODE_PINJAMAN: Array<PeriodePinjaman> = [
  "Harian",
  "Mingguan",
  "Bulanan",
  "Tahunan",
];

export type { ProdukPinjamanRecord };
