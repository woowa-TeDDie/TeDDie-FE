import { create } from 'zustand'
import type { GenerateStatus } from '@/shared/api/missionClient'

type StoreStatus = 'IDLE' | GenerateStatus

interface GenerateState {
  jobId: string | null
  missionId: number | null
  status: StoreStatus
  error: string | null
  setJobId: (jobId: string) => void
  setCompleted: (missionId: number) => void
  setFailed: (error: string) => void
  reset: () => void
}

export const useGenerateStore = create<GenerateState>((set) => ({
  jobId: null,
  missionId: null,
  status: 'IDLE',
  error: null,

  setJobId: (jobId) => set({ jobId, status: 'IN_PROGRESS' }),
  setCompleted: (missionId) => set({ missionId, status: 'COMPLETED' }),
  setFailed: (error) => set({ error, status: 'FAILED' }),
  reset: () => set({ jobId: null, missionId: null, status: 'IDLE', error: null }),
}))
