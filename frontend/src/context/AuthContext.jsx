import { createContext, useEffect, useState } from 'react'
import { getMe, login as loginRequest, logout as logoutRequest } from '../api/auth'

const AuthContext = createContext(null)

function clearPersistedAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  Object.keys(localStorage)
    .filter((key) => /auth/i.test(key))
    .forEach((key) => localStorage.removeItem(key))
}

function persistAuth(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(() => {
    let isMounted = true

    async function restoreAuth() {
      const persistedToken = localStorage.getItem('token')

      if (!persistedToken) {
        setLoading(false)
        return
      }

      try {
        const response = await getMe()
        const restoredUser = response.data

        if (!isMounted) {
          return
        }

        persistAuth(persistedToken, restoredUser)
        setToken(persistedToken)
        setUser(restoredUser)
      } catch {
        if (!isMounted) {
          return
        }

        clearPersistedAuth()
        setToken(null)
        setUser(null)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    restoreAuth()

    return () => {
      isMounted = false
    }
  }, [])

  async function login(email, password) {
    const response = await loginRequest({ email, password })
    const nextToken = response.token
    const nextUser = response.data

    persistAuth(nextToken, nextUser)
    setToken(nextToken)
    setUser(nextUser)

    return response
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      clearPersistedAuth()
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
