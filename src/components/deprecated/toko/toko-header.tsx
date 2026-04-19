import { TokoAddDialog } from './toko-add-dialog'

export function TokoHeader() {
  return (
    <div className="flex md:items-center items-start justify-between pt-4 flex-col sm:flex-row gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Manajemen Toko</h1>
        <p className="text-lg text-muted-foreground">
          Kelola lokasi toko dan cabang koperasi
        </p>
      </div>
      <TokoAddDialog />
    </div>
  )
}
