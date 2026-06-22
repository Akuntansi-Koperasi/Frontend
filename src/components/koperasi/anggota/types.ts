export type AnggotaGender = "pria" | "wanita";

export type AnggotaStatus = "tetap" | "tidak tetap" | "keluar";

export type AnggotaDropdownOption = {
  id: number;
  nama: string;
};

export type RoleOption = {
  id: number;
  name: string;
};

export type AnggotaUser = {
  id: number;
  email: string;
  photo_profile: string | null;
};

export type AnggotaRecord = {
  id: number;
  nama: string;
  ktp: string | null;
  email: string;
  telp: string;
  gender: AnggotaGender;
  photo_profile: string | null;
  tanggal_masuk: string;
  tanggal_keluar: string | null;
  status: AnggotaStatus;
  akses_sistem: boolean;
  akses: string | null;
  user: AnggotaUser | null;
  role: RoleOption | null;
};

export type AnggotaUpsertPayload = {
  nama: string;
  ktp: string | null;
  email: string;
  telp: string;
  gender: AnggotaGender;
  photo_profile: string | null;
  tanggal_masuk: string;
  tanggal_keluar: string | null;
  status: AnggotaStatus;
};

export type AnggotaFormErrors = Partial<Record<string, Array<string>>> | null;
