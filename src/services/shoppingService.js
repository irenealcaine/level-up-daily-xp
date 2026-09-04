import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./firebase"

function shoppingDocument(uid) {
  return doc(db, "users", uid, "shopping", "data")
}

export async function getShoppingItems(uid) {
  const snapshot = await getDoc(shoppingDocument(uid))
  if (!snapshot.exists()) return []

  const data = snapshot.data()
  return Array.isArray(data.items) ? data.items : []
}

export async function saveShoppingItems(uid, items) {
  await setDoc(shoppingDocument(uid), {
    items,
    updatedAt: new Date().toISOString(),
  })
}
