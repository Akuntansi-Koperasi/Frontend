export function UsersHeader() {
  return (
    <div className="flex md:items-center items-start justify-between pt-4 flex-col md:flex-row gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
        <p className="text-lg text-muted-foreground">
          Kelola akun akses anggota
        </p>
      </div>
    </div>
  );
}
