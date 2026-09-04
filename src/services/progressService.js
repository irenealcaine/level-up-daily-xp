import { doc, getDoc, runTransaction } from "firebase/firestore"
import { db } from "./firebase"

const defaultProgress = {
  xp: 0,
  level: 1,
  missionProgress: {},
}

function progressDocument(uid) {
  return doc(db, "users", uid, "progress", "data")
}

export async function getProgress(uid) {
  const snapshot = await getDoc(progressDocument(uid))
  return snapshot.exists() ? { ...defaultProgress, ...snapshot.data() } : defaultProgress
}

export async function recordMissionProgress(uid, { missionId, periodKey, goal, reward, increment = 1 }) {
  const reference = progressDocument(uid)
  let result

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference)
    const current = snapshot.exists() ? { ...defaultProgress, ...snapshot.data() } : defaultProgress
    const key = `${missionId}:${periodKey}`
    const previousValue = Number(current.missionProgress?.[key] || 0)
    const nextValue = Math.min(previousValue + increment, goal)
    const completedNow = previousValue < goal && nextValue >= goal
    const nextProgress = {
      ...current.missionProgress,
      [key]: nextValue,
    }
    const nextXP = Number(current.xp || 0) + (completedNow ? reward : 0)
    const nextData = {
      xp: nextXP,
      level: Math.floor(nextXP / 100) + 1,
      missionProgress: nextProgress,
      updatedAt: new Date().toISOString(),
    }

    transaction.set(reference, nextData, { merge: true })
    result = { ...current, ...nextData }
  })

  return { progress: result, completedNow: result.missionProgress[`${missionId}:${periodKey}`] >= goal }
}
