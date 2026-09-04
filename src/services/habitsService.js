import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./firebase"

function habitsDocument(uid) {
  return doc(db, "users", uid, "habits", "data")
}

export async function getHabits(uid) {
  const snapshot = await getDoc(habitsDocument(uid))
  if (!snapshot.exists()) return []

  const data = snapshot.data()
  return Array.isArray(data.items) ? data.items : []
}

export async function saveHabits(uid, items) {
  await setDoc(habitsDocument(uid), {
    items,
    updatedAt: new Date().toISOString(),
  })
}
