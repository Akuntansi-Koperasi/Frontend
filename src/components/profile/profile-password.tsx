import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/services/profileService";

interface ProfilePasswordProps {
  hasPassword: boolean;
}

export function ProfilePassword({ hasPassword }: ProfilePasswordProps) {
  const queryClient = useQueryClient();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<string, Array<string>>>
  >({});

  const mutation = useMutation({
    mutationFn: () =>
      updatePassword({
        ...(hasPassword && { current_password: currentPassword }),
        password: newPassword,
        password_confirmation: confirmPassword,
      }),
    onSuccess: () => {
      toast.success(
        hasPassword
          ? "Kata sandi berhasil diperbarui"
          : "Kata sandi berhasil dibuat",
      );
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFieldErrors({});
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
      } else {
        toast.error(
          error.response?.data?.message || "Gagal memproses kata sandi",
        );
      }
    },
  });

  const handleInputChange = (
    setter: (value: string) => void,
    field: string,
    value: string,
  ) => {
    setter(value);
    if (fieldErrors[field]?.length) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const errors: Record<string, Array<string>> = {};

    if (hasPassword && !currentPassword) {
      errors.current_password = ["Kata sandi saat ini harus diisi"];
    }

    if (newPassword.length < 6) {
      errors.password = ["Kata sandi minimal 6 karakter"];
    }

    if (newPassword !== confirmPassword) {
      errors.password_confirmation = ["Konfirmasi kata sandi tidak cocok"];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    mutation.mutate();
  };

  const isFormFilled = hasPassword
    ? currentPassword !== "" && newPassword !== "" && confirmPassword !== ""
    : newPassword !== "" && confirmPassword !== "";

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
          {hasPassword ? (
            <Lock className="w-4 h-4 text-slate-800" />
          ) : (
            <KeyRound className="w-4 h-4 text-slate-800" />
          )}
          {hasPassword ? "Ganti Kata Sandi" : "Buat Kata Sandi"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {hasPassword && (
            <div className="space-y-2">
              <Label
                htmlFor="current-password"
                className={
                  fieldErrors.current_password?.length ? "text-red-600" : ""
                }
              >
                Kata Sandi Saat Ini
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) =>
                    handleInputChange(
                      setCurrentPassword,
                      "current_password",
                      e.target.value,
                    )
                  }
                  placeholder="Masukkan kata sandi lama"
                  className={`pr-10 ${fieldErrors.current_password?.length ? "border-red-500 focus-visible:ring-red-200" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {fieldErrors.current_password?.length ? (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 animate-in slide-in-from-top-1">
                  <AlertCircle className="w-3 h-3" />{" "}
                  {fieldErrors.current_password[0]}
                </p>
              ) : null}
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="new-password"
              className={fieldErrors.password?.length ? "text-red-600" : ""}
            >
              Kata Sandi Baru
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  handleInputChange(setNewPassword, "password", e.target.value)
                }
                placeholder="Minimal 6 karakter"
                className={`pr-10 ${fieldErrors.password?.length ? "border-red-500 focus-visible:ring-red-200" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {fieldErrors.password?.length ? (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1 animate-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" /> {fieldErrors.password[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirm-password"
              className={
                fieldErrors.password_confirmation?.length ? "text-red-600" : ""
              }
            >
              Konfirmasi Kata Sandi Baru
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  handleInputChange(
                    setConfirmPassword,
                    "password_confirmation",
                    e.target.value,
                  )
                }
                placeholder="Ulangi kata sandi baru"
                className={`pr-10 ${fieldErrors.password_confirmation?.length ? "border-red-500 focus-visible:ring-red-200" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {fieldErrors.password_confirmation?.length ? (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1 animate-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" />{" "}
                {fieldErrors.password_confirmation[0]}
              </p>
            ) : null}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className={`w-full md:w-auto h-11 font-semibold bg-slate-900 text-white hover:bg-slate-800`}
              disabled={mutation.isPending || !isFormFilled}
            >
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : hasPassword ? (
                <Lock className="w-4 h-4 mr-2" />
              ) : (
                <KeyRound className="w-4 h-4 mr-2" />
              )}
              {mutation.isPending
                ? "Menyimpan..."
                : hasPassword
                  ? "Perbarui Kata Sandi"
                  : "Simpan Kata Sandi"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
