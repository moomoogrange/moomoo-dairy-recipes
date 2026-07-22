"use client"

import { useEffect, useRef, useState } from "react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { PrintButton } from "@/components/ui/PrintButton"
import { useActiveChapter } from "@/hooks/useActiveChapter"
import type { NavItem } from "@/lib/book"

type Props = {
  nav: NavItem[]
}

const chapterIds = (nav: NavItem[]) => nav.map((item) => item.href.replace("#", ""))

export function SiteHeader({ nav }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeId = useActiveChapter(chapterIds(nav))
  const chipsRef = useRef<HTMLElement>(null)

  // 칩 목록이 화면보다 길어 뒤쪽 챕터가 잘린다. 활성 칩을 항상 보이는 위치로 끌어온다.
  useEffect(() => {
    if (!activeId || !chipsRef.current) return
    const chip = chipsRef.current.querySelector(`a[href="#${activeId}"]`)
    chip?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }, [activeId])

  return (
    <header className="no-print sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2 font-[family-name:var(--font-display)] text-xl italic tracking-wide text-[var(--color-dawn-gold)] transition-opacity hover:opacity-80 sm:text-2xl"
        >
          MooMoo
          <span className="hidden text-sm not-italic tracking-[0.2em] text-[var(--color-text-secondary)] sm:inline">
            RECIPE BOOK
          </span>
        </a>

        {/* 데스크탑: 챕터 칩을 가로 스크롤로 노출한다. */}
        <nav
          ref={chipsRef}
          aria-label="챕터"
          className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {nav.map((item) => {
            const isActive = activeId === item.href.replace("#", "")
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[var(--color-dawn-gold)] text-[var(--color-bg-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-dawn-gold)]"
                }`}
              >
                <span className={`text-[0.625rem] ${isActive ? "opacity-70" : "text-[var(--color-dawn-gold)]"}`}>
                  {item.number}
                </span>
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <PrintButton />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "챕터 메뉴 닫기" : "챕터 메뉴 열기"}
            aria-expanded={menuOpen}
            className="flex size-11 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-dawn-gold)] lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일: 챕터를 2열 그리드 드로어로 펼친다. 가로 스크롤 칩보다 탐색이 쉽다. */}
      {menuOpen && (
        <nav
          aria-label="챕터 (모바일)"
          className="max-h-[70vh] overflow-y-auto border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 lg:hidden"
        >
          <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {nav.map((item) => {
              const isActive = activeId === item.href.replace("#", "")
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-[var(--color-dawn-gold)] text-[var(--color-bg-primary)]"
                        : "text-[var(--color-text-primary)] hover:bg-[var(--color-accent-soft)]"
                    }`}
                  >
                    <span
                      className={`text-xs ${isActive ? "opacity-70" : "text-[var(--color-dawn-gold)]"}`}
                    >
                      {item.number}
                    </span>
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}
