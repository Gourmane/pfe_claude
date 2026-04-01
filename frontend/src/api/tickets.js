import api from './axios'

export async function getTickets(params = {}) {
  const { data } = await api.get('/tickets', { params })
  return data
}

export async function getTicket(ticketId) {
  const { data } = await api.get(`/tickets/${ticketId}`)
  return data
}

export async function createTicket(payload) {
  const { data } = await api.post('/tickets', payload)
  return data
}

export async function updateTicket(ticketId, payload) {
  const { data } = await api.patch(`/tickets/${ticketId}`, payload)
  return data
}

export async function updateTicketStatus(ticketId, status) {
  const { data } = await api.patch(`/tickets/${ticketId}/status`, { status })
  return data
}

export async function assignTicket(ticketId, technicianId) {
  const { data } = await api.post(`/tickets/${ticketId}/assign`, {
    technician_id: technicianId,
  })
  return data
}

export async function addTicketComment(ticketId, comment) {
  const { data } = await api.post(`/tickets/${ticketId}/comments`, { comment })
  return data
}

export async function generateTicketSummary(ticketId) {
  const { data } = await api.post(`/tickets/${ticketId}/generate-summary`)
  return data
}
