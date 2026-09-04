import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./firebase"

function financeDocument(uid) {
  return doc(db, "users", uid, "finance", "data")
}

export async function getFinanceData(uid) {
  const snapshot = await getDoc(financeDocument(uid))
  if (!snapshot.exists()) {
    return { entries: [], goal: null }
  }

  const data = snapshot.data()
  return {
    entries: Array.isArray(data.entries) ? data.entries : [],
    goal: data.goal || null,
  }
}

export async function saveFinanceData(uid, entries, goal) {
  await setDoc(financeDocument(uid), {
    entries,
    goal: goal || null,
    updatedAt: new Date().toISOString(),
  })
}
