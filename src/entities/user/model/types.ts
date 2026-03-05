export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: number
  email: string
  nickname: string
  role: UserRole
}

export interface AuthTokens {
  accessToken: string
}
