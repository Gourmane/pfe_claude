import api from './axios'

export async function getTechnicians() {
  const { data } = await api.get('/technicians')
  return data
}
