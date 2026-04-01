import api from './axios'

export async function getAdminDashboard() {
  const { data } = await api.get('/dashboard')
  return data
}

export async function getTechnicianDashboard() {
  const { data } = await api.get('/technician/dashboard')
  return data
}
