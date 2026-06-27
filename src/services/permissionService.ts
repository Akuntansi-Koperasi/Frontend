export type PermissionAccess = {
  canView: boolean;
  canManage: boolean;
  canDelete: boolean;
};

function readStoredPermissions(): Array<string> {
  try {
    if (typeof document === "undefined") return [];
    const cookies = document.cookie.split(";");
    const permissionsCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("permissions="),
    );
    if (!permissionsCookie) return [];
    const cookieValue = permissionsCookie.split("=")[1];
    return cookieValue
      ? (JSON.parse(decodeURIComponent(cookieValue)) as Array<string>)
      : [];
  } catch {
    return [];
  }
}

export function getPermissionAccess(prefix: string): PermissionAccess {
  const permissions = readStoredPermissions();

  return {
    canView:
      permissions.includes(`${prefix}.lihat`) ||
      permissions.includes(`${prefix}.modifikasi`) ||
      permissions.includes(`${prefix}.admin`),
    canManage:
      permissions.includes(`${prefix}.modifikasi`) ||
      permissions.includes(`${prefix}.admin`),
    canDelete: permissions.includes(`${prefix}.admin`),
  };
}
