import { api } from "./api";

export type User = {
  id: number;
  email: string;
  photo_profile: string | null;
};

export type koperasiDetail = {
  id: number;
  nama: string;
};

export type anggota = {
  id: number;
  nama: string;
  email: string;
  photo_profile: string | null;
};

export type Koperasi = {
  koperasi: koperasiDetail;
  anggota: anggota;
  permissions: Array<string>;
};

export type LoginResponse = {
  status: string;
  message: string;
  data: {
    token_type: string;
    token: string;
    user: User;
    koperasi: Array<Koperasi>;
  };
};

export const fetchUserProfile = async () => {
  const response = await api.get<{ status: string; data: User }>("/profile/me");
  return response.data.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.data.user));
    localStorage.setItem(
      "koperasiList",
      JSON.stringify(response.data.data.koperasi),
    );
    localStorage.setItem(
      "koperasiActive",
      JSON.stringify(response.data.data.koperasi[0]),
    );
    localStorage.setItem(
      "anggota",
      JSON.stringify(response.data.data.koperasi[0].anggota),
    );
    localStorage.setItem(
      "permissions",
      JSON.stringify(response.data.data.koperasi[0].permissions),
    );
  }

  return response.data;
};

export const loginWithGoogle = async (idToken: string) => {
  const response = await api.post<LoginResponse>("/auth/login-google", {
    id_token: idToken,
    device_name: "web",
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.data.user));
    localStorage.setItem(
      "koperasiList",
      JSON.stringify(response.data.data.koperasi),
    );
    localStorage.setItem(
      "koperasiActive",
      JSON.stringify(response.data.data.koperasi[0]),
    );
    localStorage.setItem(
      "anggota",
      JSON.stringify(response.data.data.koperasi[0].anggota),
    );
    localStorage.setItem(
      "permissions",
      JSON.stringify(response.data.data.koperasi[0].permissions),
    );
  }

  return response.data;
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return !!localStorage.getItem("token");
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.warn("Logout endpoint failed, forcing local logout anyway.", err);
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("koperasiList");
      localStorage.removeItem("koperasiActive");
      localStorage.removeItem("anggota");
      localStorage.removeItem("permissions");
      window.location.href = "/login";
    }
  }
};
