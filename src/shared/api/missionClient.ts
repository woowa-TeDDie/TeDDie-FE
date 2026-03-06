import { baseClient } from './baseClient'
import type { Difficulty } from './generateClient'

export type { Difficulty } from './generateClient'

export interface Mission {
  id: number
  title: string
  description: string
  difficulty: Difficulty
  category: string
  language: string
  createdAt: string
}

export interface MissionPage {
  content: Mission[]
  totalPages: number
  totalElements: number
  number: number
}

export interface GetMissionsParams {
  page?: number
  difficulty?: Difficulty
  category?: string
  language?: string
}

async function getMissions(params: GetMissionsParams = {}): Promise<MissionPage> {
  const query = new URLSearchParams()
  if (params.page !== undefined) query.set('page', String(params.page))
  if (params.difficulty) query.set('difficulty', params.difficulty)
  if (params.category) query.set('category', params.category)
  if (params.language) query.set('language', params.language)
  const qs = query.toString()
  return baseClient.get<MissionPage>(`/missions${qs ? `?${qs}` : ''}`)
}

async function getMission(id: number): Promise<Mission> {
  return baseClient.get<Mission>(`/missions/${id}`)
}

export const missionClient = { getMissions, getMission }
