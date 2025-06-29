"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { loginWithEmail, registerWithEmail, signInWithGoogle, logout as firebaseLogout } from "../utils/auth"

import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

const AuthContext = createContext(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) { 
        const { uid, email, displayName, photoURL } = firebaseUser
        const userData = {
          uid,
          email,
          name: displayName || email,
          avatar: photoURL || email?.[0]?.toUpperCase(),
        }
        setUser(userData)
        localStorage.setItem("dashboard-user", JSON.stringify(userData))
      } else {
        setUser(null)
        localStorage.removeItem("dashboard-user")
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password, isRegister = false) => {
    try {
      const firebaseUser = isRegister
        ? await registerWithEmail(email, password)
        : await loginWithEmail(email, password)

      const { uid, email: userEmail, displayName, photoURL } = firebaseUser
      const userData = {
        uid,
        email: userEmail,
        name: displayName || userEmail,
        avatar: photoURL || userEmail?.[0]?.toUpperCase(),
      }
      setUser(userData)
      localStorage.setItem("dashboard-user", JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const loginWithGoogle = async () => {
    try {
      const firebaseUser = await signInWithGoogle()
      const { uid, email, displayName, photoURL } = firebaseUser
      const userData = {
        uid,
        email,
        name: displayName || email,
        avatar: photoURL || email?.[0]?.toUpperCase(),
      }
      setUser(userData)
      localStorage.setItem("dashboard-user", JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    await firebaseLogout()
    setUser(null)
    localStorage.removeItem("dashboard-user")
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
