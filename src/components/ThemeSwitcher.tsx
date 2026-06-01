import { useEffect, useState } from 'react'
import { Palette, X, Check } from 'lucide-react'

/**
 * 검토용 라이브 테마 전환 위젯.
 * 오너가 배포 사이트에서 색상 방향을 비교하기 위한 임시 도구입니다.
 * 디자인 확정 후 선택 테마를 @theme 에 반영하고 이 컴포넌트는 제거하세요.
 */

type Theme = {
  key: string
  name: string
  tag: string
  swatches: [string, string, string]
}

const THEMES: Theme[] = [
  { key: 'mint', name: '민트 + 코랄', tag: '현재', swatches: ['#1F9A8E', '#FF7A4D', '#FFC233'] },
  { key: 'blue', name: '차분한 블루', tag: '신뢰', swatches: ['#1E5F8C', '#2AA99A', '#84ACF7'] },
  { key: 'lavender', name: '라벤더 + 피치', tag: '정서', swatches: ['#8560CF', '#FB8568', '#EAA9D2'] },
  { key: 'orange', name: '생기발랄', tag: '에너지', swatches: ['#FB8324', '#25B2C3', '#FFD23F'] },
]

const STORAGE_KEY = 'kp-theme'

function readInitial(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'mint'
  } catch {
    return 'mint'
  }
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>(readInitial)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'mint') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  return (
    <div className="fixed bottom-5 right-5 z-[60] print:hidden">
      {/* Panel */}
      {open && (
        <div className="mb-3 w-72 rounded-2xl border border-black/5 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-ink">색상 테마 미리보기</p>
              <p className="text-xs text-muted">검토용 — 클릭해서 비교해 보세요</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-black/5"
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ul className="mt-3 space-y-2">
            {THEMES.map((t) => {
              const active = t.key === theme
              return (
                <li key={t.key}>
                  <button
                    type="button"
                    onClick={() => setTheme(t.key)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition ${
                      active
                        ? 'border-brand-400 bg-brand-50'
                        : 'border-transparent hover:bg-black/[0.03]'
                    }`}
                  >
                    <span className="flex shrink-0">
                      {t.swatches.map((c, i) => (
                        <span
                          key={i}
                          className="h-6 w-6 rounded-full ring-2 ring-white"
                          style={{ backgroundColor: c, marginLeft: i === 0 ? 0 : -8 }}
                        />
                      ))}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-ink">{t.name}</span>
                      <span className="block text-xs text-muted">{t.tag}</span>
                    </span>
                    {active && <Check className="h-4 w-4 text-brand-600" aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 font-bold text-white shadow-card transition hover:scale-105"
        aria-expanded={open}
        aria-label="색상 테마 미리보기 열기"
      >
        <Palette className="h-5 w-5" aria-hidden="true" />
        <span className="text-sm">테마</span>
      </button>
    </div>
  )
}
