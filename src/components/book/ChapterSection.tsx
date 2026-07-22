import type { Chapter, ContentBlock } from "@/lib/book"
import { RecipeCard } from "./RecipeCard"
import { IntroBlock } from "./IntroBlock"
import { EquipmentTable } from "./EquipmentTable"
import { PhotoGrid } from "./PhotoGrid"
import { DownloadList } from "./DownloadList"

type Props = {
  chapter: Chapter
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.kind) {
    case "recipe":
      return <RecipeCard recipe={block} />
    case "intro":
      return <IntroBlock block={block} />
    case "equipTable":
      return <EquipmentTable block={block} />
    case "photoGrid":
      return <PhotoGrid block={block} />
    case "downloads":
      return <DownloadList block={block} />
  }
}

export function ChapterSection({ chapter }: Props) {
  return (
    <section aria-labelledby={`${chapter.id}-title`} className="border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <header id={chapter.id} className="mb-8 scroll-mt-20">
          <p className="mb-2 text-[0.6875rem] tracking-[0.35em] text-[var(--color-dawn-gold)] uppercase">
            Chapter {chapter.number}
          </p>
          <h2
            id={`${chapter.id}-title`}
            className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl"
          >
            {chapter.title}
          </h2>
          {chapter.description && (
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {chapter.description}
            </p>
          )}
        </header>

        <div className="space-y-6">
          {chapter.blocks.map((block, index) => (
            <BlockRenderer key={index} block={block} />
          ))}
        </div>
      </div>
    </section>
  )
}
