import { useEffect, useState } from 'react'
import { BASE_PLAN } from './data'

// Shared tablet → several children's profiles on one device, each with its own saved position.
const KEY = 'mera-ya-meri-v1'
const EMPTY = { profiles: [], current: null }

export function useStore() {
  const [db, setDb] = useState(() => {
    try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY)) } } catch { return EMPTY }
  })
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(db)) } catch { /* storage blocked */ } }, [db])
  return [db, setDb]
}

export const newProfile = (name, avatar, gender) => ({
  id: Date.now().toString(36), name, avatar, gender,
  plan: [...BASE_PLAN], pos: 0, elapsed: 0, stars: 0, diagnosed: [], log: [], sessions: 1,
})

export const SESSION_SECONDS = 600 // C4: 10-minute session budget
export const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
