import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('vhx_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (userData, token) => {
    localStorage.setItem('vhx_user',  JSON.stringify(userData))
    localStorage.setItem('vhx_token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('vhx_user')
    localStorage.removeItem('vhx_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}