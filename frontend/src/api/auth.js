import api from './axios'

export async function login(credentials) {
  const { data } = await api.post('/login', credentials)
  return data
}

export async function logout() {
  const { data } = await api.post('/logout')
  return data
}

export async function getMe() {
  const { data } = await api.get('/me')
  return data
}
