import api from './axios'

export async function getAdminDashboard() {
  const { data } = await api.get('/dashboard')
  return data
}
