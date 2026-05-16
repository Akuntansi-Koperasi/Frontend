export type RoleRecord = {
  id: number
  name: string
}

export type PermissionLevel = 'lihat' | 'modifikasi' | 'admin'

export type PermissionMenuItem = {
  key: string
  label: string
}
