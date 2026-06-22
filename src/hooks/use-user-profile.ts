import { useQuery } from "@tanstack/react-query";
import type { ProfileData } from "@/services/profileService";
import { getProfile } from "@/services/profileService";

export type Anggota = {
  id: number;
  nama: string;
  email: string;
  photo_profile: string | null;
};

function syncProfileStorage(data: ProfileData) {
  if (typeof window === "undefined") return;
  const incomingList = data.koperasi;

  // merge koperasiList: update existing entries with same koperasi.id, keep others
  const existingRaw = localStorage.getItem("koperasiList");
  let existingList: Array<any> = [];
  try {
    existingList = existingRaw ? JSON.parse(existingRaw) : [];
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

  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("koperasiList", JSON.stringify(merged));

  const existingActiveRaw = localStorage.getItem("koperasiActive");
  let existingActive = null;
  try {
    existingActive = existingActiveRaw ? JSON.parse(existingActiveRaw) : null;
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

  if (nextActive) {
    localStorage.setItem("koperasiActive", JSON.stringify(nextActive));
    localStorage.setItem("anggota", JSON.stringify(nextActive.anggota));
    localStorage.setItem("permissions", JSON.stringify(nextActive.permissions));
  } else if (existingActive) {
    // keep existing active as-is
    // ensure anggota & permissions kept in sync with existingActive
    localStorage.setItem("koperasiActive", JSON.stringify(existingActive));
    if (existingActive.anggota)
      localStorage.setItem("anggota", JSON.stringify(existingActive.anggota));
    if (existingActive.permissions)
      localStorage.setItem(
        "permissions",
        JSON.stringify(existingActive.permissions),
      );
  } else {
    localStorage.removeItem("koperasiActive");
    localStorage.removeItem("anggota");
    localStorage.removeItem("permissions");
  }
}

function readStoredAnggota(): Anggota | undefined {
  try {
    if (typeof window === "undefined") return undefined;

    const stored = localStorage.getItem("anggota");
    if (!stored) return undefined;

    const parsed = JSON.parse(stored);
    return parsed?.user ?? parsed;
  } catch {
    return undefined;
  }
}

export function useUserProfile() {
  return useQuery<Anggota>({
    queryKey: ["profile"],
    queryFn: async () => {
      const data = await getProfile();
      syncProfileStorage(data);
      return data.koperasi[0].anggota;
    },
    initialData: () => {
      return readStoredAnggota();
    },
    staleTime: 1000 * 60 * 5,
  });
}
