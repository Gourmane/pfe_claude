export function getDashboardPath(role) {
  if (role === 'admin') {
    return '/admin/dashboard'
  }

  if (role === 'technicien') {
    return '/technician/dashboard'
  }

  return '/login'
}

export function withSearch(path, search = '') {
  if (!search) {
    return path
  }

  return `${path}${search.startsWith('?') ? search : `?${search}`}`
}
