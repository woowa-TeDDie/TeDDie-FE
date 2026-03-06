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

async function generate(body: GenerateRequest): Promise<GenerateResponse> {
  return baseClient.post<GenerateResponse>('/generate', body)
}

async function getGenerateStatus(jobId: string): Promise<GenerateStatusResponse> {
  return baseClient.get<GenerateStatusResponse>(`/generate/status/${jobId}`)
}

export const generateClient = { generate, getGenerateStatus }
