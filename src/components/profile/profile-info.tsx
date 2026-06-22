import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2, Mail, Save, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateProfile } from "@/services/profileService";

export function ProfileInfo({
  user,
}: {
  user: { name: string; email: string } & Record<string, any> & {
      has_password?: boolean;
    };
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<string, Array<string>>>
  >({});

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setFieldErrors({});
  }, [user]);

  const mutation = useMutation({
    mutationFn: () =>
      updateProfile({
        name,
        email,
      }),
    onSuccess: () => {
      toast.success("Profil berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setFieldErrors({});
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
      }
      toast.error(error.response?.data?.message || "Gagal memperbarui profil");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setFieldErrors({});
  };

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

  const hasChanges = name !== user.name || email !== user.email;
  const canEditEmail = !!user.has_password;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <User className="w-4 h-4" />
          Informasi Pribadi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className={fieldErrors["name"]?.length ? "text-red-500" : ""}
            >
              Nama
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) =>
                handleInputChange(setName, "name", e.target.value)
              }
              disabled={mutation.isPending}
              className={
                fieldErrors["name"]?.length
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {fieldErrors["name"]?.length ? (
              <p className="text-sm text-red-500">{fieldErrors["name"][0]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className={fieldErrors["email"]?.length ? "text-red-500" : ""}
            >
              Alamat Email
            </Label>
            <div className="relative">
              <Mail
                className={`absolute left-3 top-2.5 h-4 w-4 ${fieldErrors["email"] ? "text-red-500" : "text-muted-foreground"}`}
              />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  handleInputChange(setEmail, "email", e.target.value)
                }
                disabled={mutation.isPending || !canEditEmail}
                className={`${!canEditEmail ? "pl-9 bg-slate-50 text-muted-foreground cursor-not-allowed" : "pl-9"} ${fieldErrors["email"]?.length ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
            </div>
            {fieldErrors["email"]?.length ? (
              <p className="text-sm text-red-500">{fieldErrors["email"][0]}</p>
            ) : null}
            {!canEditEmail && (
              <Alert
                variant="destructive"
                className="py-2 h-auto bg-amber-50 text-amber-900 border-amber-200"
              >
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-xs ml-2 translate-y-0.5">
                  Anda harus membuat kata sandi terlebih dahulu untuk mengubah
                  email.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-slate-900 text-white hover:bg-slate-800 gap-2"
              disabled={mutation.isPending || !hasChanges}
            >
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>

            {hasChanges && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={mutation.isPending}
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
