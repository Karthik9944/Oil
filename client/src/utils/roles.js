function resolveRole(userOrRole) {
  return typeof userOrRole === 'string' ? userOrRole : userOrRole?.role;
}

function normalizeRole(role) {
  return String(role || '').trim().toLowerCase();
}

export function hasAdminAccess(userOrRole) {
  const role = resolveRole(userOrRole);
  return role === 'Admin' || role === 'Manager';
}

export function canAccessCustomers(userOrRole) {
  return resolveRole(userOrRole) === 'Admin';
}

export function canAccessSettings(userOrRole) {
  return resolveRole(userOrRole) === 'Admin';
}

export function getVisibleLoginActivityRoles(userOrRole) {
  const normalizedRole = normalizeRole(resolveRole(userOrRole));

  if (normalizedRole === 'admin') {
    return ['Staff', 'Manager'];
  }

  if (normalizedRole === 'manager') {
    return ['Staff'];
  }

  return [];
}
