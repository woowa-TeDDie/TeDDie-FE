import { baseClient } from './baseClient'
import type { User, AuthTokens } from '@/entities/user'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  nickname: string
}

async function login(body: LoginRequest): Promise<AuthTokens> {
  return baseClient.post<AuthTokens>('/auth/login', body)
}

async function register(body: RegisterRequest): Promise<AuthTokens> {
  return baseClient.post<AuthTokens>('/auth/register', body)
}

async function getMe(): Promise<User> {
  return baseClient.get<User>('/auth/me')
}

export const authClient = { login, register, getMe }
