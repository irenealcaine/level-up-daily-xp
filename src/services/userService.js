import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "./firebase"

export async function createUserProfile(uid, nick, email) {
  await setDoc(doc(db, "users", uid), {
    nick,
    email,
    createdAt: new Date().toISOString(),
  })
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid))
  if (snap.exists()) {
    return snap.data()
  }
  return null
}
