import { getChapterRecipes, type Chapter } from "@/lib/book"

type Props = {
  chapters: Chapter[]
}

export function TableOfContents({ chapters }: Props) {
  return (
    <section
      aria-labelledby="toc-title"
      className="border-t border-[var(--color-border)] print-page-break"
    >
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h2
          id="toc-title"
          className="mb-8 font-[family-name:var(--font-serif)] text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl"
        >
          목차
        </h2>

        {/* 원본은 2단 컬럼 고정이라 모바일에서 읽기 어려웠다. 좁은 화면은 1단으로 떨어뜨린다. */}
        <ol className="grid gap-3 md:grid-cols-2">
          {chapters.map((chapter) => {
            const recipes = getChapterRecipes(chapter)
            return (
              <li key={chapter.id} className="print-avoid-break">
                <a
                  href={`#${chapter.id}`}
                  className="block h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 transition-colors hover:border-[var(--color-dawn-gold)]"
                >
                  <span className="flex items-baseline gap-2">
                    <span className="text-[0.6875rem] tracking-widest text-[var(--color-dawn-gold)]">
                      {chapter.number.padStart(2, "0")}
                    </span>
                    <span className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-text-primary)]">
                      {chapter.title}
                    </span>
                  </span>
                  {recipes.length > 0 && (
                    <span className="mt-2 block text-[0.8125rem] leading-relaxed text-[var(--color-text-secondary)]">
                      {recipes.map((recipe) => recipe.title.replace(/^\d+\.\s*/, "")).join(" · ")}
                    </span>
                  )}
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
