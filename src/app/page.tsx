import { BookCover } from "@/components/book/BookCover"
import { IntroBlock } from "@/components/book/IntroBlock"
import { TableOfContents } from "@/components/book/TableOfContents"
import { ChapterSection } from "@/components/book/ChapterSection"
import { BackToTop } from "@/components/ui/BackToTop"
import { book } from "@/lib/book"

export default function RecipeBookPage() {
  return (
    <>
      <BookCover cover={book.cover} />

      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <IntroBlock block={book.overview} />
        </div>
      </div>

      <TableOfContents chapters={book.chapters} />

      {book.chapters.map((chapter) => (
        <ChapterSection key={chapter.id} chapter={chapter} />
      ))}

      <BackToTop />
    </>
  )
}
