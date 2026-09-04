import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { getProgress, recordMissionProgress } from "../services/progressService"

const ProgressContext = createContext()

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function getWeekKey() {
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), 0, 1)
  const week = Math.ceil((((date - firstDay) / 86400000) + firstDay.getDay() + 1) / 7)
  return `${date.getFullYear()}-W${week}`
}

export function ProgressProvider({ children }) {
  const { user } = useAuth()
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    if (!user?.uid) {
      setProgress(null)
      return
    }

    getProgress(user.uid).then(setProgress).catch(() => setProgress({ xp: 0, level: 1, missionProgress: {} }))
  }, [user?.uid])

  const recordMission = async ({ missionId, period = "daily", goal = 1, reward = 0, increment = 1 }) => {
    const periodKey = period === "weekly" ? getWeekKey() : period === "daily" ? getTodayKey() : "all"
    const result = await recordMissionProgress(user.uid, { missionId, periodKey, goal, reward, increment })
    setProgress(result.progress)
    return result
  }

  const getMissionProgress = (missionId, period = "daily") => {
    if (!progress) return 0
    const periodKey = period === "weekly" ? getWeekKey() : period === "daily" ? getTodayKey() : "all"
    return Number(progress.missionProgress?.[`${missionId}:${periodKey}`] || 0)
  }

  return (
    <ProgressContext.Provider value={{ progress, recordMission, getMissionProgress }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  return useContext(ProgressContext)
}
