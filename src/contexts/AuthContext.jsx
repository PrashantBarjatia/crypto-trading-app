import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  function signup({ username, password }) {
    if (!username || !password) throw new Error('Username + password required')
    const exists = users.find(u => u.username === username)
    if (exists) throw new Error('User already exists')
    const user = { id: Date.now(), username, password }
    setUsers(prev => [...prev, user])
    setCurrentUser({ id: user.id, username: user.username })
    return user
  }

  function login({ username, password }) {
    const u = users.find(x => x.username === username && x.password === password)
    if (!u) throw new Error('Invalid credentials')
    setCurrentUser({ id: u.id, username: u.username })
    return u
  }

  function logout() {
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ users, currentUser, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
