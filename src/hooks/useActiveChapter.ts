"use client"

import { useEffect, useState } from "react"

/**
 * 스크롤 위치에 해당하는 챕터 id 를 돌려준다.
 * 원본 index.html 의 IntersectionObserver 하이라이트 동작을 대체한다.
 */
export function useActiveChapter(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [ids.join(",")]) // eslint-disable-line react-hooks/exhaustive-deps

  return activeId
}
