import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)) //
}

// --- Game / client data helpers ---

export type GameDefinition = {
  id: string
  slug: string
  title: string
  durationSeconds: number
  description?: string
  scoring?: {
    [shapeType: string]: number
  }
}

export type GameEvent = {
  type: string
  shapeType?: string
  scoreDelta?: number
  atMs: number
}

export type GameProgress = {
  gameId: string
  slug: string
  timestamp: string // ISO
  durationSeconds: number
  timePlayedSeconds: number
  finalScore: number
  phaseReached: number
  events: GameEvent[]
}

// Fetch game definitions from the public JSON bundle.
export async function fetchGameData(): Promise<GameDefinition[]> {
  const res = await fetch('/data/games-data.json', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load game data')
  return res.json()
}

// Local storage helpers for client-side persistence until backend exists.
export function saveProgressToLocal(key: string, data: unknown) {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.warn('saveProgressToLocal failed', e)
  }
}

export function loadProgressFromLocal<T = any>(key: string): T | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch (e) {
    console.warn('loadProgressFromLocal failed', e)
    return null
  }
}

// Download a JSON file (useful for exporting progress or for QA)
export function exportJSON(filename: string, data: unknown) {
  if (typeof window === 'undefined') return
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// Stub for sending progress to backend when available. Caller should handle failures.
export async function postProgressToServer(endpoint: string, data: unknown) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res
  } catch (e) {
    console.warn('postProgressToServer failed', e)
    throw e
  }
}
