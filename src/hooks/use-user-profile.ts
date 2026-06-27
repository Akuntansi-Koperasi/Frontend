import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { parse, serialize } from "cookie";
import type { ProfileData } from "@/services/profileService";
import type { Anggota } from "@/services/authService";
import { getProfile } from "@/services/profileService";
import { env } from "@/env";

function syncProfileStorage(data: ProfileData) {
  if (typeof document === "undefined") return;
  const incomingList = data.koperasi;

  // merge koperasiList: update existing entries with same koperasi.id, keep others
  const cookies = parse(document.cookie);
  const existingRaw = cookies.koperasiList;
  let existingList: Array<any> = [];
  try {
    existingList = existingRaw
      ? JSON.parse(decodeURIComponent(existingRaw))
      : [];
  } catch {
    existingList = [];
  }

  const merged = [...existingList];
  for (const item of incomingList) {
    const id = item.koperasi.id;
    const idx = merged.findIndex((m) => m?.koperasi?.id === id);
    if (idx >= 0) merged[idx] = item;
    else merged.push(item);
  }

  const userCookie = serialize("user", JSON.stringify(data.user), {
    httpOnly: false,
    secure: env.VITE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 5,
  });

  const koperasiListCookie = serialize("koperasiList", JSON.stringify(merged), {
    httpOnly: false,
    secure: env.VITE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 5,
  });

  const existingActiveRaw = cookies.koperasiActive;
  let existingActive = null;
  try {
    existingActive = existingActiveRaw
      ? JSON.parse(decodeURIComponent(existingActiveRaw))
      : null;
  } catch {
    existingActive = null;
  }

  // Prefer keeping currently-selected active koperasi (if it exists in the new list).
  // If none is selected yet, fall back to the first koperasi from the API.
  const preferredActiveId: number | null =
    typeof existingActive?.koperasi?.id === "number"
      ? existingActive.koperasi.id
      : null;

  let nextActive: any = null;
  if (preferredActiveId != null) {
    const idx = merged.findIndex((m) => m?.koperasi?.id === preferredActiveId);
    if (idx >= 0) nextActive = merged[idx];
  }
  if (!nextActive && incomingList.length > 0) {
    const fallbackId = incomingList[0]?.koperasi?.id;
    const idx = merged.findIndex((m) => m?.koperasi?.id === fallbackId);
    nextActive = idx >= 0 ? merged[idx] : incomingList[0];
  }

  const cookiesToSet: Array<string> = [userCookie, koperasiListCookie];

  if (nextActive) {
    const koperasiActiveCookie = serialize(
      "koperasiActive",
      JSON.stringify(nextActive),
      {
        httpOnly: false,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5,
      },
    );
    const anggotaCookie = serialize(
      "anggota",
      JSON.stringify(nextActive.anggota),
      {
        httpOnly: false,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5,
      },
    );
    const permissionsCookie = serialize(
      "permissions",
      JSON.stringify(nextActive.permissions),
      {
        httpOnly: false,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5,
      },
    );
    cookiesToSet.push(koperasiActiveCookie, anggotaCookie, permissionsCookie);
  } else if (existingActive) {
    // keep existing active as-is
    const koperasiActiveCookie = serialize(
      "koperasiActive",
      JSON.stringify(existingActive),
      {
        httpOnly: false,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5,
      },
    );
    cookiesToSet.push(koperasiActiveCookie);
    if (existingActive.anggota) {
      const anggotaCookie = serialize(
        "anggota",
        JSON.stringify(existingActive.anggota),
        {
          httpOnly: false,
          secure: env.VITE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 5,
        },
      );
      cookiesToSet.push(anggotaCookie);
    }
    if (existingActive.permissions) {
      const permissionsCookie = serialize(
        "permissions",
        JSON.stringify(existingActive.permissions),
        {
          httpOnly: false,
          secure: env.VITE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 5,
        },
      );
      cookiesToSet.push(permissionsCookie);
    }
  }

  // Set all cookies at once
  document.cookie = cookiesToSet.join(", ");
}

function readStoredAnggota(): Anggota | undefined {
  try {
    if (typeof document === "undefined") return undefined;

    const cookies = parse(document.cookie);
    const stored = cookies.anggota;
    if (!stored) return undefined;

    const parsed = JSON.parse(decodeURIComponent(stored));
    return parsed?.user ?? parsed;
  } catch {
    return undefined;
  }
}

export function useUserProfile() {
  const profileFn = useServerFn(getProfile);
  return useQuery<Anggota>({
    queryKey: ["profile"],
    queryFn: async () => {
      const data = await profileFn();
      if (!data) {
        throw new Error("Failed to fetch profile");
      }
      syncProfileStorage(data);
      return data.koperasi[0].anggota;
    },
    placeholderData: readStoredAnggota,
    staleTime: 1000 * 60 * 5,
  });
}
