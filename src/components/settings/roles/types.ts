export type RoleRecord = {
  id: number;
  name: string;
};

export type PermissionLevel = "tanpa_akses" | "lihat" | "modifikasi" | "admin";

export type PermissionMenuItem = {
  key: string;
  label: string;
};
