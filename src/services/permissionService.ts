export type PermissionAccess = {
  canView: boolean
  canManage: boolean
  canDelete: boolean
}

function readStoredPermissions(): Array<string> {
  try {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('permissions')
    return stored ? (JSON.parse(stored) as Array<string>) : []
  } catch {
    return []
  }
}

export function getPermissionAccess(prefix: string): PermissionAccess {
  const permissions = readStoredPermissions()

  return {
    canView:
      permissions.includes(`${prefix}.lihat`) ||
      permissions.includes(`${prefix}.modifikasi`) ||
      permissions.includes(`${prefix}.admin`),
    canManage:
      permissions.includes(`${prefix}.modifikasi`) ||
      permissions.includes(`${prefix}.admin`),
    canDelete: permissions.includes(`${prefix}.admin`),
  }
}