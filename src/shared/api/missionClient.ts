import { baseClient } from './baseClient'

export type GenerateStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface GenerateRequest {
  difficulty: Difficulty
  category: string
  language: string
}

export interface GenerateResponse {
  jobId: string
}

export interface GenerateStatusResponse {
  status: GenerateStatus
  missionId: number | null
}

export interface Mission {
  id: number
  title: string
  description: string
  difficulty: Difficulty
  category: string
  language: string
  createdAt: string
}

async function generate(body: GenerateRequest): Promise<GenerateResponse> {
  return baseClient.post<GenerateResponse>('/generate', body)
}

async function getGenerateStatus(jobId: string): Promise<GenerateStatusResponse> {
  return baseClient.get<GenerateStatusResponse>(`/generate/status/${jobId}`)
}

async function getMission(id: number): Promise<Mission> {
  return baseClient.get<Mission>(`/missions/${id}`)
}

export const missionClient = { generate, getGenerateStatus, getMission }
