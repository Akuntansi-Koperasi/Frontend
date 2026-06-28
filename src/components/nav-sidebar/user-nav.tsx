import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Building2,
  Check,
  ChevronDown,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { parse } from "cookie";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import type { Koperasi } from "@/services/authService";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { switchKoperasi } from "@/services/profileService";
import { logout as logoutFn } from "@/services/authService";

function getKoperasiList(): Array<Koperasi> {
  try {
    if (typeof document === "undefined") return [];
    const cookies = parse(document.cookie);
    const stored = cookies.koperasiList;
    return stored ? JSON.parse(decodeURIComponent(stored)) : [];
  } catch {
    return [];
  }
}

function getActiveKoperasiId(): number | null {
  try {
    if (typeof document === "undefined") return null;
    const cookies = parse(document.cookie);
    const stored = cookies.koperasiActive;
    if (!stored) return null;
    const parsed = JSON.parse(decodeURIComponent(stored));
    const id = parsed?.koperasi?.id;
    return typeof id === "number" ? id : null;
  } catch {
    return null;
  }
}

function getActiveKoperasi(): Koperasi | null {
  try {
    if (typeof document === "undefined") return null;
    const cookies = parse(document.cookie);
    const stored = cookies.koperasiActive;
    return stored ? (JSON.parse(decodeURIComponent(stored)) as Koperasi) : null;
  } catch {
    return null;
  }
}

export function UserNav() {
  const { data: user } = useUserProfile();
  const switchKoperasiFn = useServerFn(switchKoperasi);
  const logoutServerFn = useServerFn(logoutFn);
  const queryClient = useQueryClient();
  const router = useRouter();

  const [koperasiList] = React.useState<Array<Koperasi>>(() =>
    getKoperasiList(),
  );
  const [activeId, setActiveId] = React.useState<number | null>(() =>
    getActiveKoperasiId(),
  );

  const activeKoperasi = getActiveKoperasi();

  const handleSwitchKoperasi = async (item: Koperasi) => {
    if (item.koperasi.id === activeId) return;

    // Set cookies via server fn
    await switchKoperasiFn({ data: { koperasi: item } });

    setActiveId(item.koperasi.id);

    // Panggil ulang profile segera (akan memanggil API /profile/me)
    // supaya storage (anggota/permissions/koperasiActive) tersinkron sebelum reload.
    try {
      await queryClient.refetchQueries({ queryKey: ["profile"], exact: true });
    } finally {
      // Reload page to apply new permissions everywhere
      window.location.reload();
    }
  };

  const getInitials = (name: string) => {
    return (name || "User")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const logout = async () => {
    try {
      await logoutServerFn();
      toast.success("Logout berhasil!");
    } catch (err: any) {
      const msg = err?.message || "Logout gagal. Coba lagi.";
      toast.error(msg);
    }
    queryClient.removeQueries({
      queryKey: ["profile"],
    });
    router.navigate({ to: "/login", replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-slate-100 h-12 gap-2 px-2">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage
              src={user?.photo_profile || undefined}
              alt={user?.nama || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-200 text-slate-700 font-bold text-xs">
              {user?.nama ? getInitials(user.nama) : "..."}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {user?.nama ? (
              <p className="text-sm font-medium leading-none">{user.nama}</p>
            ) : (
              <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
            )}
            {activeKoperasi?.koperasi.nama ? (
              <p className="text-xs leading-none text-muted-foreground">
                {activeKoperasi.koperasi.nama}
              </p>
            ) : (
              <div className="h-3 w-28 rounded bg-slate-200 animate-pulse" />
            )}
          </div>
        </DropdownMenuLabel>

        {/* Koperasi switcher — only show if more than 1 */}
        {koperasiList.length > 1 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              {user?.nama ? (
                "Pindah Koperasi"
              ) : (
                <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
              )}
            </DropdownMenuLabel>
            {koperasiList.map((item) => (
              <DropdownMenuItem
                key={item.koperasi.id}
                onClick={() => handleSwitchKoperasi(item)}
                className="gap-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border bg-background shrink-0">
                  <Building2 className="size-3.5" />
                </div>
                {user?.nama ? (
                  <span className="flex-1 truncate">{item.koperasi.nama}</span>
                ) : (
                  <div className="h-3 flex-1 rounded bg-slate-200 animate-pulse" />
                )}
                {item.koperasi.id === activeId && (
                  <Check className="size-4 text-primary shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/profile" className="w-full cursor-pointer">
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={async () => {
            await logout();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
