import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '🧠',
    title: 'RAG 기반 학습',
    desc: '최신 TDD 방법론과 우아한테크코스 스타일 가이드를 학습한 AI가 코드 컨벤션부터 아키텍처까지 맞춤형 피드백을 제공합니다.',
  },
  {
    icon: '⚡',
    title: '원클릭 생성',
    desc: '복잡한 IDE 설정 없이 주제만 입력하면 build.gradle 설정이 완료된 완벽한 프로젝트 구조가 빠르게 생성됩니다.',
  },
  {
    icon: '💻',
    title: 'JUnit 테스트 포함',
    desc: '요구사항에 맞는 실패하는 테스트 케이스가 자동 생성됩니다. Red-Green-Refactor 사이클을 즉시 경험해보세요.',
  },
]

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-dark text-text-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-subtle bg-bg-dark/80 px-6 py-4 backdrop-blur-md lg:px-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧸</span>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">TeDDie</h1>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/generate" className="text-sm font-medium text-text-muted transition hover:text-text-primary">
            미션 생성
          </Link>
          <Link to="/missions" className="text-sm font-medium text-text-muted transition hover:text-text-primary">
            히스토리
          </Link>
        </nav>
        <Link
          to="/login"
          className="rounded-lg bg-brand-yellow px-6 py-2 text-sm font-bold text-bg-dark transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
        >
          로그인
        </Link>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 py-20 text-center lg:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-yellow opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-yellow" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-yellow">v2.0 Now Available</span>
          </div>

          <h2 className="text-4xl font-black leading-tight tracking-tight text-text-primary md:text-5xl lg:text-6xl">
            AI로 만드는 <br />
            <span className="text-brand-yellow">나만의 우테코 미션</span>
          </h2>

          <p className="max-w-xl text-lg leading-relaxed text-text-muted">
            주제와 난이도를 입력하면 완성된 Java TDD 프로젝트가 생성됩니다. 실전 같은 환경에서 코딩 테스트를 준비하세요.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/generate"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-yellow px-8 text-base font-bold text-bg-dark shadow-[0_0_20px_rgba(245,165,36,0.3)] transition hover:opacity-90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            >
              🚀 미션 생성하기
            </Link>
            <Link
              to="/missions"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface px-8 text-base font-medium text-text-primary transition hover:border-brand-yellow/50 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            >
              ▶ 미션 둘러보기
            </Link>
          </div>

          <p className="text-sm text-text-muted">1,200+ 개발자가 연습 중</p>
        </section>

        {/* Features */}
        <section className="bg-surface px-6 py-16 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-3xl font-bold text-text-primary">주요 기능</h2>
            <p className="mb-12 text-text-muted">
              TeDDie가 제공하는 강력한 학습 도구들을 확인해보세요.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {FEATURES.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-bg-dark p-6 transition hover:border-brand-yellow/40 md:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-yellow/10 text-2xl">
                    {icon}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-text-primary">{title}</h3>
                    <p className="text-sm leading-relaxed text-text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border-subtle bg-surface p-8 text-center md:p-12">
            <h2 className="mb-4 text-2xl font-bold text-text-primary md:text-4xl">지금 바로 미션을 시작하세요</h2>
            <p className="mx-auto mb-8 max-w-lg text-text-muted">
              더 이상 무엇을 만들지 고민하지 마세요. TeDDie가 당신의 성장을 위한 최적의 문제를 제안합니다.
            </p>
            <Link
              to="/generate"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-yellow px-8 text-base font-bold text-bg-dark transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            >
              무료로 시작하기
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-bg-dark px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧸</span>
            <span className="font-bold text-text-primary">TeDDie</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-text-muted">
            <a href="#" className="transition hover:text-text-primary">이용약관</a>
            <a href="#" className="transition hover:text-text-primary">개인정보처리방침</a>
            <a href="#" className="transition hover:text-text-primary">문의하기</a>
            <a href="#" className="transition hover:text-text-primary">GitHub</a>
          </div>
          <p className="text-xs text-text-muted">© 2024 TeDDie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
