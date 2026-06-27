import { createServerFn } from "@tanstack/react-start";
import { serialize } from "cookie";
import { api } from "./api";
import { handleApiError } from "./errorService";
import type { Koperasi, User } from "./authService";
import { env } from "@/env";

export type ProfileData = {
  user: User;
  koperasi: Array<Koperasi>;
};

export type UpdateProfilePayload = {
  name: string;
  email: string;
};

export type UpdatePasswordPayload = {
  current_password?: string;
  password: string;
  password_confirmation: string;
};

export type SerializedFile = {
  name: string;
  type: string;
  base64: string;
};

export const getProfile = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await api.get<{ status: string; data: ProfileData }>(
        "/profile/me",
      );
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },
);

export const switchKoperasi = createServerFn({ method: "POST" })
  .validator((data: { koperasi: Koperasi }) => data)
  .handler(({ data }): Response => {
    const koperasiActiveCookie = serialize(
      "koperasiActive",
      JSON.stringify(data.koperasi),
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
      JSON.stringify(data.koperasi.anggota),
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
      JSON.stringify(data.koperasi.permissions),
      {
        httpOnly: false,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      },
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Set-Cookie": [
          koperasiActiveCookie,
          anggotaCookie,
          permissionsCookie,
        ].join(", "),
        "Content-Type": "application/json",
      },
    });
  });
