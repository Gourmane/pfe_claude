import api from './axios'

export async function getClients(params = {}) {
  const { data } = await api.get('/clients', { params })
  return data
}

export async function getClient(clientId) {
  const { data } = await api.get(`/clients/${clientId}`)
  return data
}

export async function createClient(payload) {
  const { data } = await api.post('/clients', payload)
  return data
}

export async function updateClient(clientId, payload) {
  const { data } = await api.put(`/clients/${clientId}`, payload)
  return data
}

export async function deleteClient(clientId) {
  const { data } = await api.delete(`/clients/${clientId}`)
  return data
}
