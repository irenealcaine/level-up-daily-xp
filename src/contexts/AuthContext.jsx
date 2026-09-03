import { createContext, useContext, useState, useEffect, useRef } from "react"
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
} from "firebase/auth"
import { auth } from "../services/firebase"
import { createUserProfile, getUserProfile } from "../services/userService"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const registeringRef = useRef(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (registeringRef.current) {
        setLoading(false)
        return
      }
      if (firebaseUser) {
        await reload(firebaseUser)
        if (!firebaseUser.emailVerified) {
          await firebaseSignOut(auth)
          setUser(null)
          setUserProfile(null)
          setLoading(false)
          return
        }
        setUser(firebaseUser)
        const profile = await getUserProfile(firebaseUser.uid)
        setUserProfile(profile)
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function register(nick, email, password) {
    registeringRef.current = true
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await createUserProfile(credential.user.uid, nick, email)
      sendEmailVerification(credential.user).catch(() => {})
      await firebaseSignOut(auth)
      return credential
    } finally {
      registeringRef.current = false
    }
  }

  async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    await reload(credential.user)
    if (!credential.user.emailVerified) {
      await firebaseSignOut(auth)
      throw new Error("EMAIL_NOT_VERIFIED")
    }
    return credential
  }

  async function logout() {
    setUserProfile(null)
    return firebaseSignOut(auth)
  }

  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, register, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
