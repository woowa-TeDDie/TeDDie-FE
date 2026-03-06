import { http, HttpResponse } from 'msw'

const MOCK_USER = {
  id: 1,
  email: 'test@example.com',
  nickname: 'Teddie',
  role: 'USER' as const,
}

const MOCK_MISSIONS = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  title: `미션 ${i + 1}: 문자열 처리`,
  description: `# 미션 ${i + 1}\n\nTDD 방식으로 구현하세요.`,
  difficulty: (['EASY', 'MEDIUM', 'HARD'] as const)[i % 3],
  category: '문자열',
  language: 'Java',
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}))

export const handlers = [
  // ── auth ──────────────────────────────────────────────
  http.post('http://localhost:8080/auth/login', () =>
    HttpResponse.json({ accessToken: 'mock-access-token' }),
  ),

  http.post('http://localhost:8080/auth/register', () =>
    HttpResponse.json({ accessToken: 'mock-access-token' }, { status: 201 }),
  ),

  http.get('http://localhost:8080/auth/me', () =>
    HttpResponse.json(MOCK_USER),
  ),

  http.post('http://localhost:8080/auth/logout', () =>
    new HttpResponse(null, { status: 204 }),
  ),

  // ── missions ──────────────────────────────────────────
  http.get('http://localhost:8080/missions', () =>
    HttpResponse.json({
      content: MOCK_MISSIONS,
      totalPages: 1,
      totalElements: MOCK_MISSIONS.length,
      number: 0,
    }),
  ),

  http.get('http://localhost:8080/missions/:id', ({ params }) => {
    const id = Number(params.id)
    const mission = MOCK_MISSIONS.find((m) => m.id === id) ?? MOCK_MISSIONS[0]
    return HttpResponse.json({ ...mission, id })
  }),

  // ── generate ──────────────────────────────────────────
  http.post('http://localhost:8080/generate', () =>
    HttpResponse.json({ jobId: 'mock-job-id' }, { status: 202 }),
  ),

  http.get('http://localhost:8080/generate/status/:jobId', () =>
    HttpResponse.json({ status: 'COMPLETED', missionId: 1 }),
  ),
]
