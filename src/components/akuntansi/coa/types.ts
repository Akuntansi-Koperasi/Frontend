export type { CoaRecord } from "@/services/coaService";

export type CoaTransaction = {
  id: number;
  coaId: number;
  tanggal: string;
  jenisTransaksi: string;
  deskripsi: string;
  debit: number;
  kredit: number;
  saldo: number;
};

export const MOCK_COA_TRANSACTIONS: Array<CoaTransaction> = [
  {
    id: 1,
    coaId: 1,
    tanggal: "2026-03-03",
    jenisTransaksi: "Transfer Dana Kasir (Retail)",
    deskripsi: "Open shift - transfer float kasir dari bank",
    debit: 100000,
    kredit: 0,
    saldo: 100000,
  },
  {
    id: 2,
    coaId: 1,
    tanggal: "2026-03-03",
    jenisTransaksi: "Penjualan Retail Tunai Barang Sendiri / Konsinyasi",
    deskripsi: "Penjualan Retail Tunai Barang Sendiri",
    debit: 160000,
    kredit: 0,
    saldo: 260000,
  },
  {
    id: 3,
    coaId: 1,
    tanggal: "2026-03-12",
    jenisTransaksi: "Penjualan Retail Tunai Barang Sendiri / Konsinyasi",
    deskripsi: "Penjualan Retail Tunai Barang Sendiri",
    debit: 115000,
    kredit: 0,
    saldo: 375000,
  },
  {
    id: 4,
    coaId: 1,
    tanggal: "2026-03-12",
    jenisTransaksi: "Setoran Tutup Shift (Retail)",
    deskripsi: "Setoran tutup shift (Retail)",
    debit: 0,
    kredit: 115000,
    saldo: 260000,
  },
  {
    id: 5,
    coaId: 1,
    tanggal: "2026-03-12",
    jenisTransaksi: "Penjualan Retail Tunai Barang Sendiri / Konsinyasi",
    deskripsi: "Penjualan Retail Tunai Barang Sendiri",
    debit: 25000,
    kredit: 0,
    saldo: 285000,
  },
];
