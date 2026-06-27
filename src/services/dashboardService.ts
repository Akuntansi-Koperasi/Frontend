import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

export type DashboardStats = {
  statistik: {
    pemasukan: { total: number; change: number };
    pengeluaran: { total: number; change: number };
    deposit: { total: number; person: number };
    work_hours: {
      average: { hours: number; minutes: number; text: string };
      change: number;
    };
  };
  grafik: {
    labels: Array<string>;
    work_hours: { data: Array<number> };
    cashflows: {
      pemasukan: Array<number>;
      pengeluaran: Array<number>;
    };
  };
  pulang_laporan_setoran: Array<{
    user: {
      id: number;
      name: string;
      username: string;
      profile_image: string | null;
    };
    date: string;
    time: string;
    pemasukan: number;
    pengeluaran: number;
    deposit: number;
  }>;
};

export type DashboardResponse = {
  status: string;
  message: string;
  data: DashboardStats;
};

export const getDashboardData = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await api.get<DashboardResponse>("/admin/dashboard");
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },
);
