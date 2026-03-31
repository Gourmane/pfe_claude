import api from './axios'

export async function getTickets(params = {}) {
  const { data } = await api.get('/tickets', { params })
  return data
}

export async function createTicket(payload) {
  const { data } = await api.post('/tickets', payload)
  return data
}
