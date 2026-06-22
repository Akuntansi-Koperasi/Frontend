import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import type { UserFormErrors, UserRecord } from "@/services/userService";
import type { RoleOption } from "@/services/roleService";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserProfile } from "@/hooks/use-user-profile";

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserRecord | null;
  onSave: (payload: { id: number; role_id: number }) => Promise<boolean>;
  roleOptions: Array<RoleOption>;
  errors?: UserFormErrors;
}

export function UserEditDialog({
  open,
  onOpenChange,
  user,
  onSave,
  roleOptions,
  errors,
}: UserEditDialogProps) {
  const { data: currentUser } = useUserProfile();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setEmail(user.email);
      setRole(user.role?.id ? String(user.role.id) : "");
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      const success = await onSave({
        id: user.id,
        role_id: parseInt(role, 10),
      });
      if (success) onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isSelf = currentUser?.id === user?.id;
  const isFormValid =
    name.trim() !== "" && username.trim() !== "" && email.trim() !== "";

  const generalError = errors?.general?.[0];
  const roleError = errors?.role_id?.[0] ?? errors?.role?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
            <DialogDescription>Silakan ubah data user</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Anggota</Label>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">
                  {user?.name ?? "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">
                Peran*{" "}
                {isSelf && (
                  <span className="text-xs text-amber-600 font-normal ml-2">
                    (Tidak dapat mengubah role sendiri)
                  </span>
                )}
              </Label>
              <div>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger
                    className={`h-auto min-h-12 cursor-pointer w-full px-4 py-3 ${isSelf ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isSelf}
                  >
                    <SelectValue placeholder="Pilih Peran" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((peran) => (
                      <SelectItem key={peran.id} value={peran.id.toString()}>
                        {peran.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {roleError ? (
                  <p className="text-sm text-destructive">{roleError}</p>
                ) : null}
              </div>
            </div>
            {generalError ? (
              <p className="text-sm text-destructive">{generalError}</p>
            ) : null}
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="md:w-[50%] w-full h-12 cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12 cursor-pointer"
              disabled={isLoading || !isFormValid}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogForm>
      </DialogContent>
    </Dialog>
  );
}
