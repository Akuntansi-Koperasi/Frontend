import { createServerFn } from "@tanstack/react-start";
import { serialize } from "cookie";
import { api } from "./api";
import { handleApiError } from "./errorService";
import { env } from "@/env";

// Types
export type User = {
  id: number;
  nama: string;
  email: string;
  photo_profile: string | null;
};

export type KoperasiDetail = {
  id: number;
  nama: string;
};

export type Anggota = {
  id: number;
  nama: string;
  email: string;
  photo_profile: string | null;
};

export type Koperasi = {
  koperasi: KoperasiDetail;
  anggota: Anggota;
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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginGoogleCredentials {
  id_token: string;
}

export const login = createServerFn({ method: "POST" })
  .validator((data: LoginCredentials) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<LoginResponse>("/auth/login", data);
      const { token, token_type } = response.data.data;
      const user = response.data.data.user;
      const koperasiList = response.data.data.koperasi;

      const tokenCookie = serialize("token", token, {
        httpOnly: true,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });

      const userCookie = serialize("user", JSON.stringify(user.id), {
        httpOnly: false,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });

      const koperasiListCookie = serialize(
        "koperasiList",
        JSON.stringify(koperasiList),
        {
          httpOnly: false,
          secure: env.VITE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 5, // 5 days
        },
      );

      const koperasiActiveCookie = serialize(
        "koperasiActive",
        JSON.stringify(koperasiList[0]),
        {
          httpOnly: false,
          secure: env.VITE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 5, // 5 days
        },
      );

      const anggotaCookie = serialize(
        "anggota",
        JSON.stringify(koperasiList[0].anggota),
        {
          httpOnly: false,
          secure: env.VITE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 5, // 5 days
        },
      );

      const permissionsCookie = serialize(
        "permissions",
        JSON.stringify(koperasiList[0].permissions),
        {
          httpOnly: false,
          secure: env.VITE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 5, // 5 days
        },
      );

      return new Response(
        JSON.stringify({ ...response.data, token, token_type }),
        {
          headers: {
            "Set-Cookie": [
              tokenCookie,
              userCookie,
              koperasiListCookie,
              koperasiActiveCookie,
              anggotaCookie,
              permissionsCookie,
            ].join(", "),
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      handleApiError(error);
    }
  });

export const loginWithGoogle = createServerFn({ method: "POST" })
  .validator((data: LoginGoogleCredentials) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<LoginResponse>("/auth/login-google", {
        id_token: data.id_token,
        device_name: "web",
      });
      const { token, token_type } = response.data.data;
      const user = response.data.data.user;
      const koperasiList = response.data.data.koperasi;

      const tokenCookie = serialize("token", token, {
        httpOnly: true,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });

      const userCookie = serialize("user", JSON.stringify(user.id), {
        httpOnly: false,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });

      const koperasiListCookie = serialize(
        "koperasiList",
        JSON.stringify(koperasiList),
        {
          httpOnly: false,
          secure: env.VITE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 5, // 5 days
        },
      );

      const koperasiActiveCookie = serialize(
        "koperasiActive",
        JSON.stringify(koperasiList[0]),
        {
          httpOnly: false,
          secure: env.VITE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 5, // 5 days
        },
      );

      const anggotaCookie = serialize(
        "anggota",
        JSON.stringify(koperasiList[0].anggota),
        {
          httpOnly: false,
          secure: env.VITE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 5, // 5 days
        },
      );

      const permissionsCookie = serialize(
        "permissions",
        JSON.stringify(koperasiList[0].permissions),
        {
          httpOnly: false,
          secure: env.VITE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 5, // 5 days
        },
      );

      return new Response(
        JSON.stringify({ ...response.data, token, token_type }),
        {
          headers: {
            "Set-Cookie": [
              tokenCookie,
              userCookie,
              koperasiListCookie,
              koperasiActiveCookie,
              anggotaCookie,
              permissionsCookie,
            ].join(", "),
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      handleApiError(error);
    }
  });

export const logout = createServerFn({ method: "POST" }).handler(
  async (): Promise<Response> => {
    const tokenCookie = serialize("token", "", {
      httpOnly: true,
      secure: env.VITE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    const userCookie = serialize("user", "", {
      httpOnly: false,
      secure: env.VITE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    const koperasiListCookie = serialize("koperasiList", "", {
      httpOnly: false,
      secure: env.VITE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    const koperasiActiveCookie = serialize("koperasiActive", "", {
      httpOnly: false,
      secure: env.VITE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    const anggotaCookie = serialize("anggota", "", {
      httpOnly: false,
      secure: env.VITE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    const permissionsCookie = serialize("permissions", "", {
      httpOnly: false,
      secure: env.VITE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Set-Cookie": [
          tokenCookie,
          userCookie,
          koperasiListCookie,
          koperasiActiveCookie,
          anggotaCookie,
          permissionsCookie,
        ].join(", "),
        "Content-Type": "application/json",
      },
    });
  },
);

export const isAuthenticated = (): boolean => {
  if (typeof document === "undefined") {
    return false;
  }

  const cookies = document.cookie.split(";");
  const userCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("user="),
  );

  return !!userCookie;
};
